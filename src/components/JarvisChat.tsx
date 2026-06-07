'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, RefreshCw, Calendar, Timer, Plus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function JarvisChat() {
  const { messages, sendMessageToKairos } = useApp();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText('');
    setIsTyping(true);

    await sendMessageToKairos(text);

    // Turn off typing after response delay
    setTimeout(() => {
      setIsTyping(false);
    }, 800);
  };

  const handleChipClick = async (cmd: string) => {
    setInputText('');
    setIsTyping(true);
    await sendMessageToKairos(cmd);
    setTimeout(() => {
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[600px] bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-900/60 to-slate-950/60 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shadow-md shadow-primary/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div className="text-left">
            <h3 className="font-display font-bold text-slate-100 text-sm md:text-base">Kairos Assistant</h3>
            <p className="text-xs text-slate-400">Always active • Ready to plan</p>
          </div>
        </div>
      </div>

      {/* Messages list */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-slate-950/20"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2.5 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.sender === 'jarvis' ? (
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-600 text-white text-xs font-bold font-display shadow-sm">
                  K
                </div>
              ) : (
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-350 text-xs font-bold font-display shadow-sm">
                  U
                </div>
              )}
              
              <div className="text-left">
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800/80 text-slate-100 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                  {msg.isTaskForm && !msg.formCompleted && (
                    <InteractiveTaskForm msg={msg} />
                  )}
                </div>
                <div className={`text-[10px] text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-fadeIn">
            <div className="flex items-start gap-2.5 max-w-[80%]">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-600 text-white text-xs font-bold font-display animate-bounce">
                K
              </div>
              <div className="px-4 py-3 bg-slate-900 text-slate-400 border border-slate-800/80 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/60 border-t border-slate-850 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button 
          onClick={() => handleChipClick('add task')}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-primary hover:text-primary rounded-full text-xs font-medium text-slate-300 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Quick Add Task
        </button>
        <button 
          onClick={() => handleChipClick('/reschedule')}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-primary hover:text-primary rounded-full text-xs font-medium text-slate-300 transition-colors shadow-sm cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reschedule Day
        </button>
        <button 
          onClick={() => handleChipClick('/summary')}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-primary hover:text-primary rounded-full text-xs font-medium text-slate-300 transition-colors shadow-sm cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          Get Summary
        </button>
        <button 
          onClick={() => handleChipClick('start focus mode')}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-primary hover:text-primary rounded-full text-xs font-medium text-slate-300 transition-colors shadow-sm cursor-pointer"
        >
          <Timer className="w-3.5 h-3.5" />
          Focus Session
        </button>
        <button 
          onClick={() => handleChipClick('help')}
          className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 hover:border-primary hover:text-primary rounded-full text-xs font-medium text-slate-300 transition-colors shadow-sm cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          List Commands
        </button>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-900/60">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tell Kairos to reschedule, summarize, or log..."
            className="w-full pl-4 pr-12 py-3 border border-slate-800 rounded-xl bg-slate-950 text-slate-100 focus:ring-1 focus:ring-primary focus:border-transparent text-sm placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2.5 p-2 bg-primary hover:bg-primary-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function InteractiveTaskForm({ msg }: { msg: any }) {
  const { submitTaskFormMessage } = useApp();
  const [title, setTitle] = useState(msg.taskDraft?.title || '');
  const [priority, setPriority] = useState(msg.taskDraft?.priority || 3);
  const [duration, setDuration] = useState(msg.taskDraft?.estimated_minutes || 30);
  const [energy, setEnergy] = useState<'high' | 'medium' | 'low'>(msg.taskDraft?.energy_level || 'medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !submitTaskFormMessage) return;
    await submitTaskFormMessage(msg.id, title.trim(), priority, duration, energy);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3 text-slate-200 text-left animate-fadeIn">
      <div>
        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Task Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-2.5 py-1.5 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder-slate-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Priority (1-5)</label>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 border border-slate-850 rounded-lg text-xs bg-slate-900 text-slate-100 focus:outline-none"
          >
            <option value={1}>1 - Low</option>
            <option value={2}>2 - Routine</option>
            <option value={3}>3 - Normal</option>
            <option value={4}>4 - High</option>
            <option value={5}>5 - Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-2.5 py-1.5 border border-slate-850 rounded-lg text-xs bg-slate-900 text-slate-100 focus:outline-none"
          >
            <option value={15}>15 mins</option>
            <option value={30}>30 mins</option>
            <option value={45}>45 mins</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bio-Energy Requirement</label>
        <div className="grid grid-cols-3 gap-2">
          {['low', 'medium', 'high'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setEnergy(lvl as any)}
              className={`py-1.5 px-2 rounded-lg border text-[10px] font-semibold transition-all capitalize cursor-pointer text-center ${
                energy === lvl
                  ? lvl === 'high'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : lvl === 'medium'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center shadow-md shadow-primary/15"
      >
        Confirm & Schedule Block
      </button>
    </form>
  );
}
