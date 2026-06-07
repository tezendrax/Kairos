'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, Task, TimeBlock, SessionLog, UserPreferences } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { generateDailySchedule, rescheduleRemainingDay } from '@/lib/scheduler';

interface ChatMessage {
  id: string;
  sender: 'jarvis' | 'user';
  text: string;
  timestamp: string;
  isTaskForm?: boolean;
  taskDraft?: {
    title: string;
    description?: string;
    priority: number;
    estimated_minutes: number;
    energy_level: 'high' | 'medium' | 'low';
  };
  formCompleted?: boolean;
}

interface AppContextType {
  tasks: Task[];
  timeBlocks: TimeBlock[];
  sessionLogs: SessionLog[];
  preferences: UserPreferences;
  messages: ChatMessage[];
  demoMode: boolean;
  activeFocusTask: Task | null;
  setActiveFocusTask: (task: Task | null) => void;
  addTask: (title: string, description?: string, priority?: number, estimated_minutes?: number, due_at?: string, energy_level?: 'high' | 'medium' | 'low') => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addTimeBlock: (start: string, end: string, type: TimeBlock['type']) => Promise<TimeBlock>;
  updateTimeBlock: (blockId: string, updates: Partial<TimeBlock>) => Promise<void>;
  deleteTimeBlock: (blockId: string) => Promise<void>;
  saveTimeBlocks: (blocks: TimeBlock[], targetDate?: Date) => Promise<void>;
  logFocusSession: (activityType: string, durationMinutes: number, interruptions: number, focusScore: number) => Promise<void>;
  rescheduleDay: (targetDate?: Date) => Promise<void>;
  sendMessageToKairos: (text: string) => Promise<void>;
  submitTaskFormMessage: (messageId: string, title: string, priority: number, duration: number, energy: 'high' | 'medium' | 'low') => Promise<void>;
  getMorningSummary: () => Promise<string>;
  getEveningSummary: () => Promise<string>;
  completeOnboarding: (wake: string, sleep: string, workStart: string, workEnd: string, priorities: string[]) => Promise<void>;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultPreferences: UserPreferences = {
  wake_up_time: '07:00',
  sleep_time: '23:00',
  work_hours_start: '09:00',
  work_hours_end: '17:00',
  focus_mode_enabled: true,
  notification_settings: {
    morning_summary: true,
    evening_summary: true,
    task_reminders: true,
    focus_mode_alerts: true,
    reschedule_notifications: true
  }
};

const defaultTasks = (userId: string): Task[] => [
  {
    id: 't-1',
    user_id: userId,
    title: 'Review Calculus Lectures',
    description: 'Go over limits and derivatives concepts for midterm prep',
    priority: 5,
    estimated_minutes: 90,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't-2',
    user_id: userId,
    title: 'Draft Project Proposal',
    description: 'Write the outline and feature list for Kairos App',
    priority: 4,
    estimated_minutes: 60,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't-3',
    user_id: userId,
    title: 'Gym Workout',
    description: 'Push day routine',
    priority: 3,
    estimated_minutes: 45,
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  
  const demoMode = !user || !isSupabaseConfigured;

  // Initial Load
  useEffect(() => {
    async function loadData() {
      if (!demoMode && user) {
        try {
          // 1. Load User Preferences
          const { data: prefData } = await supabase
            .from('users')
            .select('preferences')
            .eq('id', user.id)
            .single();

          if (prefData?.preferences) {
            setPreferences(prefData.preferences as UserPreferences);
          } else {
            // Create user preferences row
            await supabase.from('users').upsert({
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.name || 'User',
              preferences: defaultPreferences,
            });
            setPreferences(defaultPreferences);
          }

          // 2. Load Tasks
          const { data: taskData } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });
          if (taskData) setTasks(taskData as Task[]);

          // 3. Load Time Blocks
          const { data: blockData } = await supabase
            .from('time_blocks')
            .select('*')
            .eq('user_id', user.id)
            .order('start_time', { ascending: true });
          if (blockData) setTimeBlocks(blockData as TimeBlock[]);

          // 4. Load Session Logs
          const { data: logData } = await supabase
            .from('session_logs')
            .select('*')
            .eq('user_id', user.id);
          if (logData) setSessionLogs(logData as SessionLog[]);

        } catch (error) {
          console.error('Error fetching Supabase data, falling back to local storage', error);
        }
      } else {
        // Load from LocalStorage for Demo Mode
        const localPrefs = localStorage.getItem('jarvis_preferences');
        const localTasks = localStorage.getItem('jarvis_tasks');
        const localBlocks = localStorage.getItem('jarvis_timeblocks');
        const localLogs = localStorage.getItem('jarvis_sessionlogs');
        const localChat = localStorage.getItem('jarvis_chat');

        const userId = 'demo-user';

        if (localPrefs) setPreferences(JSON.parse(localPrefs));
        else setPreferences(defaultPreferences);

        let parsedTasks = localTasks ? JSON.parse(localTasks) : [];
        if (!localTasks) {
          parsedTasks = defaultTasks(userId);
          localStorage.setItem('jarvis_tasks', JSON.stringify(parsedTasks));
        }
        setTasks(parsedTasks);

        let parsedBlocks = localBlocks ? JSON.parse(localBlocks) : [];
        if (!localBlocks) {
          // Auto generate base schedule
          parsedBlocks = generateDailySchedule(parsedTasks, localPrefs ? JSON.parse(localPrefs) : defaultPreferences);
          localStorage.setItem('jarvis_timeblocks', JSON.stringify(parsedBlocks));
        }
        setTimeBlocks(parsedBlocks);

        if (localLogs) setSessionLogs(JSON.parse(localLogs));
        else setSessionLogs([]);

        if (localChat) {
          setMessages(JSON.parse(localChat));
        } else {
          const welcomeMsg: ChatMessage = {
            id: 'welcome',
            sender: 'jarvis',
            text: 'Hello! I am Kairos, your time-planning assistant. How can I help you plan your day? Try typing "/reschedule", "/summary", or just tell me about your tasks.',
            timestamp: new Date().toISOString()
          };
          setMessages([welcomeMsg]);
          localStorage.setItem('jarvis_chat', JSON.stringify([welcomeMsg]));
        }
      }
    }
    loadData();
  }, [user, demoMode]);

