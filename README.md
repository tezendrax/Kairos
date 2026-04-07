# Jarvis Scheduler

An intelligent, conversational scheduler + to-do system that proactively reschedules your day, summarizes tasks each morning/night, blocks distraction apps, and nudges you to complete priorities — acting like a personal Jarvis for students and professionals.

## Features

- **AI-Powered Scheduling**: Automatically reschedules your day when life happens
- **Focus Mode**: Block distractions and maintain deep focus sessions
- **Smart Summaries**: Morning and evening AI-generated summaries
- **Analytics Dashboard**: Track productivity and focus patterns
- **Calendar Integration**: Sync with Google Calendar (coming soon)
- **Gentle Nudges**: Intelligent reminders that respect your flow state

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **AI**: OpenAI GPT-3.5-turbo
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jarvis-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key_here

   # Google Calendar API (optional)
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here

   # App Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the database migrations (see Database Setup below)
   - Enable Google OAuth in Supabase Auth settings

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

Create the following tables in your Supabase database:

```sql
-- Users table (extends Supabase auth.users)
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

-- Conversation context table
CREATE TABLE public.conversation_context (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  last_10_messages TEXT[] DEFAULT '{}',
  embeddings VECTOR(1536), -- For OpenAI embeddings
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_context ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own time blocks" ON public.time_blocks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own session logs" ON public.session_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conversation context" ON public.conversation_context FOR ALL USING (auth.uid() = user_id);
```

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   └── ai/           # AI endpoints
│   ├── dashboard/         # Dashboard page
│   ├── onboarding/       # Onboarding flow
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── AuthModal.tsx     # Authentication modal
│   ├── FocusMode.tsx     # Focus mode component
│   └── AnalyticsDashboard.tsx # Analytics component
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication context
└── lib/                   # Utility libraries
    ├── supabase.ts       # Supabase client & types
    └── openai.ts         # OpenAI integration
```

## Key Features Implementation

### 1. AI-Powered Rescheduling
- Uses OpenAI GPT-3.5-turbo for intelligent rescheduling suggestions
- Considers user preferences, task priorities, and time constraints
- Provides realistic time estimates and motivational nudges

### 2. Focus Mode
- Pomodoro-style timer with customizable durations
- Visual progress indicators and motivational quotes
- Sound notifications and distraction blocking suggestions

### 3. Analytics Dashboard
- Tracks task completion rates, focus time, and productivity scores
- Visual charts showing weekly activity patterns
- AI-generated insights and recommendations

### 4. Authentication
- Supabase Auth with Google OAuth integration
- Secure user sessions and data protection
- Row-level security for data isolation

## API Endpoints

- `POST /api/ai` - AI-powered responses for rescheduling, summaries, and nudges

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [ ] Google Calendar integration
- [ ] Mobile app with native features
- [ ] Team/shared scheduling
- [ ] Advanced habit tracking
- [ ] Voice input/output
- [ ] Third-party app integrations (Todoist, Notion, etc.)

## Support

For support, email support@jarvis-scheduler.com or join our Discord community.

---

**Built with ❤️ for students and professionals who want to be more productive.**