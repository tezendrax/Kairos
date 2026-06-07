# Jarvis TT ⚡

**Jarvis TT** is my personalized, intelligent companion workspace and scheduler built to help me manage tasks, track focus sessions, and maintain productivity. It features a custom **nostalgic 1997-style classic hand-drawn Pikachu companion** that walks around my dashboard, snaps to task cards, responds to drags, and keeps me company.

I built this application because generic productivity tools felt dry. I wanted an interface that felt alive, visual, and customizable to my workflow.

---

## Key Features

### 1. Nostalgic 1997 hand-drawn Pikachu Companion 🐭⚡
I integrated a classic, hand-drawn anime Pikachu assistant that acts as a desktop widget:
* **Dynamic Animations**: Hand-drawn frame animations including Idle, Walking, Wave/Hello, Thunderbolt/Focus, and Peeking.
* **Corner Trajectory Snapping**: Pikachu detects the boundaries of task cards and sections on the dashboard and walks along their corners.
* **Draggable Widget**: I can drag Pikachu anywhere on my screen; he naturally drops back and snaps to the nearest card boundary when released.
* **Pokéball Summon/Recall Control**: If I need absolute quiet for deep focus, I can click the Pokéball button in the header or hover over Pikachu to recall him into his Pokéball. This completely hides the widget, stops all animations, and keeps him from disturbing me. I can summon him back at any time.
* **Classic Audio Feedback**: Complete with nostalgic retro sound effects from the 1997 Pokémon series for different actions and moods.

### 2. Task Board & AI-Powered Scheduler 📅
* **Interactive Kanban/List Board**: Manage tasks directly on my dashboard.
* **Focus Mode**: A dedicated Pomodoro-style timer to track deep work sessions.
* **Distraction Logging**: Keep track of what takes me out of the zone and review them later.

### 3. Analytics Dashboard 📊
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
* `/src/components/PikachuPartner.tsx`: The core logic for Pikachu's snapping trajectory, scroll parallax adjustments, drag physics, sound player, and Pokéball state sync.
* `/src/app/dashboard/page.tsx`: My primary workspace dashboard containing the Task Board, Focus Mode, and companion integration.
* `/public/images/pikachu/`: Cleaned transparent anime frames (Idle, Walk, Hello, Thunderbolt, Peek, Pokéball states).
* `/public/sounds/pikachu/`: Original high-quality audio clips.

---

*Built with ⚡ and nostalgia to make scheduling and productivity fun again.*
