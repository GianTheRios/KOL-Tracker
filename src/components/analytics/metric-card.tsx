'use client';

import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/scroll-reveal';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number;
  previousValue?: number;
  format?: 'number' | 'currency' | 'percentage' | 'compact';
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  delay?: number;
  className?: string;
}

export function MetricCard({
  label,
  value,
  previousValue,
  format = 'number',
  prefix = '',
  suffix = '',
  icon,
  trend,
  delay = 0,
  className,
}: MetricCardProps) {
  const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = change > 0;
  const displayTrend = trend || (change > 0 ? 'up' : change < 0 ? 'down' : 'neutral');

  const formatValue = (v: number): string => {
    switch (format) {
      case 'currency':
        return v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
      case 'percentage':
        return v.toFixed(1);
      case 'compact':
        if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
        if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
        return v.toString();
      default:
        return v.toLocaleString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'glass-card p-6 relative overflow-hidden group',
        className
      )}
    >
      {/* Background gradient accent */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent 50%)',
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-zinc-500">{label}</span>
          {icon && (
            <motion.div
              className="p-2 rounded-lg bg-zinc-800 text-zinc-400"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {icon}
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold tracking-tight text-white">
            {prefix}
            <AnimatedCounter value={value} formatFn={formatValue} />
            {suffix}
          </span>

          {/* Change indicator */}
          {previousValue !== undefined && change !== 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className={cn(
                'flex items-center gap-1 text-sm font-medium mb-1',
                displayTrend === 'up' && 'text-emerald-500',
                displayTrend === 'down' && 'text-red-500',
                displayTrend === 'neutral' && 'text-zinc-500'
              )}
            >
              {displayTrend === 'up' && <TrendingUp className="h-4 w-4" />}
              {displayTrend === 'down' && <TrendingDown className="h-4 w-4" />}
              <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
            </motion.div>
          )}
        </div>

        {/* Comparison */}
        {previousValue !== undefined && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.4 }}
            className="text-xs text-zinc-500 mt-2"
          >
            vs {formatValue(previousValue)} last period
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// Progress metric card variant
interface ProgressMetricProps {
  label: string;
  value: number;
  max: number;
  format?: 'number' | 'currency' | 'percentage';
  prefix?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  delay?: number;
  className?: string;
}

export function ProgressMetric({
  label,
  value,
  max,
  format = 'number',
  prefix = '',
  color = 'primary',
  delay = 0,
  className,
}: ProgressMetricProps) {
  const percentage = (value / max) * 100;

  const colorClasses = {
    primary: 'from-indigo-500 to-violet-600',
    success: 'from-emerald-500 to-emerald-600',
    warning: 'from-amber-500 to-amber-600',
    error: 'from-red-500 to-red-600',
  };

  const formatValue = (v: number): string => {
    switch (format) {
      case 'currency':
        return `$${v.toLocaleString()}`;
      case 'percentage':
        return `${v.toFixed(1)}%`;
      default:
        return v.toLocaleString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn('glass-card p-6', className)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-500">{label}</span>
        <span className="text-sm font-medium text-white">
          {prefix}{formatValue(value)} / {formatValue(max)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(percentage, 100)}%` }}
          transition={{
            delay: delay + 0.2,
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        />
      </div>

      <p className="text-xs text-zinc-500 mt-2">
        {percentage.toFixed(1)}% of target
      </p>
    </motion.div>
  );
}
