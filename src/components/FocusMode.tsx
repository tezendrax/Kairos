'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  X, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  AlertTriangle,
  Brain
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FocusMode({ isOpen, onClose }: FocusModeProps) {
  const { activeFocusTask, logFocusSession, addTask } = useApp();
  const taskName = activeFocusTask ? activeFocusTask.title : 'General Focus Block';
  const estimatedMinutes = activeFocusTask ? activeFocusTask.estimated_minutes : 25;

  const [duration, setDuration] = useState(estimatedMinutes);
  const [timeLeft, setTimeLeft] = useState(estimatedMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [distractions, setDistractions] = useState(0);
  const [showMindDump, setShowMindDump] = useState(false);
  const [mindDumpText, setMindDumpText] = useState('');
  const [showOffloadedToast, setShowOffloadedToast] = useState(false);

  // Sync duration with active task changes
  useEffect(() => {
    setDuration(estimatedMinutes);
    setTimeLeft(estimatedMinutes * 60);
    setDistractions(0);
    setIsRunning(false);
    setIsCompleted(false);
    setShowMindDump(false);
    setMindDumpText('');
  }, [activeFocusTask, estimatedMinutes]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsCompleted(true);
      setIsRunning(false);
      handleSessionFinished();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionFinished = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pikachu-focus-complete'));
    }
    if (soundEnabled) {
      // Audio notification fallback
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.connect(gain);
        gain.connect(context.destination);
        osc.frequency.setValueAtTime(523.25, context.currentTime); // C5 note
        gain.gain.setValueAtTime(0.5, context.currentTime);
        osc.start();
        osc.stop(context.currentTime + 0.5);
      } catch (e) {
        console.log('Focus session completed audio notification error:', e);
      }
    }
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsCompleted(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pikachu-focus-start'));
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setIsCompleted(false);
    setDistractions(0);
  };

  const handleLogAndClose = async () => {
    const elapsedSeconds = duration * 60 - timeLeft;
    const elapsedMinutes = Math.max(Math.round(elapsedSeconds / 60), 1);
    
    // Calculate focus score: 100 base, deduct 15 per distraction
    const focusScore = Math.max(100 - distractions * 15, 0);

    await logFocusSession(taskName, elapsedMinutes, distractions, focusScore);
    onClose();
  };

  const logDistraction = () => {
    setDistractions(prev => prev + 1);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pikachu-cheer-up'));
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
          className="bg-white rounded-2xl w-full max-w-md p-8 relative border border-neutral-200 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-900">Deep Focus Mode</h2>
                <p className="text-xs text-neutral-500 truncate max-w-[200px]">{taskName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center mb-6">
            <div className="relative w-48 h-48 mx-auto mb-2">
              {/* Progress Circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-neutral-100"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="6"
                  fill="none"
                  className="text-primary"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold text-neutral-900 tracking-tight">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs font-semibold text-neutral-400 mt-1">
                    {isCompleted ? 'Finished!' : isRunning ? 'Flowing...' : 'Ready'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Distraction logging & ADHD Mind-Dump */}
          {!isCompleted && timeLeft < duration * 60 && (
            <div className="mb-6">
              {showOffloadedToast && (
                <div className="text-center text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-2 mb-4 animate-fadeIn">
                  🧠 Thought offloaded to backlog! Clear your head and resume flow.
                </div>
              )}

              {!showMindDump ? (
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      if (isRunning) setIsRunning(false); // Pause focus to offload
                      setShowMindDump(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 hover:text-yellow-800 rounded-lg text-xs font-medium transition-all shadow-sm cursor-pointer animate-fadeIn"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    I got distracted ({distractions})
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl space-y-3 animate-fadeIn text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Brain className="w-4 h-4" />
                    <span>ADHD Mind-Dump Offloader</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Type the distracting thought to save it in your backlog for later, clearing your mental loop immediately.
                  </p>
                  <input
                    type="text"
                    placeholder="e.g. Check flight tickets, buy groceries..."
                    value={mindDumpText}
                    onChange={(e) => setMindDumpText(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-neutral-900"
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (mindDumpText.trim()) {
                          await addTask(`[Mind Dump] ${mindDumpText.trim()}`, 'Offloaded during Focus Session', 1, 15, undefined, 'low');
                          setDistractions(prev => prev + 1);
                          setMindDumpText('');
                          setShowMindDump(false);
                          setShowOffloadedToast(true);
                          setTimeout(() => setShowOffloadedToast(false), 3000);
                        }
                      }
                    }}
                  />
                  <div className="flex justify-end gap-2 text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setDistractions(prev => prev + 1);
                        setShowMindDump(false);
                      }}
                      className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-semibold rounded-md transition-colors cursor-pointer"
                    >
                      Just Count It
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (mindDumpText.trim()) {
                          await addTask(`[Mind Dump] ${mindDumpText.trim()}`, 'Offloaded during Focus Session', 1, 15, undefined, 'low');
                          setDistractions(prev => prev + 1);
                          setMindDumpText('');
                          setShowMindDump(false);
                          setShowOffloadedToast(true);
                          setTimeout(() => setShowOffloadedToast(false), 3000);
                        }
                      }}
                      disabled={!mindDumpText.trim()}
                      className="px-2.5 py-1.5 bg-primary text-white font-semibold rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Offload & Resume
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {!isCompleted ? (
              <>
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-md hover:shadow-primary/10 transition-all cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Start Flow
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                  >
                    <Pause className="w-4 h-4 fill-current" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </>
            ) : (
              <button
                onClick={handleLogAndClose}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-green/20 transition-all cursor-pointer"
              >
                <CheckCircle className="w-5 h-5" />
                Complete & Log Session
              </button>
            )}
          </div>

          {/* settings / close buttons */}
          <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Beep On completion' : 'Silent'}</span>
            </button>

            {!isRunning && !isCompleted && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Adjust Time</span>
              </button>
            )}

            {(isRunning || isCompleted) && (
              <button
                onClick={handleLogAndClose}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                End Session & Save
              </button>
            )}
          </div>

          {/* Settings Dropdown */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 pt-4 border-t border-neutral-100"
              >
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  Adjust duration for this session
                </label>
                <select
                  value={duration}
                  onChange={(e) => {
                    const newDuration = parseInt(e.target.value);
                    setDuration(newDuration);
                    setTimeLeft(newDuration * 60);
                  }}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none"
                >
                  <option value={10}>10 minutes (Quick review)</option>
                  <option value={15}>15 minutes</option>
                  <option value={25}>25 minutes (Pomodoro)</option>
                  <option value={45}>45 minutes (Focus block)</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
