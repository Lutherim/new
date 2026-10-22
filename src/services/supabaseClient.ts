import { createClient } from '@supabase/supabase-js';

// Only the PUBLIC (publishable/anon) key belongs in the browser. Row Level Security protects the data.
// Never put the secret / service_role key in this project.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !key) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to .env.local (and to Vercel).');
}

export const supabase = createClient(url, key);
