import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment');
}

/**
 * Browser-side Supabase client (anon key).
 * Used for authentication (signIn, signUp, signOut, OAuth).
 * All data access goes through the Express API, not directly to Supabase.
 */
export const supabase = createClient(supabaseUrl, supabaseAnon);
