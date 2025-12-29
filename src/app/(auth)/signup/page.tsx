'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Chrome, Check } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
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
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      router.push('/roster');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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

  // For demo purposes
  const handleDemoLogin = () => {
    router.push('/roster');
  };

  const features = [
    'Unlimited influencer tracking',
    'Advanced analytics dashboard',
    'CPM & ROI calculations',
    'Excel import & export',
  ];

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
          Create your account
        </motion.h1>
        <motion.p
          className="text-zinc-400"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Start tracking your influencer strategy today
        </motion.p>
      </div>

      {/* Features list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800"
      >
        <div className="grid grid-cols-2 gap-2">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
              className="flex items-center gap-2 text-sm"
            >
              <Check className="h-4 w-4 text-emerald-500" />
              <span className="text-zinc-400">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social signup */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleSignup}
          leftIcon={<Chrome className="h-4 w-4" />}
        >
          Continue with Google
        </Button>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-zinc-950 px-4 text-zinc-500">or sign up with email</span>
        </div>
      </motion.div>

      {/* Signup form */}
      <motion.form
        onSubmit={handleSignup}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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
          type="text"
          label="Full name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<User className="h-4 w-4" />}
          required
        />

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
          hint="Must be at least 8 characters"
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Create account
        </Button>
      </motion.form>

      {/* Demo button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-4"
      >
        <Button
          variant="ghost"
          className="w-full"
          onClick={handleDemoLogin}
        >
          Try demo (no signup required)
        </Button>
      </motion.div>

      {/* Terms */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-xs text-zinc-500"
      >
        By signing up, you agree to our{' '}
        <Link href="/terms" className="text-indigo-400 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-indigo-400 hover:underline">
          Privacy Policy
        </Link>
      </motion.p>

      {/* Login link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="mt-6 text-center text-sm text-zinc-400"
      >
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
