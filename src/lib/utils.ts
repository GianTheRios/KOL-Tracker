import { clsx, type ClassValue } from 'clsx';

// Utility for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

// Format number with abbreviation (1K, 1M, etc.)
export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// Calculate CPM (Cost Per Mille)
export function calculateCPM(cost: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (cost / impressions) * 1000;
}

// Format CPM
export function formatCPM(cpm: number): string {
  return `$${cpm.toFixed(2)}`;
}

// Calculate ROI
export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return ((revenue - cost) / cost) * 100;
}

// Format date
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', options ?? {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  
  return formatDate(d);
}

// Debounce function
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Truncate text
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

// Platform icon mapping
export const platformIcons: Record<string, string> = {
  youtube: '📺',
  tiktok: '🎵',
  twitter: '🐦',
  instagram: '📸',
  telegram: '✈️',
};

// Status color mapping
export const statusColors: Record<string, string> = {
  'reached': 'bg-amber-500/20 text-amber-500',
  'in_contact': 'bg-blue-500/20 text-blue-500',
  'kyc': 'bg-violet-500/20 text-violet-500',
  'contracted': 'bg-cyan-500/20 text-cyan-500',
  'invoiced': 'bg-emerald-500/20 text-emerald-500',
  'paid': 'bg-green-500/20 text-green-500',
  'not_paid': 'bg-red-500/20 text-red-500',
};

// Platform color mapping
export const platformColors: Record<string, string> = {
  youtube: 'bg-red-500',
  tiktok: 'bg-neutral-900 dark:bg-white dark:text-black',
  twitter: 'bg-sky-500',
  instagram: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
  telegram: 'bg-blue-500',
};

// Sleep/delay utility
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Clamp number between min and max
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

// Lerp (linear interpolation)
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Map value from one range to another
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Check if we're on the server
export const isServer = typeof window === 'undefined';

// Check if we're on the client
export const isClient = typeof window !== 'undefined';

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Parse URL and extract platform
export function extractPlatformFromUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    if (hostname.includes('youtube') || hostname.includes('youtu.be')) return 'youtube';
    if (hostname.includes('tiktok')) return 'tiktok';
    if (hostname.includes('twitter') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('instagram')) return 'instagram';
    if (hostname.includes('telegram') || hostname.includes('t.me')) return 'telegram';
    return null;
  } catch {
    return null;
  }
}

