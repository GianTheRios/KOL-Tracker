'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { pageTransition } from '@/styles/animations';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Simpler fade transition for sections
export function FadeTransition({ 
  children,
  delay = 0,
}: { 
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.4,
          delay,
          ease: [0.25, 0.1, 0.25, 1],
        },
      }}
      exit={{ 
        opacity: 0, 
        y: -10,
        transition: {
          duration: 0.2,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Staggered children animation
export function StaggerContainer({ 
  children,
  staggerDelay = 0.05,
  initialDelay = 0.1,
  className,
}: { 
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className || 'contents'}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
        exit: {
          opacity: 0,
          transition: {
            staggerChildren: staggerDelay / 2,
            staggerDirection: -1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger item - uses direct initial/animate for dynamic item support
export function StaggerItem({ 
  children,
  className,
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className || 'h-full'}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          type: 'spring',
          stiffness: 400,
          damping: 30,
        },
      }}
      exit={{ 
        opacity: 0, 
        y: -10,
        transition: {
          duration: 0.15,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

