import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  wake_up_time: string;
  sleep_time: string;
  work_hours_start: string;
  work_hours_end: string;
  focus_mode_enabled: boolean;
  notification_settings: NotificationSettings;
}

export interface NotificationSettings {
  morning_summary: boolean;
  evening_summary: boolean;
  task_reminders: boolean;
  focus_mode_alerts: boolean;
  reschedule_notifications: boolean;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  estimated_minutes: number;
  due_at?: string;
  scheduled_block_id?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface TimeBlock {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  type: 'study' | 'work' | 'focus' | 'break' | 'personal';
  source: 'auto' | 'manual';
  task_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface SessionLog {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  activity_type: string;
  interruptions_count: number;
  focus_score: number;
  created_at: string;
}

export interface ConversationContext {
  id: string;
  user_id: string;
  last_10_messages: string[];
  embeddings: number[];
  updated_at: string;
}
