'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Search, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {leftIcon}
            </div>
          )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            'w-full h-11 px-4 text-sm',
            'bg-zinc-900 border border-zinc-700 rounded-xl',
            'text-white placeholder:text-zinc-500',
            'transition-all duration-200',
            'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:scale-[1.01]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            leftIcon && 'pl-10',
            (rightIcon || isPassword) && 'pr-10',
            className
          )}
          {...props}
        />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || hint) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-xs mt-1.5',
              error ? 'text-red-500' : 'text-zinc-500'
            )}
          >
            {error || hint}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Search Input
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, value, className, ...props }, ref) => {
    const hasValue = value && String(value).length > 0;

    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          ref={ref}
          type="text"
          value={value}
          className={cn(
            'w-full h-11 pl-10 pr-10 text-sm',
            'bg-zinc-900 border border-zinc-700 rounded-xl',
            'text-white placeholder:text-zinc-500',
            'transition-all duration-200',
            'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Textarea
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full min-h-[120px] p-4 text-sm',
            'bg-zinc-900 border border-zinc-700 rounded-xl',
            'text-white placeholder:text-zinc-500',
            'transition-all duration-200 resize-y',
            'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:scale-[1.005]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className
          )}
          {...props}
        />
        {(error || hint) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-xs mt-1.5',
              error ? 'text-red-500' : 'text-zinc-500'
            )}
          >
            {error || hint}
          </motion.p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Input
export interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, error, hint, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full h-11 px-4 text-sm appearance-none cursor-pointer',
            'bg-zinc-900 border border-zinc-700 rounded-xl',
            'text-white',
            'transition-all duration-200',
            'focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            // Add custom dropdown arrow
            'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.5rem_1.5rem] bg-[right_0.5rem_center] bg-no-repeat pr-10',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {(error || hint) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'text-xs mt-1.5',
              error ? 'text-red-500' : 'text-zinc-500'
            )}
          >
            {error || hint}
          </motion.p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';
