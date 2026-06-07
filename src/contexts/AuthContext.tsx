'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const personalUser = {
    id: 'personal-user-id',
    email: 'me@jarvis.local',
    user_metadata: { name: 'Personal User' },
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
  } as any;

  const [user, setUser] = useState<User | null>(personalUser);
  const [session, setSession] = useState<Session | null>({ user: personalUser, access_token: 'personal-token' } as any);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const signIn = async () => {};
  const signUp = async () => {};
  const signInWithGoogle = async () => {};
  const signOut = async () => {};

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
