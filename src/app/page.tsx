'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Shield, 
  Bell, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Play,
  Star,
  Users,
  Target,
  Brain,
  Smartphone,
  Globe,
  ChevronDown
} from 'lucide-react';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user } = useAuth();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Replans when life happens",
      description: "Missed your 7 AM study block? Jarvis automatically reschedules your day with realistic time estimates."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Blocks distractions",
      description: "Integrates with Focus Mode and suggests app-blocking to keep you on track during priority tasks."
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Nudge-driven focus",
      description: "Gentle, escalating notifications that respect your flow state while keeping priorities visible."
    }
  ];

  const integrations = [
    { name: "Google Calendar", icon: <Calendar className="w-5 h-5" /> },
    { name: "Todoist", icon: <CheckCircle className="w-5 h-5" /> },
    { name: "Notion", icon: <Brain className="w-5 h-5" /> },
    { name: "Apple Calendar", icon: <Calendar className="w-5 h-5" /> },
    { name: "Outlook", icon: <Globe className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Computer Science Student",
      content: "Jarvis helped me reduce unfinished tasks by 60%. The automatic rescheduling is a game-changer.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager",
      content: "Finally, an AI that actually understands my schedule and helps me stay focused. Love the gentle nudges.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Graduate Student",
      content: "The morning summaries and focus mode suggestions have transformed my productivity. Highly recommend!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-display font-bold text-primary">Jarvis Scheduler</h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-neutral-600 hover:text-primary px-3 py-2 text-sm font-medium">Features</a>
                <a href="#pricing" className="text-neutral-600 hover:text-primary px-3 py-2 text-sm font-medium">Pricing</a>
                <a href="#testimonials" className="text-neutral-600 hover:text-primary px-3 py-2 text-sm font-medium">Reviews</a>
                <button 
                  onClick={() => {
                    setAuthMode('signin');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                >
                  Try Free
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-neutral-600 hover:text-primary p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-6">
                Your day.<br />
                <span className="text-primary">Replanned in real-time.</span>
          </h1>
              <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
                An intelligent, conversational scheduler that proactively reschedules your day, 
                blocks distractions, and nudges you to complete priorities — acting like a personal Jarvis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
              >
                Try Jarvis Scheduler
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </motion.div>

            {/* Demo GIF Placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-neutral-100 rounded-2xl p-8 max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <div className="text-center text-neutral-500">
                  <Smartphone className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg">Interactive Demo Coming Soon</p>
                  <p className="text-sm">Experience the full Jarvis Scheduler workflow</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Three Core Benefits
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Less scrolling. More doing. Jarvis handles the complexity so you can focus on what matters.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl border border-neutral-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Seamless Integrations
            </h2>
            <p className="text-xl text-neutral-600">
              Works with the tools you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-primary mb-3 flex justify-center">{integration.icon}</div>
                <p className="text-sm font-medium text-neutral-700">{integration.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Loved by Students & Professionals
            </h2>
            <p className="text-xl text-neutral-600">
              Join thousands who've transformed their productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white p-8 rounded-2xl border border-neutral-200"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-neutral-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-2xl border border-neutral-200"
            >
              <h3 className="text-2xl font-semibold text-neutral-900 mb-2">Free</h3>
              <p className="text-neutral-600 mb-6">Perfect for getting started</p>
              <div className="text-4xl font-bold text-neutral-900 mb-8">$0<span className="text-lg font-normal text-neutral-500">/month</span></div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-600">Basic task management</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-600">Morning/night summaries</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-600">Basic rescheduling</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-neutral-600">Calendar read-only sync</span>
                </li>
              </ul>

              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="w-full bg-neutral-100 text-neutral-900 py-3 rounded-lg font-semibold hover:bg-neutral-200 transition-colors"
              >
                Get Started Free
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-primary text-white p-8 rounded-2xl relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              
              <h3 className="text-2xl font-semibold mb-2">Pro</h3>
              <p className="text-primary-100 mb-6">For power users and professionals</p>
              <div className="text-4xl font-bold mb-8">$9<span className="text-lg font-normal text-primary-100">/month</span></div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Advanced rescheduler</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Calendar write access</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Cross-device focus syncing</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Third-party integrations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span>Priority support</span>
                </li>
              </ul>

              <button 
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="w-full bg-white text-primary py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Start Pro Trial
              </button>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <p className="text-neutral-600">
              Student discount available • 
              <span className="text-primary font-semibold"> 50% off for students</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            Ready to transform your productivity?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students and professionals who've found their focus with Jarvis.
          </p>
          <button 
            onClick={() => {
              setAuthMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Try Jarvis Scheduler — Free Plan
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">Jarvis Scheduler</h3>
              <p className="text-neutral-400">
                Your day, re-planned in real-time. Less scrolling. More doing.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 Jarvis Scheduler. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
