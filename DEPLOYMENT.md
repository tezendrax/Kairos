# 🚀 Jarvis Scheduler - Deployment Guide

## Quick Deploy to Vercel

### Step 1: Install Vercel CLI (Already Done)
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Set Environment Variables
You need to set up these environment variables in Vercel:

#### Required Environment Variables:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# App Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_string
```

### Step 4: Deploy
```bash
# Deploy to production
npm run deploy

# Or deploy preview
npm run deploy:preview
```

## 🔧 Setup Instructions

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and API keys from Settings > API
4. Run the database schema from README.md

### 2. OpenAI Setup
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add it to your environment variables

### 3. Google OAuth Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs

## 🌐 Your Live Website

After deployment, your website will be available at:
- **Production**: `https://jarvis-scheduler.vercel.app`
- **Preview**: `https://jarvis-scheduler-git-main.vercel.app`

## 📱 Features Working in Production

✅ **Landing Page** - Beautiful responsive design  
✅ **Authentication** - Supabase Auth with Google OAuth  
✅ **Dashboard** - Full interactive dashboard  
✅ **AI Features** - OpenAI integration for scheduling  
✅ **Focus Mode** - Pomodoro timer with notifications  
✅ **Analytics** - Productivity tracking and insights  
✅ **API Endpoints** - All backend functionality  

## 🔄 Continuous Deployment

Once deployed, every push to your main branch will automatically deploy to production!

## 📞 Support

If you need help with deployment, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

