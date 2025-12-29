'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { buttonPress, buttonGlow, transition } from '@/styles/animations';
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  glow?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      glow = false,
      loading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
      secondary: 'bg-zinc-800/80 text-zinc-100 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-500',
      ghost: 'bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white',
      danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40',
      success: 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
      outline: 'bg-transparent text-indigo-400 border-2 border-indigo-500 hover:bg-indigo-500/10',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    };

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-xl',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        variants={glow ? buttonGlow : buttonPress}
        initial="rest"
        whileHover={!isDisabled ? 'hover' : undefined}
        whileTap={!isDisabled ? 'tap' : undefined}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-4 w-4" />
          </motion.div>
        )}
        {!loading && leftIcon && (
          <motion.span
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={transition.tweenFast}
          >
            {leftIcon}
          </motion.span>
        )}
        {children}
        {!loading && rightIcon && (
          <motion.span
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            transition={transition.tweenFast}
          >
            {rightIcon}
          </motion.span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

// Icon Button variant
export const IconButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> & { icon: React.ReactNode }>(
  ({ icon, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={cn('rounded-xl', className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

