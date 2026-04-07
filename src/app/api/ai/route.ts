import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    // Dynamic import to avoid build-time issues
    const { 
      generateRescheduleSuggestion, 
      generateMorningSummary, 
      generateEveningSummary, 
      generateFocusModeSuggestion, 
      generateNudge 
    } = await import('@/lib/openai');

    let response;

    switch (type) {
      case 'reschedule':
        response = await generateRescheduleSuggestion(
          data.missedTime,
          data.currentTasks,
          data.userPreferences
        );
        break;

      case 'morning_summary':
        response = await generateMorningSummary(
          data.tasks,
          data.calendarEvents,
          data.userPreferences
        );
        break;

      case 'evening_summary':
        response = await generateEveningSummary(
          data.completedTasks,
          data.missedTasks,
          data.tomorrowTasks
        );
        break;

      case 'focus_mode':
        response = await generateFocusModeSuggestion(
          data.currentTask,
          data.distractions
        );
        break;

      case 'nudge':
        response = await generateNudge(
          data.task,
          data.timeOverdue
        );
        break;

      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 }
    );
  }
}
