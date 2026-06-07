'use client';

import { motion } from 'framer-motion';
import { 
  Sparkles,
  ArrowRight, 
  Shield, 
  Zap, 
  Brain,
  Compass,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/dashboard');
  };

  const highlights = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-Time Rescheduling",
      desc: "Missed your morning routine? Shift your timeline block instantly and let Kairos reorganize your priorities."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Deep Focus Pomodoro",
      desc: "Track flow states, log distractions, and play focus tones to protect your opportune work windows."
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col justify-between overflow-hidden relative selection:bg-primary selection:text-white">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />

      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary rounded-lg text-white shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Kairos
          </span>
        </div>
        <button 
          onClick={handleEnter}
          className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          Skip to Dashboard
        </button>
      </header>

      {/* Hero Body */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center text-center z-10 space-y-8 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Seize the opportune moment</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight">
            Schedule your day.<br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-accent bg-clip-text text-transparent">
              Own your time.
            </span>
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Meet Kairos — your personal, offline-first scheduling companion. It dynamically plans your day, 
            helps you manage priorities, tracks distraction-free focus zones, and keeps your schedule aligned.
          </p>
        </motion.div>

        {/* Enter Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-2.5 bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-primary/20 hover:shadow-primary/30 cursor-pointer"
          >
            Enter Workspace
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Highlight Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6 pt-10 text-left w-full max-w-2xl mx-auto"
        >
          {highlights.map((item, idx) => (
            <div 
              key={idx} 
              className="p-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl space-y-2.5 backdrop-blur-sm"
            >
              <div className="p-2 bg-primary/10 text-primary w-fit rounded-xl">
                {item.icon}
              </div>
              <h3 className="font-semibold text-sm text-white">{item.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-neutral-600 border-t border-white/[0.04] z-10">
        <p>&copy; {new Date().getFullYear()} Kairos Schedule Assistant. Private Personal Workspace.</p>
      </footer>
    </div>
  );
}
