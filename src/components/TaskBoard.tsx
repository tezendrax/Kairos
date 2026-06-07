'use client';

import { useState } from 'react';
import { Plus, X, Trash2, CheckCircle2, Circle, Clock, Star, AlertCircle, Battery, BatteryMedium, BatteryLow } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/lib/supabase';

export default function TaskBoard() {
  const { tasks, addTask, updateTask, deleteTask, setActiveFocusTask } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState(3);
  const [duration, setDuration] = useState(30);
  const [energyLevel, setEnergyLevel] = useState<'high' | 'medium' | 'low'>('medium');

  const pendingTasks = tasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask(title, desc, priority, duration, undefined, energyLevel);
    setTitle('');
    setDesc('');
    setPriority(3);
    setDuration(30);
    setEnergyLevel('medium');
    setShowAddForm(false);
  };

  const toggleComplete = async (task: Task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: nextStatus });
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6 backdrop-blur-md text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-bold text-slate-100">Task Backlog</h3>
          <p className="text-xs text-slate-400">{pendingTasks.length} pending • {completedTasks.length} completed</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            showAddForm 
              ? 'bg-slate-800 text-slate-350 hover:bg-slate-700' 
              : 'bg-primary text-white hover:bg-primary-600 shadow-md shadow-primary/15'
          }`}
        >
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          {showAddForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Study Chemistry chapter 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Description (Optional)</label>
            <textarea
              placeholder="What details are involved?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-slate-800 rounded-lg text-sm bg-slate-900 text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent resize-none placeholder-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Priority: {priority} {priority >= 4 ? '🔥' : ''}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Low</span>
                <span>Medium</span>
                <span>Critical</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Duration: {duration} mins</label>
              <select
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-800 rounded-lg text-xs bg-slate-900 text-slate-100 focus:outline-none"
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
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Bio-Energy Requirement (Cognitive Load)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEnergyLevel('low')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  energyLevel === 'low'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <BatteryLow className="w-4 h-4 text-emerald-500" />
                <span>Low</span>
              </button>
              <button
                type="button"
                onClick={() => setEnergyLevel('medium')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  energyLevel === 'medium'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <BatteryMedium className="w-4 h-4 text-amber-500" />
                <span>Medium</span>
              </button>
              <button
                type="button"
                onClick={() => setEnergyLevel('high')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                  energyLevel === 'high'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <Battery className="w-4 h-4 text-rose-500" />
                <span>High</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors cursor-pointer"
          >
            Schedule Priority
          </button>
        </form>
      )}

      {/* Task lists */}
      <div className="space-y-4">
        {/* Pending Tasks */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Priorities</h4>
          {pendingTasks.length === 0 ? (
            <div className="flex items-center gap-2 p-4 bg-slate-950/40 border border-slate-850 rounded-xl text-center justify-center text-slate-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-primary" />
              All clear! Add a task above to schedule blocks.
            </div>
          ) : (
            pendingTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center justify-between p-3.5 bg-slate-900/40 border border-slate-800 hover:border-primary/30 rounded-xl transition-all shadow-sm text-left"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button 
                    onClick={() => toggleComplete(task)}
                    className="mt-0.5 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Circle className="w-5 h-5 text-slate-600" />
                  </button>
                  <div className="min-w-0">
                    <h5 className="font-semibold text-slate-200 text-sm truncate">{task.title}</h5>
                    {task.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{task.estimated_minutes} mins</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[10px] text-orange-500">
                        {[...Array(task.priority)].map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-current" />
                        ))}
                      </div>
                      {task.energy_level && (
                        <div className={`flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          task.energy_level === 'high'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : task.energy_level === 'medium'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {task.energy_level === 'high' ? (
                            <Battery className="w-3 h-3 text-rose-500" />
                          ) : task.energy_level === 'medium' ? (
                            <BatteryMedium className="w-3 h-3 text-amber-500" />
                          ) : (
                            <BatteryLow className="w-3 h-3 text-emerald-500" />
                          )}
                          <span className="capitalize text-[9px]">{task.energy_level}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveFocusTask(task);
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('open-focus-modal'));
                      }
                    }}
                    className="px-2.5 py-1 bg-accent/15 hover:bg-accent text-accent hover:text-white rounded-lg text-xs font-semibold border border-accent/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer text-center"
                  >
                    Focus
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-left">Completed</h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-slate-900/20 border border-slate-850 rounded-xl opacity-60 hover:opacity-100 transition-all text-left"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button 
                      onClick={() => toggleComplete(task)}
                      className="mt-0.5 text-green-400 hover:text-slate-400 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 fill-current" />
                    </button>
                    <div className="min-w-0">
                      <h5 className="font-medium text-slate-400 text-sm line-through truncate">{task.title}</h5>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
