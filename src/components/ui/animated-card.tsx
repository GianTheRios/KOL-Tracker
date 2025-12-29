'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { cardHover, cardHoverSubtle } from '@/styles/animations';
import { forwardRef } from 'react';

interface AnimatedCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'subtle' | 'glass' | 'elevated';
  hover?: boolean;
  children: React.ReactNode;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ variant = 'default', hover = true, className, children, ...props }, ref) => {
    const variants = {
      default: 'bg-zinc-900 border border-zinc-800',
      subtle: 'bg-zinc-900/50 border border-zinc-800/50',
      glass: 'glass-card',
      elevated: 'bg-zinc-900 border border-zinc-800 shadow-lg',
    };

    const hoverVariants = variant === 'subtle' ? cardHoverSubtle : cardHover;

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-xl p-6 transition-colors',
          variants[variant],
          className
        )}
        variants={hover ? hoverVariants : undefined}
        initial={hover ? 'rest' : undefined}
        whileHover={hover ? 'hover' : undefined}
        whileTap={hover ? 'tap' : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';

// Card Header
export function CardHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

// Card Title
export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-white', className)}>
      {children}
    </h3>
  );
}

// Card Description
export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn('text-sm text-zinc-500 mt-1', className)}>
      {children}
    </p>
  );
}

// Card Content
export function CardContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

// Card Footer
export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-zinc-800/50 flex items-center gap-2', className)}>
      {children}
    </div>
  );
}
