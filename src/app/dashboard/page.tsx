'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Shield, 
  Bell, 
  Zap, 
  CheckCircle, 
  Plus,
  Settings,
  User,
  LogOut,
  Brain,
  Target,
  Timer,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import FocusMode from '@/components/FocusMode';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'schedule' | 'analytics'>('schedule');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-display font-bold text-primary">Jarvis Scheduler</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-neutral-600 hover:text-primary"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-neutral-200">
              <h1 className="text-2xl font-display font-bold text-primary">Jarvis Scheduler</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <button 
                onClick={() => setCurrentView('schedule')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'schedule' 
                    ? 'text-primary bg-primary-50' 
                    : 'text-neutral-600 hover:text-primary hover:bg-neutral-50'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Today's Schedule
              </button>
              <button 
                onClick={() => setCurrentView('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                  currentView === 'analytics' 
                    ? 'text-primary bg-primary-50' 
                    : 'text-neutral-600 hover:text-primary hover:bg-neutral-50'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                Analytics
              </button>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-neutral-600 hover:text-primary hover:bg-neutral-50 rounded-lg transition-colors">
                <Target className="w-5 h-5" />
                Tasks
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-neutral-600 hover:text-primary hover:bg-neutral-50 rounded-lg transition-colors">
                <Brain className="w-5 h-5" />
                AI Assistant
              </a>
              <a href="#" className="flex items-center gap-3 px-3 py-2 text-neutral-600 hover:text-primary hover:bg-neutral-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </a>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{user.email}</p>
                  <p className="text-xs text-neutral-500">Free Plan</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-neutral-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Header */}
          <div className="bg-white border-b border-neutral-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-neutral-900">Good morning!</h2>
                <p className="text-neutral-600">{formatDate(currentTime)}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-primary">{formatTime(currentTime)}</div>
                <div className="text-sm text-neutral-500">Current Time</div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {currentView === 'schedule' ? (
              <>
                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Add Task</h3>
                </div>
                <p className="text-neutral-600 mb-4">Quickly add a new task to your schedule</p>
                <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors">
                  Add Task
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent-50 rounded-lg">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">Focus Mode</h3>
                </div>
                <p className="text-neutral-600 mb-4">Block distractions and focus on your tasks</p>
                <button 
                  onClick={() => setIsFocusModeOpen(true)}
                  className="w-full bg-accent text-white py-2 rounded-lg font-medium hover:bg-accent-600 transition-colors"
                >
                  Start Focus
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Brain className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">AI Summary</h3>
                </div>
                <p className="text-neutral-600 mb-4">Get your daily summary and recommendations</p>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Get Summary
                </button>
              </motion.div>
            </div>

            {/* Today's Schedule */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-neutral-900">Today's Schedule</h3>
                <button className="text-primary hover:text-primary-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {[
                  { time: '07:00', title: 'Morning Routine', type: 'personal', duration: '30m' },
                  { time: '07:30', title: 'Study Session - Math', type: 'study', duration: '2h' },
                  { time: '09:30', title: 'Break', type: 'break', duration: '15m' },
                  { time: '09:45', title: 'Project Work', type: 'work', duration: '1h 30m' },
                  { time: '11:15', title: 'Lunch Break', type: 'break', duration: '45m' },
                  { time: '12:00', title: 'Focus Session', type: 'focus', duration: '1h' },
                ].map((block, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
                  >
                    <div className="text-sm font-mono text-neutral-500 w-16">{block.time}</div>
                    <div className={`w-3 h-3 rounded-full ${
                      block.type === 'study' ? 'bg-blue-500' :
                      block.type === 'work' ? 'bg-green-500' :
                      block.type === 'focus' ? 'bg-purple-500' :
                      block.type === 'break' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{block.title}</h4>
                      <p className="text-sm text-neutral-500">{block.duration}</p>
                    </div>
                    <button className="text-neutral-400 hover:text-primary transition-colors">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
              </>
            ) : (
              <AnalyticsDashboard />
            )}
          </div>
        </div>
      </div>

      {/* Focus Mode Modal */}
      <FocusMode
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        currentTask="Study Session - Math"
        duration={25}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
