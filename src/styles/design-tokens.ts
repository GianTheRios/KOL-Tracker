// Design Tokens - Award-winning design system inspired by awwwards.com and Framer showcases

export const colors = {
  // Primary palette - Deep, sophisticated colors
  primary: {
    50: '#f0f4ff',
    100: '#e0e9ff',
    200: '#c7d6fe',
    300: '#a4bafc',
    400: '#7f97f8',
    500: '#6366f1', // Main primary
    600: '#5046e4',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  
  // Accent - Vibrant gradient endpoints
  accent: {
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316',
    emerald: '#10b981',
  },
  
  // Neutral - Premium grays with subtle warmth
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f4f4f5',
    150: '#ececed',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    850: '#1f1f23',
    900: '#18181b',
    950: '#09090b',
  },
  
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Status colors for KOL tracking
  status: {
    reached: '#f59e0b',
    kyc: '#8b5cf6',
    contracted: '#06b6d4',
    invoiced: '#10b981',
    paid: '#22c55e',
    notPaid: '#ef4444',
  },
  
  // Platform colors
  platforms: {
    youtube: '#ff0000',
    tiktok: '#000000',
    twitter: '#1da1f2',
    instagram: '#e4405f',
    telegram: '#0088cc',
  },
} as const;

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem',    // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',     // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',    // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  11: '2.75rem',   // 44px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
  72: '18rem',     // 288px
  80: '20rem',     // 320px
  96: '24rem',     // 384px
} as const;

export const typography = {
  fonts: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    display: '"Satoshi", "Inter", sans-serif',
  },
  
  sizes: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
    '5xl': ['3rem', { lineHeight: '1.16' }],      // 48px
    '6xl': ['3.75rem', { lineHeight: '1.1' }],    // 60px
    '7xl': ['4.5rem', { lineHeight: '1.05' }],    // 72px
    '8xl': ['6rem', { lineHeight: '1' }],         // 96px
    '9xl': ['8rem', { lineHeight: '1' }],         // 128px
  },
  
  weights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  tracking: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.25rem',  // 20px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Premium glow effects
  glow: {
    sm: '0 0 15px -3px',
    md: '0 0 25px -5px',
    lg: '0 0 40px -10px',
  },
  
  // Glass card shadows
  glass: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
  glassHover: '0 16px 48px 0 rgba(0, 0, 0, 0.12)',
} as const;

export const blur = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '40px',
} as const;

export const gradients = {
  // Primary gradients
  primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  primaryHover: 'linear-gradient(135deg, #5046e4 0%, #7c3aed 100%)',
  
  // Premium accent gradients
  sunset: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
  ocean: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
  aurora: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
  cosmic: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%)',
  
  // Subtle mesh gradients for backgrounds
  meshLight: 'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.06) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.05) 0px, transparent 50%)',
  meshDark: 'radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.12) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(6, 182, 212, 0.1) 0px, transparent 50%)',
  
  // Glass effect gradient overlays
  glassOverlay: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
  glassBorder: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)',
} as const;

export const transitions = {
  // Timing functions - premium easing curves
  ease: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Premium spring-like curves
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    snappy: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },
  
  // Duration presets
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
    slowest: '700ms',
  },
} as const;

export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  backdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
} as const;

