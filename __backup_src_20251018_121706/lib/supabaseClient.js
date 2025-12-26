import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
  // ******(Controlla .env.local: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)******
  console.warn('Supabase ENV mancanti: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: 'lm360-auth' }
});

export default supabase;
