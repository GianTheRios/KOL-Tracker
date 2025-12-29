'use client';

import { motion, MotionProps } from 'framer-motion';
import { useEffect, useState } from 'react';

// Wrapper to ensure animations work after hydration
export function MotionDiv({ 
  children, 
  ...props 
}: MotionProps & { children: React.ReactNode; className?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a div with the same className but no animation (prevents flash)
    return (
      <div className={props.className as string} style={{ opacity: 1 }}>
        {children}
      </div>
    );
  }

  return <motion.div {...props}>{children}</motion.div>;
}

// Simple fade-in wrapper that works with SSR
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      className={className}
      initial={mounted ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

