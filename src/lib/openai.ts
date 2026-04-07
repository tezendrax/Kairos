import OpenAI from 'openai';

// Initialize OpenAI only when API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// System prompts for different AI functions
export const SYSTEM_PROMPTS = {
  RESCHEDULER: `You are Jarvis Scheduler — a focused, pragmatic AI assistant for scheduling and productivity. The user is a student/professional. Use their calendar, priority flags, and habits to propose reschedules, create concise daily summaries, and suggest focus sessions. Offer alternate schedules when events shift. Keep replies ≤ 4 sentences for quick-read; include an actionable plan of up to 3 bullets and a one-line motivational nudge. Never provide medical/legal advice. Always respect privacy: never share or expose private notes in dialogue.`,

  MORNING_SUMMARY: `You are Jarvis Scheduler providing a morning summary. Create a concise, motivating overview of the user's day ahead. Include:
- 3 priority tasks with time estimates
- Suggested wake-up time if different from planned
- One focus session recommendation
- A brief motivational message
Keep it under 100 words and use a confident, slightly witty tone.`,

  EVENING_SUMMARY: `You are Jarvis Scheduler providing an evening summary. Review the user's day and provide:
- What was accomplished vs planned
- Tomorrow's top 3 priorities
- Suggested improvements for tomorrow
- A brief reflection or encouragement
Keep it under 100 words and use a supportive, slightly sarcastic but empathetic tone.`,

  FOCUS_MODE: `You are Jarvis Scheduler suggesting focus mode activation. Provide:
- Why focus mode would help right now
- Suggested duration (15-60 minutes)
- What to focus on specifically
- One tip for staying focused
Keep it under 50 words and use a firm but encouraging tone.`,

  NUDGE: `You are Jarvis Scheduler sending a gentle nudge. Provide:
- Brief reminder of current task/priority
- Why it's important to start now
- One actionable next step
- Brief encouragement
Keep it under 30 words and use a gentle but persistent tone.`
};

export async function generateRescheduleSuggestion(
  missedTime: string,
  currentTasks: string[],
  userPreferences: any
): Promise<string> {
  if (!openai) {
    return "I'll help you reschedule your day. Let me create a new plan.";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.RESCHEDULER
        },
        {
          role: "user",
          content: `I missed ${missedTime} of my planned schedule. My current tasks are: ${currentTasks.join(', ')}. My preferences: wake up at ${userPreferences.wakeUpTime}, work hours ${userPreferences.workHoursStart}-${userPreferences.workHoursEnd}. Please suggest a realistic reschedule.`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "I'll help you reschedule your day. Let me create a new plan.";
  } catch (error) {
    console.error('Error generating reschedule suggestion:', error);
    return "I'm having trouble accessing my scheduling capabilities right now. Please try again in a moment.";
  }
}

export async function generateMorningSummary(
  tasks: string[],
  calendarEvents: string[],
  userPreferences: any
): Promise<string> {
  if (!openai) {
    return "Good morning! I'm ready to help you plan your day.";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.MORNING_SUMMARY
        },
        {
          role: "user",
          content: `Generate a morning summary for today. Tasks: ${tasks.join(', ')}. Calendar events: ${calendarEvents.join(', ')}. User preferences: wake up ${userPreferences.wakeUpTime}, work ${userPreferences.workHoursStart}-${userPreferences.workHoursEnd}.`
        }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content || "Good morning! Ready to tackle your priorities today?";
  } catch (error) {
    console.error('Error generating morning summary:', error);
    return "Good morning! I'm ready to help you plan your day.";
  }
}

export async function generateEveningSummary(
  completedTasks: string[],
  missedTasks: string[],
  tomorrowTasks: string[]
): Promise<string> {
  if (!openai) {
    return "Thanks for a productive day! Rest well and see you tomorrow.";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.EVENING_SUMMARY
        },
        {
          role: "user",
          content: `Generate an evening summary. Completed today: ${completedTasks.join(', ')}. Missed: ${missedTasks.join(', ')}. Tomorrow's priorities: ${tomorrowTasks.join(', ')}.`
        }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content || "Great work today! Let's make tomorrow even better.";
  } catch (error) {
    console.error('Error generating evening summary:', error);
    return "Thanks for a productive day! Rest well and see you tomorrow.";
  }
}

export async function generateFocusModeSuggestion(
  currentTask: string,
  distractions: string[]
): Promise<string> {
  if (!openai) {
    return "Ready to focus? Let's block distractions and get productive.";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.FOCUS_MODE
        },
        {
          role: "user",
          content: `Suggest focus mode for current task: ${currentTask}. Potential distractions: ${distractions.join(', ')}.`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "Time to focus! Let's block distractions and get this done.";
  } catch (error) {
    console.error('Error generating focus mode suggestion:', error);
    return "Ready to focus? Let's block distractions and get productive.";
  }
}

export async function generateNudge(
  task: string,
  timeOverdue: string
): Promise<string> {
  if (!openai) {
    return "Ready to tackle your next priority?";
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPTS.NUDGE
        },
        {
          role: "user",
          content: `Generate a gentle nudge for task: ${task}. Time overdue: ${timeOverdue}.`
        }
      ],
      max_tokens: 60,
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content || "Time to get started on your priority task!";
  } catch (error) {
    console.error('Error generating nudge:', error);
    return "Ready to tackle your next priority?";
  }
}
