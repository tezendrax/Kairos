import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if keys are actually configured and not placeholders
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your_supabase_url_here') && 
  !supabaseAnonKey.includes('your_supabase_anon_key_here')
);

// Create a stub auth client for demo purposes
let authChangeListener: any = null;

const mockAuth = {
  getSession: async () => {
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('demo_session') : null;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    return { data: { session }, error: null };
  },
  onAuthStateChange: (callback: any) => {
    authChangeListener = callback;
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('demo_session') : null;
    const session = sessionStr ? JSON.parse(sessionStr) : null;
    // Call callback with initial state
    setTimeout(() => callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session), 0);
    return {
      data: { subscription: { unsubscribe: () => { authChangeListener = null; } } },
    };
  },
  signInWithPassword: async ({ email }: any) => {
    const mockUser = { id: 'demo-user-id', email };
    const mockSession = { user: mockUser, access_token: 'demo-token' };
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_session', JSON.stringify(mockSession));
    }
    if (authChangeListener) {
      authChangeListener('SIGNED_IN', mockSession);
    }
    return { data: { user: mockUser, session: mockSession }, error: null };
  },
  signUp: async ({ email, options }: any) => {
    const name = options?.data?.name || 'Demo User';
    const mockUser = { id: 'demo-user-id', email, user_metadata: { name } };
    const mockSession = { user: mockUser, access_token: 'demo-token' };
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_session', JSON.stringify(mockSession));
    }
    if (authChangeListener) {
      authChangeListener('SIGNED_IN', mockSession);
    }
    return { data: { user: mockUser, session: mockSession }, error: null };
  },
  signOut: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_session');
    }
    if (authChangeListener) {
      authChangeListener('SIGNED_OUT', null);
    }
    return { error: null };
  },
};

// Create a stub database query builder
const mockDb = {
  select: () => mockDb,
  insert: () => mockDb,
  update: () => mockDb,
  delete: () => mockDb,
  upsert: () => mockDb,
  eq: () => mockDb,
  order: () => mockDb,
  then: (resolve: any) => resolve({ data: [], error: null }),
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : ({
      auth: mockAuth,
      from: () => mockDb,
    } as any);

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
  energy_level?: 'high' | 'medium' | 'low';
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
