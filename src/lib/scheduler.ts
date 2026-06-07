import { Task, TimeBlock, UserPreferences } from './supabase';
import { addMinutes, parse, format, isBefore, isAfter, startOfDay, addDays } from 'date-fns';

/**
 * Parses a "HH:mm" time string into a Date object for today
 */
export function timeStringToDate(timeStr: string, baseDate: Date = new Date()): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/**
 * Renders standard blocks for the day based on user preferences.
 * Routine slots:
 * - Wake up to Work Start: Routine block (type: personal)
 * - Work Start to Work End: Work blocks split by a Lunch break (12:00 - 13:00) and an afternoon break
 * - Work End to Dinner: Personal block
 * - Dinner (18:00 - 19:00): Break block
 * - Dinner to Sleep: Evening study/focus blocks
 */
export function generateBaseTimeBlocks(preferences: UserPreferences, date: Date = new Date()): TimeBlock[] {
  const blocks: Omit<TimeBlock, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = [];
  const baseDate = startOfDay(date);

  const wakeDate = timeStringToDate(preferences.wake_up_time, baseDate);
  const sleepDate = timeStringToDate(preferences.sleep_time, baseDate);
  const workStartDate = timeStringToDate(preferences.work_hours_start, baseDate);
  const workEndDate = timeStringToDate(preferences.work_hours_end, baseDate);

  // Handle sleep spanning past midnight
  let adjustedSleepDate = sleepDate;
  if (isBefore(sleepDate, wakeDate)) {
    adjustedSleepDate = addDays(sleepDate, 1);
  }

  // 1. Wake up routine (Wake up -> Work Start or 1.5 hours max)
  const routineEnd = isBefore(workStartDate, wakeDate) ? addMinutes(wakeDate, 90) : workStartDate;
  blocks.push({
    start_time: wakeDate.toISOString(),
    end_time: routineEnd.toISOString(),
    type: 'personal',
    source: 'auto',
    task_ids: [],
  });

  // 2. Work blocks (Work Start -> Work End)
  if (isAfter(workEndDate, workStartDate)) {
    const lunchStart = timeStringToDate('12:00', baseDate);
    const lunchEnd = timeStringToDate('13:00', baseDate);

    // Morning work block
    if (isBefore(workStartDate, lunchStart)) {
      blocks.push({
        start_time: workStartDate.toISOString(),
        end_time: lunchStart.toISOString(),
        type: 'work',
        source: 'auto',
        task_ids: [],
      });
    }

    // Lunch break
    blocks.push({
      start_time: lunchStart.toISOString(),
      end_time: lunchEnd.toISOString(),
      type: 'break',
      source: 'auto',
      task_ids: [],
    });

    // Afternoon work block
    if (isAfter(workEndDate, lunchEnd)) {
      blocks.push({
        start_time: lunchEnd.toISOString(),
        end_time: workEndDate.toISOString(),
        type: 'work',
        source: 'auto',
        task_ids: [],
      });
    }
  }

  // 3. Post-work transition & Dinner
  const dinnerStart = timeStringToDate('18:00', baseDate);
  const dinnerEnd = timeStringToDate('19:00', baseDate);

  if (isBefore(workEndDate, dinnerStart)) {
    blocks.push({
      start_time: workEndDate.toISOString(),
      end_time: dinnerStart.toISOString(),
      type: 'personal',
      source: 'auto',
      task_ids: [],
    });
  }

  // Dinner block
  blocks.push({
    start_time: dinnerStart.toISOString(),
    end_time: dinnerEnd.toISOString(),
    type: 'break',
    source: 'auto',
    task_ids: [],
  });

  // 4. Evening Focus Session (Dinner End -> 1.5 hours before Sleep)
  const eveningFocusEnd = addMinutes(dinnerEnd, 120); // 2 hours focus session
  if (isBefore(eveningFocusEnd, adjustedSleepDate)) {
    blocks.push({
      start_time: dinnerEnd.toISOString(),
      end_time: eveningFocusEnd.toISOString(),
      type: 'focus',
      source: 'auto',
      task_ids: [],
    });

    // Wind down personal time before sleep
    blocks.push({
      start_time: eveningFocusEnd.toISOString(),
      end_time: adjustedSleepDate.toISOString(),
      type: 'personal',
      source: 'auto',
      task_ids: [],
    });
  } else {
    blocks.push({
      start_time: dinnerEnd.toISOString(),
      end_time: adjustedSleepDate.toISOString(),
      type: 'personal',
      source: 'auto',
      task_ids: [],
    });
  }

  // Assign UUIDs and return
  return blocks.map((b, idx) => ({
    id: `block-${idx}-${baseDate.getDate()}`,
    user_id: 'demo-user-id',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...b,
  }));
}

/**
 * Distributes pending tasks into the generated schedule blocks.
 * Work, Focus, and Study blocks are eligible to receive tasks.
 * Sorted by priority descending (5 -> 1) and estimated minutes.
 */
