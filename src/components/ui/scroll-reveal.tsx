'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import { scrollReveal, scrollRevealLeft, scrollRevealRight } from '@/styles/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  className?: string;
}

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  threshold = 0.2,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold,
  });

  const getVariants = (): Variants => {
    switch (direction) {
      case 'left':
        return scrollRevealLeft;
      case 'right':
        return scrollRevealRight;
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.25, 0.1, 0.25, 1],
            },
          },
        };
      case 'up':
      default:
        return scrollReveal;
    }
  };

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// Parallax scroll effect
interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export function Parallax({
  children,
  offset = 50,
  className,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: false, 
    amount: 0,
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: offset }}
      animate={isInView ? { y: 0 } : { y: offset }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
}

// Counter animation for numbers
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1,
  formatFn = (v) => Math.round(v).toLocaleString(),
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  // Use value as key to force re-mount when value changes from 0 to real value
  // This ensures the counter re-animates when data loads
  const animationKey = value > 0 ? `loaded-${value}` : 'loading';

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {isInView && (
        <motion.span
          key={animationKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CountUp 
            from={0} 
            to={value} 
            duration={duration} 
            formatFn={formatFn}
          />
        </motion.span>
      )}
    </motion.span>
  );
}

// Internal CountUp component
function CountUp({
  from,
  to,
  duration,
  formatFn,
}: {
  from: number;
  to: number;
  duration: number;
  formatFn: (value: number) => string;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);

  return (
    <motion.span
      ref={nodeRef}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      onAnimationStart={() => {
        const node = nodeRef.current;
        if (!node) return;

        const startTime = Date.now();
        const endTime = startTime + duration * 1000;

        const updateValue = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / (duration * 1000), 1);
          
          // Easing function (ease-out)
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentValue = from + (to - from) * eased;
          
          node.textContent = formatFn(currentValue);
          
          if (now < endTime) {
            requestAnimationFrame(updateValue);
          } else {
            node.textContent = formatFn(to);
          }
        };

        requestAnimationFrame(updateValue);
      }}
    >
      {formatFn(from)}
    </motion.span>
  );
}

// Reveal on scroll with stagger for lists
interface StaggerRevealProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerReveal({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

