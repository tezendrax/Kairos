'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  CheckCircle, 
  Calendar,
  Zap,
  Shield,
  Brain
} from 'lucide-react';

interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  focusTime: number;
  productivityScore: number;
  streakDays: number;
  averageSessionLength: number;
  weeklyData: Array<{
    day: string;
    tasks: number;
    focusTime: number;
    productivity: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  // Mock data - in a real app, this would come from your database
  const analyticsData: AnalyticsData = {
    totalTasks: 47,
    completedTasks: 38,
    focusTime: 12.5,
    productivityScore: 81,
    streakDays: 7,
    averageSessionLength: 28,
    weeklyData: [
      { day: 'Mon', tasks: 8, focusTime: 2.5, productivity: 85 },
      { day: 'Tue', tasks: 6, focusTime: 2.0, productivity: 78 },
      { day: 'Wed', tasks: 9, focusTime: 3.0, productivity: 92 },
      { day: 'Thu', tasks: 7, focusTime: 2.2, productivity: 80 },
      { day: 'Fri', tasks: 5, focusTime: 1.8, productivity: 75 },
      { day: 'Sat', tasks: 4, focusTime: 1.5, productivity: 70 },
      { day: 'Sun', tasks: 3, focusTime: 1.0, productivity: 65 },
    ]
  };

  const completionRate = Math.round((analyticsData.completedTasks / analyticsData.totalTasks) * 100);

  const stats = [
    {
      title: 'Tasks Completed',
      value: `${analyticsData.completedTasks}/${analyticsData.totalTasks}`,
      percentage: completionRate,
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      color: 'green'
    },
    {
      title: 'Focus Time',
      value: `${analyticsData.focusTime}h`,
      percentage: Math.round((analyticsData.focusTime / 20) * 100), // Assuming 20h/week goal
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      color: 'blue'
    },
    {
      title: 'Productivity Score',
      value: `${analyticsData.productivityScore}%`,
      percentage: analyticsData.productivityScore,
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      color: 'purple'
    },
    {
      title: 'Current Streak',
      value: `${analyticsData.streakDays} days`,
      percentage: Math.min((analyticsData.streakDays / 30) * 100, 100),
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-neutral-900">Analytics</h2>
          <p className="text-neutral-600">Track your productivity and focus patterns</p>
        </div>
        
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {range === '7d' ? '7 days' : range === '30d' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-neutral-50 rounded-lg">
                {stat.icon}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                <div className="text-sm text-neutral-500">{stat.percentage}%</div>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">{stat.title}</span>
                <span className="text-neutral-500">{stat.percentage}%</span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2 mt-1">
                <motion.div
                  className={`h-2 rounded-full ${
                    stat.color === 'green' ? 'bg-green-500' :
                    stat.color === 'blue' ? 'bg-blue-500' :
                    stat.color === 'purple' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Weekly Activity</h3>
          <div className="space-y-4">
            {analyticsData.weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-8 text-sm font-medium text-neutral-600">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-neutral-600">Tasks: {day.tasks}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <motion.div
                      className="bg-primary h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.tasks / 10) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
                <div className="text-sm text-neutral-500 w-16 text-right">
                  {day.focusTime}h
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Productivity Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-neutral-200"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Productivity Trends</h3>
          <div className="space-y-4">
            {analyticsData.weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-8 text-sm font-medium text-neutral-600">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-neutral-600">Productivity</span>
                    <span className="text-neutral-500">{day.productivity}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${
                        day.productivity >= 80 ? 'bg-green-500' :
                        day.productivity >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${day.productivity}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white p-6 rounded-2xl border border-neutral-200"
      >
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">AI Insights</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Brain className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Peak Productivity Time</p>
              <p className="text-sm text-blue-700">You're most productive on Wednesdays. Consider scheduling your most important tasks on this day.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-900">Focus Session Success</p>
              <p className="text-sm text-green-700">Your average focus session is 28 minutes. Try extending to 45 minutes for deeper work.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
            <Target className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">Task Completion</p>
              <p className="text-sm text-orange-700">You complete 81% of your tasks. Great job! Try breaking down larger tasks into smaller ones.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