export function allocateTasksToSchedule(timeBlocks: TimeBlock[], tasks: Task[]): TimeBlock[] {
  // Deep clone blocks
  const updatedBlocks = timeBlocks.map(block => ({ ...block, task_ids: [...block.task_ids] }));

  // Filter pending/in-progress tasks
  const pendingTasks = [...tasks].filter(t => t.status === 'pending' || t.status === 'in_progress');

  if (pendingTasks.length === 0) return updatedBlocks;

  // Separate tasks by energy level, sorted by priority (high to low) within each group
  const highEnergy = pendingTasks.filter(t => t.energy_level === 'high').sort((a, b) => b.priority - a.priority);
  const medEnergy = pendingTasks.filter(t => !t.energy_level || t.energy_level === 'medium').sort((a, b) => b.priority - a.priority);
  const lowEnergy = pendingTasks.filter(t => t.energy_level === 'low').sort((a, b) => b.priority - a.priority);

  for (const block of updatedBlocks) {
    // Only schedule tasks in focus, work, or study blocks
    if (block.type !== 'focus' && block.type !== 'work' && block.type !== 'study') {
      continue;
    }

    const start = new Date(block.start_time);
    const end = new Date(block.end_time);
    let blockCapacity = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

    // Determine task pull order based on block type (Energy-Level matching)
    let pullQueues: Task[][] = [];
    if (block.type === 'focus') {
      // Focus slots: High -> Medium -> Low
      pullQueues = [highEnergy, medEnergy, lowEnergy];
    } else if (block.type === 'work') {
      // Work slots: Medium -> High -> Low
      pullQueues = [medEnergy, highEnergy, lowEnergy];
    } else {
      // Study slots: Low -> Medium -> High
      pullQueues = [lowEnergy, medEnergy, highEnergy];
    }

    // Pull tasks and fill block capacity
    for (const queue of pullQueues) {
      let qIdx = 0;
      while (qIdx < queue.length && blockCapacity > 0) {
        const task = queue[qIdx];
        const taskMinutes = task.estimated_minutes || 30;

        if (taskMinutes <= blockCapacity + 15) { // Allow slight overflow of 15 mins
          block.task_ids.push(task.id);
          blockCapacity -= taskMinutes;
          // Remove from queue so it's not scheduled twice
          queue.splice(qIdx, 1);
        } else {
          qIdx++;
        }
      }
    }
  }

  // Schedule any remaining tasks that didn't fit energy preferences, sequentially
  const remaining = [...highEnergy, ...medEnergy, ...lowEnergy].sort((a, b) => b.priority - a.priority);
  if (remaining.length > 0) {
    for (const block of updatedBlocks) {
      if (block.type !== 'focus' && block.type !== 'work' && block.type !== 'study') {
        continue;
      }
      const start = new Date(block.start_time);
      const end = new Date(block.end_time);
      let currentAllocatedMinutes = tasks
        .filter(t => block.task_ids.includes(t.id))
        .reduce((sum, t) => sum + (t.estimated_minutes || 30), 0);
      let blockCapacity = Math.round((end.getTime() - start.getTime()) / (1000 * 60)) - currentAllocatedMinutes;

      let rIdx = 0;
      while (rIdx < remaining.length && blockCapacity > 0) {
        const task = remaining[rIdx];
        const taskMinutes = task.estimated_minutes || 30;
        
        if (taskMinutes <= blockCapacity + 10) {
          block.task_ids.push(task.id);
          blockCapacity -= taskMinutes;
          remaining.splice(rIdx, 1);
        } else {
          rIdx++;
        }
      }
    }
  }

  return updatedBlocks;
}

/**
 * Entry point to generate a complete schedule for the day
 */
export function generateDailySchedule(tasks: Task[], preferences: UserPreferences, date: Date = new Date()): TimeBlock[] {
  const baseBlocks = generateBaseTimeBlocks(preferences, date);
  return allocateTasksToSchedule(baseBlocks, tasks);
}

/**
 * Reschedules remaining time blocks of the day from a specific time.
 * Shifts blocks forward or merges missed blocks.
 */
export function rescheduleRemainingDay(
  currentTime: Date,
  timeBlocks: TimeBlock[],
  tasks: Task[],
  preferences: UserPreferences
): TimeBlock[] {
  const baseDate = startOfDay(currentTime);
  const baseBlocks = generateBaseTimeBlocks(preferences, baseDate);
  
  // Identify blocks that have already passed or are currently active
  const updatedBlocks: TimeBlock[] = [];
  const futureBlocks: TimeBlock[] = [];

  for (const block of timeBlocks) {
    const end = new Date(block.end_time);
    if (isBefore(end, currentTime)) {
      updatedBlocks.push(block); // Keep past blocks intact
    } else {
      futureBlocks.push(block);
    }
  }

  if (futureBlocks.length === 0) return timeBlocks;

  // Let's adjust future blocks to start from current time
  let startCursor = currentTime;
  const rescheduledFuture = futureBlocks.map((block, idx) => {
    const originalStart = new Date(block.start_time);
    const originalEnd = new Date(block.end_time);
    const duration = originalEnd.getTime() - originalStart.getTime();

    const newStart = startCursor;
    const newEnd = new Date(startCursor.getTime() + duration);

    startCursor = newEnd;

    return {
      ...block,
      start_time: newStart.toISOString(),
      end_time: newEnd.toISOString(),
      source: 'auto' as const,
      updated_at: new Date().toISOString(),
    };
  });

  // Re-allocate tasks for future blocks
  const allBlocks = [...updatedBlocks, ...rescheduledFuture];
  
  // Extract all future task allocations
  const pastTaskIds = new Set(updatedBlocks.flatMap(b => b.task_ids));
  
  // Re-schedule remaining pending tasks into the future blocks
  const remainingTasks = tasks.filter(t => !pastTaskIds.has(t.id));
  
  // Clear task allocations in future blocks
  const clearedFutureBlocks = rescheduledFuture.map(b => ({ ...b, task_ids: [] }));
  const allocatedFutureBlocks = allocateTasksToSchedule(clearedFutureBlocks, remainingTasks);

  return [...updatedBlocks, ...allocatedFutureBlocks];
}
