'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Shield, 
  Settings, 
  User, 
  LogOut, 
  Brain, 
  Target, 
  BarChart3, 
  Menu, 
  X,
  Play,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  RefreshCw,
  Edit2,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import FocusMode from '@/components/FocusMode';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import JarvisChat from '@/components/JarvisChat';
import TaskBoard from '@/components/TaskBoard';
import PikachuPartner from '@/components/PikachuPartner';
import { allocateTasksToSchedule, generateDailySchedule } from '@/lib/scheduler';
import { personasData } from '@/lib/templates';

// SVG Pokéball Icon for header toggle button
const PokeballIconSmall = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M 10 50 A 40 40 0 0 1 90 50 Q 50 48 10 50 Z" fill="#ef4444" stroke="#475569" strokeWidth="6" />
    <path d="M 10 50 A 40 40 0 0 0 90 50 Q 50 52 10 50 Z" fill="#ffffff" stroke="#475569" strokeWidth="6" />
    <line x1="10" y1="50" x2="90" y2="50" stroke="#475569" strokeWidth="6" />
    <circle cx="50" cy="50" r="16" fill="#475569" />
    <circle cx="50" cy="50" r="9" fill="#ffffff" stroke="#475569" strokeWidth="3" />
  </svg>
);

const getMonthDays = (baseDate: Date) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstDayIndex = firstDay.getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthDays - i),
      isCurrentMonth: false
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true
    });
  }
  
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false
    });
  }
  
  return days;
};

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const { 
    tasks, 
    timeBlocks, 
    rescheduleDay, 
    activeFocusTask, 
    setActiveFocusTask, 
    demoMode, 
    updateTask,
    saveTimeBlocks,
    sessionLogs,
    preferences
  } = useApp();
  
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'schedule' | 'analytics'>('schedule');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedBlocks, setEditedBlocks] = useState<any[]>([]);
  const [isAutoAllocate, setIsAutoAllocate] = useState(true);
  const [modalError, setModalError] = useState('');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedPersonaId, setSelectedPersonaId] = useState('university');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarBaseDate, setCalendarBaseDate] = useState(new Date());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const [isElectrified, setIsElectrified] = useState(false);
  const [pikachuActive, setPikachuActive] = useState(true);

  // Synchronize Pikachu active state from localStorage and window events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('pikachu-active');
    if (stored !== null) {
      setPikachuActive(stored === 'true');
    }
    const handlePikaToggle = () => {
      setPikachuActive(prev => !prev);
    };
    window.addEventListener('pikachu-toggle', handlePikaToggle);
    return () => window.removeEventListener('pikachu-toggle', handlePikaToggle);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleThunder = () => {
      setIsElectrified(true);
      setTimeout(() => setIsElectrified(false), 1200);
    };
    window.addEventListener('pikachu-thunderbolt', handleThunder);
    return () => window.removeEventListener('pikachu-thunderbolt', handleThunder);
  }, []);

  const getWeekDates = (baseDate: Date) => {
    const dates = [];
    const temp = new Date(baseDate);
    const day = temp.getDay();
    const diff = temp.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(temp.setDate(diff));
    
    for (let i = 0; i < 7; i++) {
      dates.push(new Date(monday));
      monday.setDate(monday.getDate() + 1);
    }
    return dates;
  };
  
  const weekDates = getWeekDates(calendarBaseDate);

  const filteredBlocks = timeBlocks.filter(block => {
    const blockDate = new Date(block.start_time);
    return blockDate.toDateString() === selectedDate.toDateString();
  });

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setCalendarBaseDate(date);
  };

  const handleSelectToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCalendarBaseDate(today);
  };

  const handlePrevWeek = () => {
    setCalendarBaseDate(prev => {
      const next = new Date(prev);
      next.setDate(next.getDate() - 7);
      return next;
    });
  };

  const handleNextWeek = () => {
    setCalendarBaseDate(prev => {
      const next = new Date(prev);
      next.setDate(next.getDate() + 7);
      return next;
    });
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const completionProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const totalFocusMinutes = sessionLogs.reduce((acc, log) => {
    try {
      const elapsed = Math.round((new Date(log.end_time).getTime() - new Date(log.start_time).getTime()) / (1000 * 60));
      return acc + elapsed;
    } catch {
      return acc;
    }
  }, 0);

  const avgFocusScore = sessionLogs.length > 0
    ? Math.round(sessionLogs.reduce((acc, log) => acc + log.focus_score, 0) / sessionLogs.length)
    : 100;

  const distractionsCount = sessionLogs.reduce((acc, log) => acc + log.interruptions_count, 0);

  const isoToHhmm = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      return `${h}:${m}`;
    } catch (e) {
      return '12:00';
    }
  };

  const hhmmToMinutes = (hhmm: string) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  const hhmmToIso = (hhmm: string, referenceDateString?: string) => {
    const base = referenceDateString ? new Date(referenceDateString) : new Date();
    const [h, m] = hhmm.split(':').map(Number);
    base.setHours(h, m, 0, 0);
    return base.toISOString();
  };

  const handleOpenEditModal = () => {
    const blocks = filteredBlocks.map(block => ({
      id: block.id,
      type: block.type,
      startTimeHhmm: isoToHhmm(block.start_time),
      endTimeHhmm: isoToHhmm(block.end_time),
      task_ids: block.task_ids,
      created_at: block.created_at || selectedDate.toISOString()
    }));
    setEditedBlocks(blocks);
    setModalError('');
    setIsEditModalOpen(true);
  };

  const handleAddBlock = () => {
    setEditedBlocks(prev => [
      ...prev,
      {
        id: `block-manual-${Date.now()}-${Math.random()}`,
        type: 'work',
        startTimeHhmm: '12:00',
        endTimeHhmm: '13:00',
        task_ids: [],
        created_at: selectedDate.toISOString()
      }
    ]);
  };

  const handleUpdateBlockField = (index: number, field: string, value: any) => {
    setEditedBlocks(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleDeleteBlock = (index: number) => {
    setEditedBlocks(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveBlocks = async () => {
    setModalError('');
    
    for (const block of editedBlocks) {
      if (!block.startTimeHhmm || !block.endTimeHhmm) {
        setModalError('All blocks must have start and end times.');
        return;
      }
      
      const startMins = hhmmToMinutes(block.startTimeHhmm);
      const endMins = hhmmToMinutes(block.endTimeHhmm);
      
      if (startMins >= endMins) {
        setModalError(`Invalid times: Start time (${block.startTimeHhmm}) must be before end time (${block.endTimeHhmm}).`);
        return;
      }
    }

    const mapped = editedBlocks.map(block => {
      return {
        id: block.id,
        user_id: user?.id || 'demo-user',
        start_time: hhmmToIso(block.startTimeHhmm, selectedDate.toISOString()),
        end_time: hhmmToIso(block.endTimeHhmm, selectedDate.toISOString()),
        type: block.type as any,
        source: 'manual' as const,
        task_ids: isAutoAllocate ? [] : (block.task_ids || []),
        created_at: block.created_at || selectedDate.toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    const sorted = mapped.sort((a, b) => a.start_time.localeCompare(b.start_time));
    const finalBlocks = isAutoAllocate ? allocateTasksToSchedule(sorted, tasks) : sorted;
    
    try {
      await saveTimeBlocks(finalBlocks, selectedDate);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error(err);
      setModalError('Failed to save time blocks. Please try again.');
    }
  };

  const handleApplyTemplate = async (templateBlocks: any[]) => {
    const mapped = templateBlocks.map((block, idx) => {
      return {
        id: `block-preset-${idx}-${Date.now()}`,
        user_id: user?.id || 'demo-user',
        start_time: hhmmToIso(block.startTimeHhmm, selectedDate.toISOString()),
        end_time: hhmmToIso(block.endTimeHhmm, selectedDate.toISOString()),
        type: block.type,
        source: 'manual' as const,
        task_ids: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    });

    const sorted = mapped.sort((a, b) => a.start_time.localeCompare(b.start_time));
    const finalBlocks = allocateTasksToSchedule(sorted, tasks);

    try {
      await saveTimeBlocks(finalBlocks, selectedDate);
      setIsTemplateModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Keep current time updated
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen for open-focus-modal custom event from chatbot
  useEffect(() => {
    const handleOpenFocus = () => {
      setIsFocusModeOpen(true);
    };
    window.addEventListener('open-focus-modal', handleOpenFocus);
    return () => window.removeEventListener('open-focus-modal', handleOpenFocus);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="text-center z-10">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-lg shadow-primary/20"></div>
          <p className="text-slate-400 font-medium text-sm">Aligning your opportune timeline...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(taskId, { status: nextStatus });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Interactive Pikachu Companion */}
      <PikachuPartner />

      {/* Background neon glows */}
      <div className="absolute top-[-10%] left-[-15%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none animate-pulse-slower" />
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Mobile Header */}
      <div className="lg:hidden bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between z-40 backdrop-blur-md">
        <h1 className="text-xl font-display font-bold text-primary flex items-center gap-1.5">
          <Sparkles className="w-5 h-5 animate-pulse" />
          Kairos Workspace
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('pikachu-toggle'));
            }}
            className={`p-2 rounded-xl border transition-all ${
              pikachuActive
                ? 'bg-slate-950/40 border-slate-850/60 text-slate-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
            title={pikachuActive ? "Recall Pikachu" : "Summon Pikachu"}
          >
            <PokeballIconSmall className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-400 hover:text-primary animate-fadeIn"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-slate-800/60 flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg text-white shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <h1 className="text-xl font-display font-bold text-primary tracking-tight">Kairos</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5">
              <button 
                onClick={() => {
                  setCurrentView('schedule');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  currentView === 'schedule' 
                    ? 'text-white bg-primary/25 border border-primary/20 shadow-md shadow-primary/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Calendar className="w-5 h-5 text-primary" />
                Today's Workspace
              </button>
              <button 
                onClick={() => {
                  setCurrentView('analytics');
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  currentView === 'analytics' 
                    ? 'text-white bg-primary/25 border border-primary/20 shadow-md shadow-primary/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                Productivity Stats
              </button>
              <button 
                onClick={() => router.push('/')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5 rotate-180" />
                Return to Home
              </button>
            </nav>

            {/* Real-time Day Tracker Widget */}
            <div className="p-4 border-t border-slate-800/60 bg-slate-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Day Tracker</h4>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              
              {/* Task completion progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300 font-semibold">
                  <span>Task Progress</span>
                  <span className="font-mono">{completedCount}/{totalCount} ({completionProgress}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                  <div 
                    className="bg-gradient-to-r from-primary to-blue-500 h-full rounded-full transition-all duration-500 shadow-sm" 
                    style={{ width: `${completionProgress}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl shadow-sm animate-fadeIn">
                  <div className="text-sm font-bold text-slate-100 font-mono">{totalFocusMinutes}m</div>
                  <div className="text-[9px] text-slate-400 font-semibold mt-0.5">Focus Time</div>
                </div>
                <div className="p-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl shadow-sm animate-fadeIn">
                  <div className="text-sm font-bold text-slate-100 font-mono">{avgFocusScore}%</div>
                  <div className="text-[9px] text-slate-400 font-semibold mt-0.5">Focus Score</div>
                </div>
              </div>
              
              {distractionsCount > 0 && (
                <div className="flex items-center justify-between text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 font-medium">
                  <span>⚠️ distractions</span>
                  <span className="font-bold font-mono">{distractionsCount}</span>
                </div>
              )}
            </div>

            {/* Personal Workspace Info */}
            <div className="p-4 border-t border-slate-800/60 bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20">
                  P
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200">Personal Space</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 relative z-20">
          {/* Header */}
          <div className="bg-slate-900/40 border-b border-slate-800/80 px-6 py-4 shadow-sm backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-slate-100 flex items-center gap-2">
                  Welcome to your day, {user.user_metadata?.name || 'Explorer'}
                </h2>
                <p className="text-xs text-slate-400">{formatDate(currentTime)}</p>
              </div>
              <div className="flex items-center gap-5 sm:text-right">
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('pikachu-toggle'));
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl cursor-pointer font-semibold text-[11px] transition-all shadow-sm select-none group/toggle ${
                    pikachuActive 
                      ? 'bg-slate-950/40 hover:bg-slate-900 border-slate-800/60 text-slate-350 hover:text-slate-200' 
                      : 'bg-red-500/10 hover:bg-red-500/15 border-red-500/30 text-red-400 hover:text-red-350'
                  }`}
                  title={pikachuActive ? "Recall Pikachu" : "Summon Pikachu"}
                >
                  <PokeballIconSmall className={`w-3.5 h-3.5 group-hover/toggle:rotate-180 transition-transform duration-300 ${!pikachuActive ? 'opacity-80' : ''}`} />
                  <span>{pikachuActive ? "Disable Pikachu" : "Enable Pikachu"}</span>
                </button>
                <div className="min-w-[100px]">
                  <div className="text-xl font-mono font-bold text-primary tracking-tight">{formatTime(currentTime)}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">System timer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {currentView === 'schedule' ? (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start animate-fadeIn">
                <div className="xl:col-span-7 space-y-6">
                  {/* Weekly Calendar Strip */}
                  <div className="mb-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 shadow-sm backdrop-blur-md relative">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
                      <div className="flex items-center gap-2 relative">
                        <div 
                          onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/50 hover:bg-slate-900 rounded-xl cursor-pointer text-slate-250 hover:text-slate-100 font-display font-semibold text-xs select-none transition-all border border-slate-800/40"
                        >
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                          <span className="text-[8px] text-slate-500">▼</span>
                        </div>
                        
                        {/* Month Grid Popover */}
                        <AnimatePresence>
                          {isMonthPickerOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 5 }}
                              className="absolute top-10 left-0 bg-slate-900/95 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-4 w-72 z-50 text-slate-200"
                            >
                              <div className="flex items-center justify-between mb-3 border-b border-slate-800/60 pb-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const prevMonth = new Date(calendarBaseDate);
                                    prevMonth.setMonth(prevMonth.getMonth() - 1);
                                    setCalendarBaseDate(prevMonth);
                                  }}
                                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 text-[10px] cursor-pointer"
                                >
                                  ◀
                                </button>
                                <span className="text-xs font-bold font-display">
                                  {calendarBaseDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextMonth = new Date(calendarBaseDate);
                                    nextMonth.setMonth(nextMonth.getMonth() + 1);
                                    setCalendarBaseDate(nextMonth);
                                  }}
                                  className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-100 text-[10px] cursor-pointer"
                                >
                                  ▶
                                </button>
                              </div>
                              
                              <div className="grid grid-cols-7 gap-1 text-center text-[8px] uppercase font-bold text-slate-500 mb-1">
                                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                              </div>
                              
                              <div className="grid grid-cols-7 gap-1 text-center">
                                {getMonthDays(calendarBaseDate).map((dayObj, i) => {
                                  const daySelected = dayObj.date.toDateString() === selectedDate.toDateString();
                                  const dayToday = dayObj.date.toDateString() === new Date().toDateString();
                                  const hasSchedules = timeBlocks.some(b => new Date(b.start_time).toDateString() === dayObj.date.toDateString());
                                  
                                  return (
                                    <button
                                      key={i}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectDate(dayObj.date);
                                        setIsMonthPickerOpen(false);
                                      }}
                                      className={`p-1.5 rounded-lg text-[9px] font-mono transition-all relative cursor-pointer ${
                                        !dayObj.isCurrentMonth ? 'text-slate-600 hover:text-slate-500' :
                                        daySelected ? 'bg-primary text-white font-bold shadow-sm shadow-primary/20' :
                                        dayToday ? 'border border-primary/40 text-primary font-bold' :
                                        'hover:bg-slate-800 text-slate-300'
                                      }`}
                                    >
                                      {dayObj.date.getDate()}
                                      {hasSchedules && !daySelected && (
                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full" />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Calendar Navigation Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handlePrevWeek}
                          className="p-1.5 bg-slate-950/50 hover:bg-slate-900 border border-slate-800/40 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer text-[9px]"
                          title="Previous Week"
                        >
                          ◀
                        </button>
                        <button
                          onClick={handleSelectToday}
                          className="text-[9px] font-bold text-primary hover:bg-primary/10 border border-primary/20 px-2 py-1.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Today
                        </button>
                        <button
                          onClick={handleNextWeek}
                          className="p-1.5 bg-slate-950/50 hover:bg-slate-900 border border-slate-800/40 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer text-[9px]"
                          title="Next Week"
                        >
                          ▶
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {weekDates.map((date, idx) => {
                        const isSelected = date.toDateString() === selectedDate.toDateString();
                        const isToday = date.toDateString() === new Date().toDateString();
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayNum = date.getDate();

                        const dayBlocks = timeBlocks.filter(b => new Date(b.start_time).toDateString() === date.toDateString());
                        const blockTypes = Array.from(new Set(dayBlocks.map(b => b.type))).slice(0, 4);

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectDate(date)}
                            className={`flex flex-col items-center py-2 rounded-xl transition-all cursor-pointer relative min-h-[58px] z-10 ${
                              isSelected
                                ? 'text-white font-bold'
                                : 'bg-slate-950/40 border border-slate-900/60 hover:border-slate-850 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {isSelected && (
                              <motion.div
                                layoutId="activeDayBubble"
                                className="absolute inset-0 bg-gradient-to-b from-primary to-primary-600 rounded-xl -z-10 shadow-md shadow-primary/25"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}
                            
                            <span className="text-[8px] uppercase font-semibold tracking-wider opacity-75">{dayName}</span>
                            <span className="text-xs font-bold font-mono mt-0.5">{dayNum}</span>

                            <div className="flex gap-0.5 mt-1 justify-center h-1">
                              {blockTypes.map(type => (
                                <span key={type} className={`w-1 h-1 rounded-full ${
                                  type === 'work' ? 'bg-amber-400 shadow-[0_0_3px_#F59E0B]' :
                                  type === 'focus' ? 'bg-rose-400 shadow-[0_0_3px_#F43F5E]' :
                                  type === 'study' ? 'bg-indigo-400 shadow-[0_0_3px_#6366F1]' :
                                  type === 'break' ? 'bg-emerald-400 shadow-[0_0_3px_#10B981]' :
                                  'bg-slate-400'
                                }`} />
                              ))}
                            </div>
                            
                            {isToday && !isSelected && (
                              <span className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full animate-pulse" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Today's Schedule Timeline */}
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-sm backdrop-blur-md">
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h3 className="font-display font-bold text-slate-200 text-base">Your Schedule Timeline</h3>
                        <p className="text-xs text-slate-400">
                          {selectedDate.toDateString() === new Date().toDateString() 
                            ? 'Auto-allocated priority time slots' 
                            : `Timeline plan for ${selectedDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedPersonaId('university');
                            setSelectedTemplateIndex(0);
                            setIsTemplateModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-lg text-xs font-semibold border border-primary/25 transition-all cursor-pointer"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          Load Template
                        </button>
                        <button 
                          onClick={handleOpenEditModal}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700/60 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit Schedule
                        </button>
                        <button 
                          onClick={() => rescheduleDay(selectedDate)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/15 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg text-xs font-semibold border border-indigo-500/20 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Reschedule
                        </button>
                      </div>
                    </div>

                    {/* Timeline items */}
                    <div className="relative border-l border-slate-850 ml-4 pl-6 space-y-5">
                      {filteredBlocks.length === 0 ? (
                        <div className="text-center py-10 bg-slate-950/20 border border-dashed border-slate-800/80 rounded-2xl p-6">
                          <div className="w-12 h-12 bg-slate-900/60 rounded-full flex items-center justify-center border border-slate-800 mx-auto mb-3 text-slate-400">
                            <Calendar className="w-5 h-5 text-slate-400" />
                          </div>
                          <h4 className="text-xs font-bold text-slate-355">No time blocks scheduled for this day</h4>
                          <p className="text-[10px] text-slate-500 mt-1 max-w-[240px] mx-auto leading-normal">
                            Get started by loading a pre-built template from our library or initialize a fresh schedule with your backlog tasks.
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-4">
                            <button
                              onClick={() => {
                                setSelectedPersonaId('university');
                                setSelectedTemplateIndex(0);
                                setIsTemplateModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-lg text-[10px] font-semibold border border-primary/25 transition-all cursor-pointer"
                            >
                              Load Template Preset
                            </button>
                            <button
                              onClick={async () => {
                                const baseBlocks = generateDailySchedule([], preferences, selectedDate);
                                await saveTimeBlocks(baseBlocks, selectedDate);
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px] font-semibold border border-slate-700/60 transition-all cursor-pointer"
                            >
                              Initialize Baseline
                            </button>
                          </div>
                        </div>
                      ) : (
                        filteredBlocks.map((block) => {
                          const start = new Date(block.start_time);
                          const end = new Date(block.end_time);
                          const startStr = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          const endStr = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          
                          const isCurrent = selectedDate.toDateString() === new Date().toDateString() && currentTime >= start && currentTime <= end;
                          const blockTasks = tasks.filter(t => block.task_ids.includes(t.id));

                          let blockTitle = '';
                          if (blockTasks.length > 0) {
                            blockTitle = blockTasks.map(t => t.title).join(', ');
                          } else {
                            blockTitle = block.type === 'work' ? 'Work Session' :
                                         block.type === 'focus' ? 'Deep Focus Session' :
                                         block.type === 'study' ? 'Evening Study Block' :
                                         block.type === 'break' ? 'Rest Break' :
                                         'Personal Routine';
                          }

                          // Design type-based colored border cards
                          const typeStyles = {
                            work: 'from-amber-500/5 to-orange-500/5 border-amber-500/20 text-amber-200 hover:border-amber-500/30 bg-gradient-to-r',
                            focus: 'from-rose-500/5 to-purple-500/5 border-rose-500/20 text-rose-200 hover:border-rose-500/30 bg-gradient-to-r',
                            study: 'from-indigo-500/5 to-blue-500/5 border-indigo-500/20 text-indigo-200 hover:border-indigo-500/30 bg-gradient-to-r',
                            break: 'from-emerald-500/5 to-teal-500/5 border-emerald-500/20 text-emerald-200 hover:border-emerald-500/30 bg-gradient-to-r',
                            personal: 'from-slate-800/10 to-slate-900/10 border-slate-850 text-slate-300 hover:border-slate-800 bg-gradient-to-r'
                          };

                          const timeRemaining = Math.max(0, Math.round((end.getTime() - currentTime.getTime()) / (1000 * 60)));

                          return (
                            <div key={block.id} className="relative group">
                              {/* Dot indicator with neon pulse */}
                              <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-slate-950 transition-all ${
                                isCurrent 
                                  ? 'border-primary ring-4 ring-primary/20 scale-110 shadow-sm shadow-primary/20' 
                                  : 'border-slate-800 group-hover:border-slate-700'
                              }`} />

                              <div className={`p-4 rounded-xl border transition-all duration-300 ${
                                isElectrified
                                  ? 'from-yellow-500/15 to-yellow-600/5 border-yellow-400 shadow-[0_0_20px_rgba(251,191,36,0.65)] scale-[1.01] rotate-[0.3deg] bg-gradient-to-r'
                                  : isCurrent 
                                    ? 'from-primary/15 to-blue-500/5 border-primary/40 bg-gradient-to-r shadow-lg shadow-primary/5' 
                                    : typeStyles[block.type]
                              }`}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">
                                    {startStr} - {endStr}
                                  </span>
                                  {isCurrent && (
                                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-primary text-white text-[9px] font-bold uppercase rounded tracking-wider animate-pulse shadow-md shadow-primary/25">
                                      ⚡ Active ({timeRemaining}m left)
                                    </span>
                                  )}
                                  {isElectrified && !isCurrent && (
                                    <span className="text-yellow-400 text-[9px] font-bold uppercase tracking-wider animate-bounce">
                                      ⚡ Charged!
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-semibold text-slate-200 text-sm leading-snug">{blockTitle}</h4>

                                {/* Task checkable list inside the block */}
                                {blockTasks.length > 0 && (
                                  <div className="mt-2.5 space-y-1.5 border-t border-slate-800/60 pt-2.5">
                                    {blockTasks.map((t) => (
                                      <div key={t.id} className="flex items-center justify-between text-xs text-slate-300">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <button 
                                            onClick={() => handleToggleTask(t.id, t.status)}
                                            className="text-slate-400 hover:text-primary transition-colors cursor-pointer"
                                          >
                                            {t.status === 'completed' 
                                              ? <CheckCircle2 className="w-4 h-4 text-green-400 fill-current" /> 
                                              : <Circle className="w-4 h-4" />
                                            }
                                          </button>
                                          <span className={`truncate ${t.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                                            {t.title}
                                          </span>
                                        </div>
                                        
                                        {t.status !== 'completed' && (
                                          <button
                                            onClick={() => {
                                              setActiveFocusTask(t);
                                              setIsFocusModeOpen(true);
                                            }}
                                            className="flex items-center gap-1 text-[10px] font-semibold text-accent hover:text-accent-400 transition-colors cursor-pointer"
                                          >
                                            <Play className="w-2.5 h-2.5 fill-current" />
                                            Focus
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>


                  {/* Task Backlog Component */}
                  <TaskBoard />
                </div>

                {/* Right Panel (Jarvis Chat Assistant) */}
                <div className="xl:col-span-5 h-full">
                  <JarvisChat />
                </div>

              </div>
            ) : (
              <AnalyticsDashboard />
            )}
          </div>
        </div>
      </div>
{/* Focus Mode Pomodoro Modal */}
      <FocusMode
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
      />

      {/* Template Selection Modal */}
      <AnimatePresence>
        {isTemplateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 relative shadow-2xl flex flex-col max-h-[85vh] text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary animate-pulse" />
                  <h3 className="text-lg font-display font-bold text-slate-100">Preset Schedule Library</h3>
                </div>
                <button
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-4 flex-shrink-0">
                Select a user persona and apply a template style to instantly pre-populate today's timeline blocks.
              </p>

              {/* Main Modal Layout */}
              <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[300px] overflow-hidden">
                {/* Left side: Persona selection tabs */}
                <div className="w-full md:w-1/3 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pr-1 pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0">
                  {personasData.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersonaId(persona.id);
                        setSelectedTemplateIndex(0);
                      }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap md:whitespace-normal cursor-pointer ${
                        selectedPersonaId === persona.id
                          ? 'bg-primary text-white shadow-md shadow-primary/15'
                          : 'bg-slate-950/40 border border-slate-800 text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="text-lg">{persona.icon}</span>
                      <span>{persona.title}</span>
                    </button>
                  ))}
                </div>

                {/* Right side: Option list & preview details */}
                <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
                  {/* Select Preset Option */}
                  {(() => {
                    const activePersona = personasData.find(p => p.id === selectedPersonaId);
                    if (!activePersona) return null;

                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {activePersona.options.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedTemplateIndex(idx)}
                              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                selectedTemplateIndex === idx
                                  ? 'bg-primary/15 border-primary shadow-sm text-slate-100'
                                  : 'bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              <h4 className="text-xs font-bold">{opt.name}</h4>
                              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{opt.description}</p>
                            </button>
                          ))}
                        </div>

                        {/* Preview Timeline details */}
                        {(() => {
                          const activeTemplate = activePersona.options[selectedTemplateIndex];
                          if (!activeTemplate) return null;

                          return (
                            <div className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800 space-y-3 animate-fadeIn">
                              <div>
                                <h4 className="text-xs font-bold text-slate-200">{activeTemplate.name} — Preview</h4>
                                <p className="text-[10px] text-slate-400 mt-0.5">{activeTemplate.description}</p>
                              </div>

                              {/* Mini timeline row */}
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {activeTemplate.blocks.map((b, idx) => (
                                  <div key={idx} className="p-2 bg-slate-900 border border-slate-800/80 rounded-lg text-center shadow-xs">
                                    <div className="text-[9px] font-bold text-slate-400 font-mono tracking-tight">
                                      {b.startTimeHhmm} - {b.endTimeHhmm}
                                    </div>
                                    <div className={`text-[10px] font-bold capitalize mt-1 ${
                                      b.type === 'focus' ? 'text-rose-400' :
                                      b.type === 'work' ? 'text-amber-400' :
                                      b.type === 'study' ? 'text-indigo-400' :
                                      b.type === 'break' ? 'text-emerald-400' :
                                      'text-slate-300'
                                    }`}>
                                      {b.type === 'focus' ? '🎯 Focus' :
                                       b.type === 'work' ? '💻 Work' :
                                       b.type === 'study' ? '📚 Study' :
                                       b.type === 'break' ? '☕ Break' :
                                       '🧘 Personal'}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Load button */}
                              <div className="pt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleApplyTemplate(activeTemplate.blocks)}
                                  className="px-5 py-2.5 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
                                >
                                  Apply Preset & Auto-Schedule Tasks
                                </button>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Schedule Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 relative shadow-2xl flex flex-col max-h-[85vh] text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-display font-bold text-slate-100">Manually Edit Timeline Blocks</h3>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs font-semibold text-rose-400 flex-shrink-0">
                  ⚠️ {modalError}
                </div>
              )}

              {/* Scrollable list of blocks */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 min-h-[200px]">
                {editedBlocks.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-sm font-semibold">
                    No blocks defined. Click "Add Block" below to create one.
                  </div>
                ) : (
                  editedBlocks.map((block, idx) => (
                    <div key={block.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                      {/* Block Type */}
                      <div className="w-full sm:w-1/3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Block Type</label>
                        <select
                          value={block.type}
                          onChange={(e) => handleUpdateBlockField(idx, 'type', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-100 focus:outline-none"
                        >
                          <option value="work">Work Session</option>
                          <option value="focus">Deep Focus Session</option>
                          <option value="study">Evening Study Block</option>
                          <option value="break">Rest Break</option>
                          <option value="personal">Personal Routine</option>
                        </select>
                      </div>

                      {/* Start Time */}
                      <div className="w-full sm:w-1/4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</label>
                        <input
                          type="time"
                          required
                          value={block.startTimeHhmm}
                          onChange={(e) => handleUpdateBlockField(idx, 'startTimeHhmm', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-100 focus:outline-none"
                        />
                      </div>

                      {/* End Time */}
                      <div className="w-full sm:w-1/4">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Time</label>
                        <input
                          type="time"
                          required
                          value={block.endTimeHhmm}
                          onChange={(e) => handleUpdateBlockField(idx, 'endTimeHhmm', e.target.value)}
                          className="w-full px-2 py-1 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-100 focus:outline-none"
                        />
                      </div>

                      {/* Delete Button */}
                      <div className="pt-4 sm:pt-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(idx)}
                          className="p-2 text-slate-400 hover:text-rose-450 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer controls */}
              <div className="border-t border-slate-800/60 pt-4 flex-shrink-0 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Auto Allocate checkbox & Add Block button */}
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={handleAddBlock}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700/60 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Block
                    </button>
                    
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-350 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAutoAllocate}
                        onChange={(e) => setIsAutoAllocate(e.target.checked)}
                        className="rounded border-slate-800 text-primary focus:ring-primary bg-slate-905 accent-primary w-4 h-4"
                      />
                      Auto-allocate tasks to slots
                    </label>
                  </div>

                  {/* Cancel & Save */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 border border-slate-850 rounded-xl text-slate-350 hover:bg-slate-800/40 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveBlocks}
                      className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Save Timeline
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
