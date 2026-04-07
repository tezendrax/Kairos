# Environment Variables Setup for Jarvis Scheduler

## 🔧 Quick Setup Guide

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API
3. Copy your Project URL and API keys

### 2. OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create a new API key
3. Copy the key (starts with sk-)

### 3. Google OAuth Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-domain.vercel.app/auth/callback/google`

## 📝 Environment Variables to Set

Copy these to your Vercel dashboard (Project Settings > Environment Variables):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your_random_secret_string_at_least_32_characters
```

## 🗄️ Database Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority INTEGER CHECK (priority >= 1 AND priority <= 5),
  estimated_minutes INTEGER,
  due_at TIMESTAMP WITH TIME ZONE,
  scheduled_block_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time blocks table
CREATE TABLE public.time_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT CHECK (type IN ('study', 'work', 'focus', 'break', 'personal')),
  source TEXT DEFAULT 'manual' CHECK (source IN ('auto', 'manual')),
  task_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session logs table
CREATE TABLE public.session_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  activity_type TEXT NOT NULL,
  interruptions_count INTEGER DEFAULT 0,
  focus_score INTEGER CHECK (focus_score >= 0 AND focus_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own time blocks" ON public.time_blocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own session logs" ON public.session_logs FOR ALL USING (auth.uid() = user_id);
```

## 🚀 Deploy Commands

```bash
# Deploy to Vercel
vercel --prod

# Or use the batch file
deploy.bat
```

## ✅ After Deployment

Your website will be live with:
- ✅ User authentication
- ✅ Task management
- ✅ AI-powered scheduling
- ✅ Focus mode
- ✅ Analytics dashboard
- ✅ Mobile responsive design

## 🆘 Need Help?

Check the documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)

