// Framer Motion Animation Presets - Award-winning motion design
import { Variants, Transition } from 'framer-motion';

// ============================================
// EASING CURVES - Premium motion curves
// ============================================
export const easing = {
  // Standard easings
  ease: [0.4, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  
  // Premium spring-like curves (for award-winning feel)
  spring: [0.34, 1.56, 0.64, 1],
  bounce: [0.68, -0.6, 0.32, 1.6],
  smooth: [0.25, 0.1, 0.25, 1],
  snappy: [0.19, 1, 0.22, 1],
  
  // Elegant curves for page transitions
  pageIn: [0.22, 1, 0.36, 1],
  pageOut: [0.12, 0, 0.39, 0],
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================
export const transition = {
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  } as Transition,
  
  springGentle: {
    type: 'spring',
    stiffness: 200,
    damping: 25,
  } as Transition,
  
  springBouncy: {
    type: 'spring',
    stiffness: 500,
    damping: 15,
  } as Transition,
  
  tween: {
    type: 'tween',
    duration: 0.3,
    ease: easing.smooth,
  } as Transition,
  
  tweenFast: {
    type: 'tween',
    duration: 0.15,
    ease: easing.ease,
  } as Transition,
  
  tweenSlow: {
    type: 'tween',
    duration: 0.5,
    ease: easing.smooth,
  } as Transition,
  
  page: {
    type: 'tween',
    duration: 0.4,
    ease: easing.pageIn,
  } as Transition,
} as const;

// ============================================
// ANIMATION VARIANTS
// ============================================

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transition.tween,
  },
  exit: { 
    opacity: 0,
    transition: transition.tweenFast,
  },
};

export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transition.spring,
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: transition.tweenFast,
  },
};

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transition.spring,
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: transition.tweenFast,
  },
};

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transition.spring,
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: transition.tweenFast,
  },
};

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transition.spring,
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: transition.tweenFast,
  },
};

// Scale animations
export const scaleIn: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transition.spring,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: transition.tweenFast,
  },
};

export const scaleInBounce: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transition.springBouncy,
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: transition.tweenFast,
  },
};

// Slide animations
export const slideInFromBottom: Variants = {
  hidden: { 
    y: '100%',
    opacity: 0,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: transition.spring,
  },
  exit: { 
    y: '100%',
    opacity: 0,
    transition: transition.tween,
  },
};

export const slideInFromTop: Variants = {
  hidden: { 
    y: '-100%',
    opacity: 0,
  },
  visible: { 
    y: 0,
    opacity: 1,
    transition: transition.spring,
  },
  exit: { 
    y: '-100%',
    opacity: 0,
    transition: transition.tween,
  },
};

export const slideInFromLeft: Variants = {
  hidden: { 
    x: '-100%',
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: transition.spring,
  },
  exit: { 
    x: '-100%',
    opacity: 0,
    transition: transition.tween,
  },
};

export const slideInFromRight: Variants = {
  hidden: { 
    x: '100%',
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: transition.spring,
  },
  exit: { 
    x: '100%',
    opacity: 0,
    transition: transition.tween,
  },
};

// Page transition variants
export const pageTransition: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(10px)',
  },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: easing.pageIn,
    },
  },
  exit: { 
    opacity: 0, 
    y: -10,
    filter: 'blur(5px)',
    transition: {
      duration: 0.3,
      ease: easing.pageOut,
    },
  },
};

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Stagger item
export const staggerItem: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transition.spring,
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: transition.tweenFast,
  },
};

// Card hover animations
export const cardHover: Variants = {
  rest: { 
    scale: 1,
    y: 0,
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
  },
  hover: { 
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 48px 0 rgba(0, 0, 0, 0.12)',
    transition: transition.spring,
  },
  tap: { 
    scale: 0.98,
    transition: transition.tweenFast,
  },
};

export const cardHoverSubtle: Variants = {
  rest: { 
    scale: 1,
    boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.06)',
  },
  hover: { 
    scale: 1.01,
    boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.1)',
    transition: transition.spring,
  },
  tap: { 
    scale: 0.99,
    transition: transition.tweenFast,
  },
};

// Button animations
export const buttonPress: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: transition.spring,
  },
  tap: { 
    scale: 0.97,
    transition: transition.tweenFast,
  },
};

export const buttonGlow: Variants = {
  rest: { 
    scale: 1,
    boxShadow: '0 0 0 0 rgba(99, 102, 241, 0)',
  },
  hover: { 
    scale: 1.02,
    boxShadow: '0 0 20px 0 rgba(99, 102, 241, 0.3)',
    transition: transition.spring,
  },
  tap: { 
    scale: 0.97,
    transition: transition.tweenFast,
  },
};

// Icon animations
export const iconSpin: Variants = {
  rest: { rotate: 0 },
  hover: { 
    rotate: 180,
    transition: transition.spring,
  },
};

export const iconBounce: Variants = {
  rest: { y: 0 },
  hover: { 
    y: [-2, 2, -2, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
};

// Scroll reveal - for intersection observer
export const scrollReveal: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

export const scrollRevealLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -50,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

export const scrollRevealRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 50,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: easing.smooth,
    },
  },
};

// Modal/Overlay animations
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.15,
    },
  },
};

export const modalContent: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: transition.spring,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: transition.tweenFast,
  },
};

// Drawer animations
export const drawerLeft: Variants = {
  hidden: { x: '-100%' },
  visible: { 
    x: 0,
    transition: transition.spring,
  },
  exit: { 
    x: '-100%',
    transition: transition.tween,
  },
};

export const drawerRight: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: transition.spring,
  },
  exit: { 
    x: '100%',
    transition: transition.tween,
  },
};

// Progress bar animation
export const progressBar: Variants = {
  hidden: { 
    scaleX: 0,
    originX: 0,
  },
  visible: (value: number) => ({
    scaleX: value,
    transition: {
      duration: 0.8,
      ease: easing.smooth,
    },
  }),
};

// Skeleton loader pulse
export const skeletonPulse: Variants = {
  initial: { opacity: 0.4 },
  animate: {
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Chart animation
export const chartLine: Variants = {
  hidden: { 
    pathLength: 0,
    opacity: 0,
  },
  visible: { 
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        duration: 1.5,
        ease: easing.smooth,
      },
      opacity: {
        duration: 0.3,
      },
    },
  },
};

export const chartBar: Variants = {
  hidden: { 
    scaleY: 0,
    originY: 1,
  },
  visible: (i: number) => ({
    scaleY: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: easing.spring,
    },
  }),
};

// Number counter animation helper
export const counterSpring = {
  type: 'spring',
  stiffness: 100,
  damping: 20,
} as const;

// Tooltip animation
export const tooltip: Variants = {
  hidden: { 
    opacity: 0, 
    y: 5,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: easing.ease,
    },
  },
  exit: { 
    opacity: 0, 
    y: 3,
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
};

// Dropdown menu animation
export const dropdown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -5,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: transition.spring,
  },
  exit: { 
    opacity: 0, 
    y: -5,
    scale: 0.95,
    transition: transition.tweenFast,
  },
};

// Tab indicator animation
export const tabIndicator: Variants = {
  inactive: { opacity: 0 },
  active: { 
    opacity: 1,
    transition: transition.spring,
  },
};

