'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-500 to-purple-600" />
        
        {/* Animated mesh overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 rounded-full bg-white/10 blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-32 right-20 w-48 h-48 rounded-full bg-white/10 blur-xl"
          animate={{
            y: [0, 40, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white/5 blur-lg"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span className="font-bold text-2xl">K</span>
            </motion.div>
            <span className="font-semibold text-xl tracking-tight">KOL Tracker</span>
          </Link>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-md"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Scale your influencer strategy with precision
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Track KOLs, monitor performance, manage budgets, and make data-driven 
              decisions to maximize your marketing ROI.
            </p>

            {/* Feature highlights */}
            <div className="mt-8 space-y-4">
              {[
                'Real-time performance analytics',
                'CPM optimization insights',
                'Multi-platform tracking',
                'Budget & invoice management',
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-2 w-2 rounded-full bg-white/60" />
                  <span className="text-white/90">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Testimonial or stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-8 border-t border-white/20"
          >
            <div className="flex items-center gap-6">
              <div>
                <div className="text-3xl font-bold">10x</div>
                <div className="text-sm text-white/70">Faster tracking</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm text-white/70">Better CPM</div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div>
                <div className="text-3xl font-bold">∞</div>
                <div className="text-sm text-white/70">KOLs tracked</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

