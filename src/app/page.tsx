'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Users,
  Wallet,
  Upload,
  Sparkles,
  Check,
  ChevronRight,
  TrendingUp,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Influencer Roster Management',
    description: 'Track all your influencer partnerships in one place with detailed profiles and platform analytics.',
    iconBg: 'bg-violet-500',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Monitor CPM, ROI, and engagement metrics with beautiful, real-time visualizations.',
    iconBg: 'bg-cyan-500',
  },
  {
    icon: Wallet,
    title: 'Budget Tracking',
    description: 'Manage invoices, track spending, and optimize your marketing budget allocation.',
    iconBg: 'bg-emerald-500',
  },
  {
    icon: Upload,
    title: 'Easy Data Import',
    description: 'Import your existing Excel data in seconds with intelligent column mapping.',
    iconBg: 'bg-orange-500',
  },
];

const benefits = [
  '10x faster than spreadsheets',
  'Real-time CPM calculations',
  'Multi-platform tracking',
  'Secure & private',
  'Export anytime',
  'No learning curve',
];

const stats = [
  { value: '16+', label: 'Influencers Tracked', icon: Users },
  { value: '$7.86', label: 'Avg CPM', icon: TrendingUp },
  { value: '2.4M', label: 'Impressions', icon: Zap },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Hero section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              top: '20%',
              left: '20%',
              width: '500px',
              height: '500px',
              backgroundColor: '#8b5cf6',
            }}
          />
          <div 
            className="absolute rounded-full blur-3xl opacity-15"
            style={{
              bottom: '20%',
              right: '20%',
              width: '400px',
              height: '400px',
              backgroundColor: '#06b6d4',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link href="/signup">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-violet-300 border border-violet-500/30" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
                <Sparkles className="h-4 w-4" />
                Now in beta — Try it free
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
          >
            <span className="text-white">Scale your </span>
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              influencer strategy
            </span>
            <br />
            <span className="text-white">with precision</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
          >
            Track influencer partnerships, monitor performance metrics, manage budgets, 
            and make data-driven decisions to maximize your marketing ROI.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link href="/roster">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg shadow-violet-500/25 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:shadow-violet-500/40 transition-shadow">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/login">
              <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-lg border border-zinc-700 hover:bg-zinc-800 transition-colors" style={{ backgroundColor: 'rgba(39, 39, 42, 0.8)' }}>
                Sign In
              </button>
            </Link>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-16"
          >
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-zinc-400">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="h-3 w-3 text-emerald-400" />
                </div>
                {benefit}
              </div>
            ))}
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="max-w-2xl mx-auto rounded-2xl border border-white/10 overflow-hidden"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)' }}
          >
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center py-6 px-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="h-5 w-5 text-violet-400" />
                    <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-zinc-700 flex items-start justify-center p-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
          </motion.div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-24" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-violet-400 text-sm font-medium mb-6 border border-violet-500/20" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need to manage influencers
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Stop using spreadsheets. Get a purpose-built tool for tracking and scaling 
              your influencer marketing strategy.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-8 rounded-2xl border border-white/10"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.iconBg} mb-6`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Gradient background */}
            <div 
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #06b6d4 100%)' }}
            />
            
            {/* Content */}
            <div className="relative z-10 py-20 px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to scale your influencer strategy?
              </h2>
              <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
                Join teams who&apos;ve already upgraded from spreadsheets to a purpose-built solution.
              </p>
              <Link href="/roster">
                <button className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-violet-600 font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow">
                  Start Tracking Free
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-800" style={{ backgroundColor: '#0a0a0f' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-lg">
                I
              </div>
              <span className="font-semibold text-white">Influencer Tracker</span>
            </div>
            <p className="text-sm text-zinc-500">
              © 2025 Influencer Tracker. Built with ❤️ for marketers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