  // Sync state to local storage when state changes in Demo Mode
  useEffect(() => {
    if (demoMode) {
      localStorage.setItem('jarvis_preferences', JSON.stringify(preferences));
    }
  }, [preferences, demoMode]);

  useEffect(() => {
    if (demoMode) {
      localStorage.setItem('jarvis_tasks', JSON.stringify(tasks));
    }
  }, [tasks, demoMode]);

  useEffect(() => {
    if (demoMode) {
      localStorage.setItem('jarvis_timeblocks', JSON.stringify(timeBlocks));
    }
  }, [timeBlocks, demoMode]);

  useEffect(() => {
    if (demoMode) {
      localStorage.setItem('jarvis_sessionlogs', JSON.stringify(sessionLogs));
    }
  }, [sessionLogs, demoMode]);

  useEffect(() => {
    if (demoMode) {
      localStorage.setItem('jarvis_chat', JSON.stringify(messages));
    }
  }, [messages, demoMode]);

  // TASK ACTIONS
  const addTask = async (title: string, description?: string, priority: number = 3, estimated_minutes: number = 30, due_at?: string, energy_level: 'high' | 'medium' | 'low' = 'medium') => {
    const userId = user?.id || 'demo-user';
    const newTask: Task = {
      id: `task-${Date.now()}`,
      user_id: userId,
      title,
      description,
      priority: priority as Task['priority'],
      estimated_minutes,
      due_at,
      status: 'pending',
      energy_level,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!demoMode && user) {
      const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
      if (error) throw error;
      const savedTask = (data || newTask) as Task;
      setTasks(prev => [...prev, savedTask]);
      
      // Auto-update time blocks after adding
      const newBlocks = generateDailySchedule([...tasks, savedTask], preferences);
      setTimeBlocks(newBlocks);
      for (const b of newBlocks) {
        await supabase.from('time_blocks').upsert({
          id: b.id,
          user_id: user.id,
          start_time: b.start_time,
          end_time: b.end_time,
          type: b.type,
          source: b.source,
          task_ids: b.task_ids
        });
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('pikachu-task-start'));
      }
      return savedTask;
    } else {
      setTasks(prev => {
        const next = [...prev, newTask];
        const newBlocks = generateDailySchedule(next, preferences);
        setTimeBlocks(newBlocks);
        return next;
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('pikachu-task-start'));
      }
      return newTask;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!demoMode && user) {
      const { error } = await supabase.from('tasks').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', taskId);
      if (error) throw error;
    }
    
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));

    if (updates.status === 'completed') {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('pikachu-task-complete'));
      }
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!demoMode && user) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) throw error;
    }

    setTasks(prev => {
      const next = prev.filter(t => t.id !== taskId);
      const newBlocks = generateDailySchedule(next, preferences);
      setTimeBlocks(newBlocks);
      return next;
    });
  };

  // TIME BLOCK ACTIONS
  const addTimeBlock = async (start: string, end: string, type: TimeBlock['type']) => {
    const userId = user?.id || 'demo-user';
    const newBlock: TimeBlock = {
      id: `block-${Date.now()}`,
      user_id: userId,
      start_time: start,
      end_time: end,
      type,
      source: 'manual',
      task_ids: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (!demoMode && user) {
      const { data, error } = await supabase.from('time_blocks').insert(newBlock).select().single();
      if (error) throw error;
      const saved = (data || newBlock) as TimeBlock;
      setTimeBlocks(prev => [...prev, saved].sort((a,b) => a.start_time.localeCompare(b.start_time)));
      return saved;
    } else {
      setTimeBlocks(prev => [...prev, newBlock].sort((a,b) => a.start_time.localeCompare(b.start_time)));
      return newBlock;
    }
  };

  const updateTimeBlock = async (blockId: string, updates: Partial<TimeBlock>) => {
    if (!demoMode && user) {
      const { error } = await supabase.from('time_blocks').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', blockId);
      if (error) throw error;
    }

    setTimeBlocks(prev => prev.map(b => b.id === blockId ? { ...b, ...updates, updated_at: new Date().toISOString() } : b));
  };

  const deleteTimeBlock = async (blockId: string) => {
    if (!demoMode && user) {
      const { error } = await supabase.from('time_blocks').delete().eq('id', blockId);
      if (error) throw error;
    }

    setTimeBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const saveTimeBlocks = async (newBlocks: TimeBlock[], targetDate?: Date) => {
    const dateToUse = newBlocks.length > 0 ? new Date(newBlocks[0].start_time) : (targetDate || new Date());
    const targetDateStr = dateToUse.toDateString();

    const otherDaysBlocks = timeBlocks.filter(b => new Date(b.start_time).toDateString() !== targetDateStr);
    const sorted = [...otherDaysBlocks, ...newBlocks].sort((a, b) => a.start_time.localeCompare(b.start_time));
    setTimeBlocks(sorted);

    if (!demoMode && user) {
      try {
        const startOfDay = new Date(dateToUse);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateToUse);
        endOfDay.setHours(23, 59, 59, 999);

        await supabase.from('time_blocks')
          .delete()
          .eq('user_id', user.id)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString());

        if (newBlocks.length > 0) {
          await supabase.from('time_blocks').insert(newBlocks);
        }
      } catch (err) {
        console.error('Error saving manual time blocks:', err);
      }
    }
  };

  // LOG FOCUS SESSION
  const logFocusSession = async (activityType: string, durationMinutes: number, interruptions: number, focusScore: number) => {
    const userId = user?.id || 'demo-user';
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - durationMinutes * 60 * 1000);

    const log: SessionLog = {
      id: `log-${Date.now()}`,
      user_id: userId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      activity_type: activityType,
      interruptions_count: interruptions,
      focus_score: focusScore,
      created_at: new Date().toISOString()
    };

    if (!demoMode && user) {
      const { error } = await supabase.from('session_logs').insert(log);
      if (error) console.error('Error logging focus session in Supabase:', error);
    }

    setSessionLogs(prev => [...prev, log]);

    // Mark current active task as completed if focus score is high
    if (activeFocusTask && focusScore > 60) {
      await updateTask(activeFocusTask.id, { status: 'completed' });
      setActiveFocusTask(null);
    }
  };

  // RESCHEDULE TRIGGER
  const rescheduleDay = async (targetDate: Date = new Date()) => {
    const targetDateStr = targetDate.toDateString();

    const otherDaysBlocks = timeBlocks.filter(b => new Date(b.start_time).toDateString() !== targetDateStr);
    const targetDayBlocks = timeBlocks.filter(b => new Date(b.start_time).toDateString() === targetDateStr);

    const now = new Date();
    const rescheduleTime = now.toDateString() === targetDateStr ? now : (() => {
      const d = new Date(targetDate);
      d.setHours(7, 0, 0, 0);
      return d;
    })();

    const newBlocks = rescheduleRemainingDay(rescheduleTime, targetDayBlocks, tasks, preferences);
    const sorted = [...otherDaysBlocks, ...newBlocks].sort((a, b) => a.start_time.localeCompare(b.start_time));
    setTimeBlocks(sorted);

    if (!demoMode && user) {
      try {
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        await supabase.from('time_blocks')
          .delete()
          .eq('user_id', user.id)
          .gte('start_time', startOfDay.toISOString())
          .lte('start_time', endOfDay.toISOString());

        for (const b of newBlocks) {
          await supabase.from('time_blocks').upsert({
            id: b.id,
            user_id: user.id,
            start_time: b.start_time,
            end_time: b.end_time,
            type: b.type,
            source: b.source,
            task_ids: b.task_ids
          });
        }
      } catch (err) {
        console.error('Error updating rescheduled blocks:', err);
      }
    }

    const kMessage: ChatMessage = {
      id: `kairos-${Date.now()}`,
      sender: 'jarvis',
      text: `I've analyzed your progress and rescheduled the remainder of your schedule for ${targetDate.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}. Missed blocks have been pushed forward, and your high priority tasks have been reallocated. You're all set!`,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, kMessage]);
  };

  // SUBMIT INTERACTIVE TASK FORM FROM CHAT
  const submitTaskFormMessage = async (messageId: string, title: string, priority: number, duration: number, energy: 'high' | 'medium' | 'low') => {
    // 1. Add the task (this automatically reschedules blocks)
    await addTask(title, 'Created via interactive assistant card', priority, duration, undefined, energy);

    // 2. Update message in log
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          text: `I've successfully scheduled **"${title}"** into your timeline!\n\n• **Priority**: Level ${priority}\n• **Duration**: ${duration} mins\n• **Cognitive Load**: ${energy}`,
          formCompleted: true
        };
      }
      return msg;
    }));
  };

  // ONBOARDING COMPLETE
  const completeOnboarding = async (wake: string, sleep: string, workStart: string, workEnd: string, priorities: string[]) => {
    const newPrefs: UserPreferences = {
      ...preferences,
      wake_up_time: wake,
      sleep_time: sleep,
      work_hours_start: workStart,
      work_hours_end: workEnd,
    };

    setPreferences(newPrefs);

    // Add priority tasks
    const userId = user?.id || 'demo-user';
    const addedTasks: Task[] = [];
    
    for (let i = 0; i < priorities.length; i++) {
      const title = priorities[i];
      if (title.trim()) {
        const t: Task = {
          id: `task-onboarding-${i}-${Date.now()}`,
          user_id: userId,
          title,
          description: `Onboarding priority #${i + 1}`,
          priority: (5 - i) as Task['priority'], // 5, 4, 3 priority
          estimated_minutes: 60,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        addedTasks.push(t);
      }
    }

    if (!demoMode && user) {
      await supabase.from('users').upsert({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || 'User',
        preferences: newPrefs,
      });

      if (addedTasks.length > 0) {
        await supabase.from('tasks').insert(addedTasks);
      }
    }

    setTasks(prev => {
      const next = [...prev, ...addedTasks];
      const newBlocks = generateDailySchedule(next, newPrefs);
      setTimeBlocks(newBlocks);
      return next;
    });
  };

  // SUMMARIES
  const getMorningSummary = async (): Promise<string> => {
    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
    const priorityTitles = pending.slice(0, 3).map(t => `${t.title} (${t.estimated_minutes}m)`);
    
    let summaryText = '';
    if (priorityTitles.length > 0) {
      summaryText = `Good morning! Let's kick off a highly productive day. Today we are targeting your top priorities:\n\n` +
        priorityTitles.map((t, idx) => `${idx + 1}. ${t}`).join('\n') +
        `\n\nI recommend starting your first Work Session at ${preferences.work_hours_start}. Let's do this!`;
    } else {
      summaryText = `Good morning! Your task backlog is currently empty. Add some tasks using the board or tell me what you want to achieve today!`;
    }
    return summaryText;
  };

  const getEveningSummary = async (): Promise<string> => {
    const completed = tasks.filter(t => t.status === 'completed');
    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');

    let summaryText = `Great effort today! Here is your night reflection:\n\n` +
      `✓ Completed tasks: ${completed.length}\n` +
      `⌛ Remaining priorities: ${pending.length}\n\n`;

    if (sessionLogs.length > 0) {
      const totalFocus = sessionLogs.reduce((acc, log) => acc + Math.round((new Date(log.end_time!).getTime() - new Date(log.start_time).getTime()) / (1000 * 60)), 0);
      summaryText += `🔥 Logged Focus Time: ${totalFocus} minutes\n`;
    }

    summaryText += `Sleep well. Tomorrow we tackle the rest!`;
    return summaryText;
  };

  // CONVERSATIONAL CHATBOT
  const sendMessageToKairos = async (text: string) => {
    const uMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, uMessage]);

    // Parsing commands locally first
    const cleanText = text.trim().toLowerCase();

    // Setup a typing indicator
    const tempId = `kairos-typing-${Date.now()}`;
    
    // Simulate Kairos response delay
    setTimeout(async () => {
      let responseText = "I'm Kairos. I'm listening. Try commands like `/reschedule` to align your calendar blocks, `/summary` to get your day review, or say 'add [task]' to add a chore.";
      let isTaskForm = false;
      let taskDraft: any = undefined;

      // 1. Reschedule
      if (cleanText === '/reschedule' || cleanText.includes('reschedule') || cleanText.includes('re-schedule') || cleanText.includes('missed') || cleanText.includes('late')) {
        await rescheduleDay();
        return; // rescheduleDay adds its own Kairos response
      } 
      
      // 2. Summary
      else if (cleanText === '/summary' || cleanText.includes('summary') || cleanText.includes('morning')) {
        responseText = await getMorningSummary();
      } 
      else if (cleanText.includes('evening') || cleanText.includes('accomplished') || cleanText.includes('night')) {
        responseText = await getEveningSummary();
      } 

      // 3. Complete Task
      else if (cleanText.startsWith('complete ') || cleanText.startsWith('done ') || cleanText.startsWith('finish ')) {
        const titleToFind = cleanText.replace(/^(complete|done|finish)\s+/i, '').trim();
        const found = tasks.find(t => t.title.toLowerCase().includes(titleToFind) && t.status !== 'completed');
        if (found) {
          await updateTask(found.id, { status: 'completed' });
          responseText = `I've marked **"${found.title}"** as completed and updated your schedule blocks! Keep it up!`;
        } else {
          responseText = `I couldn't find any pending task matching "${titleToFind}" to complete.`;
        }
      }

      // 4. Delete Task
      else if (cleanText.startsWith('delete ') || cleanText.startsWith('remove ') || cleanText.startsWith('cancel ')) {
        const titleToFind = cleanText.replace(/^(delete|remove|cancel)\s+/i, '').trim();
        const found = tasks.find(t => t.title.toLowerCase().includes(titleToFind));
        if (found) {
          await deleteTask(found.id);
          responseText = `I've deleted the task **"${found.title}"** and reallocated your timeline blocks.`;
        } else {
          responseText = `I couldn't find any task matching "${titleToFind}" to delete.`;
        }
      }

      // 5. Change Priority or Energy
      else if (cleanText.includes('priority') && (cleanText.includes('set') || cleanText.includes('change') || cleanText.includes('make'))) {
        const numMatch = cleanText.match(/\b([1-5])\b/);
        const priorityVal = numMatch ? parseInt(numMatch[1]) : null;
        
        let foundTask = null;
        for (const t of tasks) {
          if (cleanText.includes(t.title.toLowerCase())) {
            foundTask = t;
            break;
          }
        }

        if (foundTask && priorityVal) {
          await updateTask(foundTask.id, { priority: priorityVal as any });
          responseText = `I've updated the priority of **"${foundTask.title}"** to Level ${priorityVal} and realigned your schedule blocks!`;
        } else {
          responseText = `I understand you want to change priority. Please specify: "change priority of [task title] to [1-5]".`;
        }
      }

      // 6. Interactive Form Addition
      else if (
        cleanText.startsWith('add ') || 
        cleanText.startsWith('create ') || 
        cleanText.startsWith('new task') || 
        cleanText === 'add task' ||
        cleanText === 'add new task'
      ) {
        let title = text.replace(/^(add task|add new task|add|create task|create)\s+/i, '').trim();
        if (!title || title.toLowerCase() === 'task' || title.toLowerCase() === 'new task') {
          title = 'New Task';
        }
        
        responseText = `Let's add **"${title}"** to your schedule. Customize the priority and energy settings on the card below:`;
        isTaskForm = true;
        taskDraft = {
          title,
          priority: 3,
          estimated_minutes: 30,
          energy_level: 'medium'
        };
      } 
      
      // 7. Focus Session Trigger
      else if (cleanText.includes('focus') || cleanText.includes('start timer') || cleanText.includes('pomodoro')) {
        const pending = tasks.filter(t => t.status === 'pending');
        if (pending.length > 0) {
          setActiveFocusTask(pending[0]);
          responseText = `Focus mode suggested for: **"${pending[0].title}"**. I have launched the Pomodoro modal for you. Let's block out all notifications!`;
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('open-focus-modal'));
          }
        } else {
          responseText = "You don't have any pending tasks to focus on! Add a task first.";
        }
      }
      else {
        // If OpenAI key is present, we could fetch from the server AI route
        if (isSupabaseConfigured && process.env.OPENAI_API_KEY) {
          try {
            const apiRes = await fetch('/api/ai', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'reschedule',
                data: {
                  missedTime: 'some slots',
                  currentTasks: tasks.map(t => t.title),
                  userPreferences: preferences
                }
              })
            });
            const apiData = await apiRes.json();
            if (apiData.response) responseText = apiData.response;
          } catch (e) {
            console.error('API call failed, falling back to local chat responder', e);
          }
        } else {
          // Standard conversational templates
          if (cleanText.includes('hello') || cleanText.includes('hi') || cleanText.includes('hey')) {
            responseText = "Hello! I am ready to guide you. Tell me what is on your mind, or let me clean up your schedule blocks.";
          } else if (cleanText.includes('help') || cleanText.includes('commands')) {
            responseText = "You can speak to me naturally, or use specific prompts:\n- **\"add [task]\"** to open an interactive scheduler form.\n- **\"/reschedule\"** or **\"reschedule my day\"** if you are running late.\n- **\"complete [task title]\"** to resolve a task.\n- **\"delete [task title]\"** to remove a task.\n- **\"/summary\"** to see your agenda.\n- **\"start focus session\"** to trigger the Pomodoro timer.";
          } else if (cleanText.includes('thank') || cleanText.includes('thanks')) {
            responseText = "You're welcome! Let's stay focused and crush your goals.";
          } else {
            responseText = `I understand you want to talk about: "${text}". I can help schedule it! You can add it using "add ${text}" or type /reschedule to align your current layout.`;
          }
        }
      }

      const kMessage: ChatMessage = {
        id: `kairos-${Date.now()}`,
        sender: 'jarvis',
        text: responseText,
        timestamp: new Date().toISOString(),
        isTaskForm,
        taskDraft
      };
      setMessages(prev => [...prev, kMessage]);

    }, 800);
  };

  const clearAllData = () => {
    if (demoMode) {
      localStorage.removeItem('jarvis_preferences');
      localStorage.removeItem('jarvis_tasks');
      localStorage.removeItem('jarvis_timeblocks');
      localStorage.removeItem('jarvis_sessionlogs');
      localStorage.removeItem('jarvis_chat');
    }
    setTasks([]);
    setTimeBlocks([]);
    setSessionLogs([]);
    setPreferences(defaultPreferences);
    setMessages([]);
    setActiveFocusTask(null);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        timeBlocks,
        sessionLogs,
        preferences,
        messages,
        demoMode,
        activeFocusTask,
        setActiveFocusTask,
        addTask,
        updateTask,
        deleteTask,
        addTimeBlock,
        updateTimeBlock,
        deleteTimeBlock,
        saveTimeBlocks,
        logFocusSession,
        rescheduleDay,
        sendMessageToKairos,
        submitTaskFormMessage,
        getMorningSummary,
        getEveningSummary,
        completeOnboarding,
        clearAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
