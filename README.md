# Kairos ⚡

**Kairos** is my personalized, intelligent companion workspace and scheduler built to help me manage tasks, track focus sessions, and maintain productivity.

I built this application because generic productivity tools felt dry. I wanted an interface that felt alive, visual, and customizable to my workflow.

---

## Key Features

### 1. Task Board & AI-Powered Scheduler 📅
* **Interactive Kanban/List Board**: Manage tasks directly on my dashboard.
* **Focus Mode**: A dedicated Pomodoro-style timer to track deep work sessions.
* **Distraction Logging**: Keep track of what takes me out of the zone and review them later.

### 2. Analytics Dashboard 📊
* **Productivity Score**: Calculates weekly and daily scores based on completed tasks.
* **Focus Time Tracker**: Visual graphs illustrating total hours focused.

---

## Tech Stack
* **Frontend**: Next.js 14 (App Router), React, TypeScript
* **Animations**: Framer Motion for smooth physics, snapping, and dragging
* **Database & Auth**: Supabase Auth (with Google OAuth) & PostgreSQL
* **Styling**: Vanilla CSS and Tailwind CSS customized for visual excellence
* **State Management**: React Context API (`AppContext` and `AuthContext`)

---

## Getting Started

### Prerequisites
* Node.js 18+
* npm or yarn
* Supabase Account
* OpenAI API key (for intelligent rescheduling suggestions)

### Installation & Local Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/tezendrax/Jarvis-TT.git
   cd Jarvis-TT
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role
   OPENAI_API_KEY=your_openai_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it.

---

## Project Structure
* `/src/app/dashboard/page.tsx`: My primary workspace dashboard containing the Task Board, Focus Mode, and companion integration.
* `/src/contexts/AppContext.tsx`: Application-wide scheduling and state context.

---

*Built with ⚡ to make scheduling and productivity fun again.*
