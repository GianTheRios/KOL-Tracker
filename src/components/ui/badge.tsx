'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Platform, KOLStatus } from '@/types';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'md',
  animated = false,
  children,
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-zinc-500/15 text-zinc-400',
    primary: 'bg-indigo-500/15 text-indigo-400',
    success: 'bg-emerald-500/15 text-emerald-500',
    warning: 'bg-amber-500/15 text-amber-500',
    error: 'bg-red-500/15 text-red-500',
    info: 'bg-blue-500/15 text-blue-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  if (animated) {
    return (
      <motion.span
        className={cn(
          'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap',
          variants[variant],
          sizes[size],
          className
        )}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full whitespace-nowrap',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Platform Badge with specific styling
interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const platformConfig: Record<Platform, { bg: string; icon: string; label: string }> = {
  youtube: { bg: 'bg-red-500', icon: '▶', label: 'YouTube' },
  tiktok: { bg: 'bg-black dark:bg-white dark:text-black', icon: '♪', label: 'TikTok' },
  twitter: { bg: 'bg-sky-500', icon: '𝕏', label: 'Twitter' },
  instagram: { bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', icon: '📷', label: 'Instagram' },
  telegram: { bg: 'bg-blue-500', icon: '✈', label: 'Telegram' },
};

export function PlatformBadge({
  platform,
  size = 'md',
  showIcon = true,
  className,
}: PlatformBadgeProps) {
  const config = platformConfig[platform];
  
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-md text-white whitespace-nowrap',
        config.bg,
        sizes[size],
        className
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {showIcon && <span className="text-[0.9em]">{config.icon}</span>}
      {config.label}
    </motion.span>
  );
}

// Status Badge for KOL status
interface StatusBadgeProps {
  status: KOLStatus;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const statusConfig: Record<KOLStatus, { variant: BadgeProps['variant']; label: string; dot?: boolean }> = {
  reached: { variant: 'warning', label: 'Reached Out', dot: true },
  in_contact: { variant: 'info', label: 'In Contact', dot: true },
  kyc: { variant: 'primary', label: 'KYC', dot: true },
  contracted: { variant: 'info', label: 'Contracted', dot: true },
  invoiced: { variant: 'primary', label: 'Invoiced', dot: false },
  paid: { variant: 'success', label: 'Paid', dot: false },
  not_paid: { variant: 'error', label: 'Not Paid', dot: true },
};

export function StatusBadge({
  status,
  size = 'md',
  animated = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      size={size}
      animated={animated}
      className={cn('gap-1.5', className)}
    >
      {config.dot && (
        <motion.span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            config.variant === 'success' && 'bg-emerald-500',
            config.variant === 'warning' && 'bg-amber-500',
            config.variant === 'error' && 'bg-red-500',
            config.variant === 'info' && 'bg-blue-500',
            config.variant === 'primary' && 'bg-indigo-500'
          )}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      {config.label}
    </Badge>
  );
}
