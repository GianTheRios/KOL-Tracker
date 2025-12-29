'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Users,
  BarChart3,
  Wallet,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  Search,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Roster', href: '/roster', icon: <Users className="h-4 w-4" /> },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
  { label: 'Budget', href: '/budget', icon: <Wallet className="h-4 w-4" /> },
  { label: 'Import', href: '/import', icon: <Upload className="h-4 w-4" /> },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Glass background */}
          <div className="absolute inset-0 -top-4 -bottom-4 glass rounded-b-2xl" />
          
          <div className="relative flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <motion.div
                className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-lg">I</span>
              </motion.div>
              <span className="font-semibold text-lg tracking-tight hidden sm:block text-white">
                Influencer Tracker
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      className={cn(
                        'relative px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                        'flex items-center gap-2',
                        isActive
                          ? 'text-white'
                          : 'text-zinc-400 hover:text-white'
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-zinc-800 rounded-xl"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        {item.icon}
                        {item.label}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <motion.button
                className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-4 w-4" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                className="relative h-9 w-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </motion.button>

              {/* User menu */}
              <motion.button
                className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center text-white text-xs font-medium">
                  G
                </div>
                <span className="hidden lg:block">Account</span>
                <ChevronDown className="h-3 w-3" />
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="md:hidden overflow-hidden"
          >
            <div className="mx-4 mt-2 p-4 glass rounded-2xl">
              <div className="space-y-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-700">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors w-full"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Sidebar variant for dashboard layout
export function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 bottom-0 w-64 border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-xl hidden lg:block"
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3">
            <motion.div
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-xl">I</span>
            </motion.div>
            <div>
              <span className="font-semibold text-lg tracking-tight block text-white">Influencer Tracker</span>
              <span className="text-xs text-zinc-500">Pro Dashboard</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'relative px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      'flex items-center gap-3',
                      isActive
                        ? 'text-white bg-zinc-800'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    )}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeSidebar"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {item.icon}
                    {item.label}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-zinc-800">
          <Link href="/settings">
            <motion.div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
              whileHover={{ x: 4 }}
            >
              <Settings className="h-4 w-4" />
              Settings
            </motion.div>
          </Link>
          
          <motion.button
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors w-full"
            whileHover={{ x: 4 }}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
}

