'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { IconButton } from './button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'lg',
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  // Only render portal on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render on server
  if (!mounted) return null;

  // Use portal to render at document.body level, bypassing any parent transforms
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99]"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed inset-y-0 right-0 w-full z-[100]',
              'bg-zinc-900 border-l border-zinc-800 shadow-2xl',
              'grid',
              footer ? 'grid-rows-[auto_1fr_auto]' : 'grid-rows-[auto_1fr]',
              widthClasses[width]
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                {description && (
                  <p className="text-sm text-zinc-400 mt-1">{description}</p>
                )}
              </div>
              <IconButton
                variant="ghost"
                icon={<X className="h-5 w-5" />}
                onClick={onClose}
                className="text-zinc-400 hover:text-white"
              />
            </div>

            {/* Content - Scrollable */}
            <div className="overflow-y-auto p-6 min-h-0">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-zinc-900">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Section component for organizing drawer content
interface DrawerSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DrawerSection({ title, children, className }: DrawerSectionProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

// Footer with actions
interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur',
      className
    )}>
      {children}
    </div>
  );
}

