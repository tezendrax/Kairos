'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Clock, Target, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const { user } = useAuth();
  const { completeOnboarding } = useApp();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    workHoursStart: '09:00',
    workHoursEnd: '17:00',
    priorities: ['', '', ''],
    calendarConnected: false,
  });

  const steps = [
    {
      title: "Welcome to Kairos!",
      subtitle: "Let's set up your personalized schedule",
      icon: <Target className="w-8 h-8 text-primary" />,
    },
    {
      title: "What time do you usually wake up?",
      subtitle: "This helps us plan your morning routine",
      icon: <Clock className="w-8 h-8 text-primary" />,
    },
    {
      title: "Add your top 3 priorities",
      subtitle: "What must you finish tomorrow?",
      icon: <Target className="w-8 h-8 text-primary" />,
    },
    {
      title: "Connect your calendar",
      subtitle: "Sync with Google Calendar for better scheduling",
      icon: <Calendar className="w-8 h-8 text-primary" />,
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and save preferences
      await completeOnboarding(
        formData.wakeUpTime,
        formData.sleepTime,
        formData.workHoursStart,
        formData.workHoursEnd,
        formData.priorities
      );
      router.push('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePriorityChange = (index: number, value: string) => {
    const newPriorities = [...formData.priorities];
    newPriorities[index] = value;
    setFormData(prev => ({ ...prev, priorities: newPriorities }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              {steps[0].icon}
            </motion.div>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              I'm Kairos, your time-planning companion. I'll help you stay focused, 
              reschedule when life happens, and keep you on track with your priorities.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-neutral-700">Automatically reschedule when you're running late</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-neutral-700">Block distractions during focus time</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-neutral-700">Gentle nudges to keep you on track</span>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Wake up time
              </label>
              <input
                type="time"
                value={formData.wakeUpTime}
                onChange={(e) => handleInputChange('wakeUpTime', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Sleep time
              </label>
              <input
                type="time"
                value={formData.sleepTime}
                onChange={(e) => handleInputChange('sleepTime', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Work starts
                </label>
                <input
                  type="time"
                  value={formData.workHoursStart}
                  onChange={(e) => handleInputChange('workHoursStart', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Work ends
                </label>
                <input
                  type="time"
                  value={formData.workHoursEnd}
                  onChange={(e) => handleInputChange('workHoursEnd', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-neutral-600 mb-6">
              Tell me your top 3 priorities for tomorrow. I'll make sure they get scheduled first.
            </p>
            {formData.priorities.map((priority, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Priority {index + 1}
                </label>
                <input
                  type="text"
                  value={priority}
                  onChange={(e) => handlePriorityChange(index, e.target.value)}
                  placeholder={`Enter priority ${index + 1}...`}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Connect your Google Calendar to automatically sync events and create time blocks.
              This is optional but highly recommended for the best experience.
            </p>
            <button
              onClick={() => handleInputChange('calendarConnected', 'true')}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors mb-4"
            >
              Connect Google Calendar
            </button>
            <button
              onClick={() => handleInputChange('calendarConnected', 'false')}
              className="w-full bg-neutral-100 text-neutral-700 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
            >
              Skip for now
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-neutral-600">
              {steps[currentStep].subtitle}
            </p>
          </div>

          {renderStepContent()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
