'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        // Demo mode - just redirect
        router.push('/roster');
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/roster');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      router.push('/roster');
      return;
    }
    
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // For demo purposes - skip auth
  const handleDemoLogin = () => {
    router.push('/roster');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile logo */}
      <div className="lg:hidden mb-8">
        <Link href="/" className="flex items-center gap-3">
          <motion.div
            className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <span className="text-white font-bold text-lg">I</span>
          </motion.div>
          <span className="font-semibold text-lg tracking-tight text-white">Influencer Tracker</span>
        </Link>
      </div>

      <div className="mb-8">
        <motion.h1
          className="text-3xl font-bold tracking-tight mb-2 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Welcome back
        </motion.h1>
        <motion.p
          className="text-zinc-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Sign in to continue to your dashboard
        </motion.p>
      </div>

      {/* Social login */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3 mb-6"
      >
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleLogin}
          leftIcon={<Chrome className="h-4 w-4" />}
        >
          Continue with Google
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-950 px-4 text-zinc-500">or continue with email</span>
        </div>
      </motion.div>

      {/* Login form */}
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        <Input
          type="email"
          label="Email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="h-4 w-4" />}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-900"
            />
            <span className="text-zinc-400">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Sign in
        </Button>
      </motion.form>

      {/* Demo button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-4"
      >
        <Button
          variant="ghost"
          className="w-full"
          onClick={handleDemoLogin}
        >
          Try demo (no login required)
        </Button>
      </motion.div>

      {/* Sign up link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-8 text-center text-sm text-zinc-400"
      >
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Sign up for free
        </Link>
      </motion.p>
    </motion.div>
  );
}
