import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

// Check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function createClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured - running in demo mode');
    return null;
  }
  
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Helper to get the client on the client side
let client: SupabaseClient | null = null;
let initialized = false;

export function getSupabaseClient(): SupabaseClient | null {
  if (!initialized) {
    client = createClient();
    initialized = true;
  }
  return client;
}

