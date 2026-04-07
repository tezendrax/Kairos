# 🚀 Jarvis Scheduler - Complete Hosting Setup

## Option 1: Deploy to Vercel (Recommended - Easiest)

### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit - Jarvis Scheduler"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jarvis-scheduler.git
git push -u origin main
```

### Step 2: Deploy with Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your `jarvis-scheduler` repository
5. Vercel will auto-detect Next.js settings

### Step 3: Set Environment Variables in Vercel Dashboard
Go to Project Settings > Environment Variables and add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your_random_secret
```

### Step 4: Deploy!
Click "Deploy" and your site will be live at `https://your-project.vercel.app`

---

## Option 2: Deploy to Netlify

### Step 1: Build Command
```bash
npm run build
```

### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your `.next` folder
3. Or connect your GitHub repository

---

## Option 3: Deploy to Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Deploy
```bash
railway login
railway init
railway up
```

---

## 🔧 Required Services Setup

### 1. Supabase (Database + Auth)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Run this SQL in the SQL editor:

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

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own time blocks" ON public.time_blocks FOR ALL USING (auth.uid() = user_id);
```

4. Enable Google OAuth in Authentication > Providers

### 2. OpenAI (AI Features)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add to environment variables

### 3. Google OAuth (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://your-domain.vercel.app/auth/callback/google`

---

## 🌐 Your Live Website Features

Once deployed, your website will have:

✅ **Landing Page** - Professional design with animations  
✅ **User Authentication** - Sign up/sign in with email or Google  
✅ **Dashboard** - Interactive task management and scheduling  
✅ **AI Assistant** - OpenAI-powered rescheduling and summaries  
✅ **Focus Mode** - Pomodoro timer with notifications  
✅ **Analytics** - Productivity tracking and insights  
✅ **Mobile Responsive** - Works perfectly on all devices  
✅ **Real-time Updates** - Live data synchronization  

## 📱 API Endpoints Available

- `POST /api/ai` - AI-powered responses
- `GET /api/tasks` - User tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## 🎯 Quick Start Commands

```bash
# Test locally
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod

# Deploy preview
vercel
```

Your Jarvis Scheduler will be live and fully functional! 🚀

