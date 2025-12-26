// src/lib/supabase.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL  = import.meta.env.VITE_SUPABASE_URL  || '';
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabase = Boolean(URL && KEY);

// Client opzionale: null se non configurato
export const supabase: SupabaseClient | null = hasSupabase
  ? createClient(URL, KEY, { auth: { persistSession: true } })
  : null;

// helper sicuri (non esplodono se supabase è null)
export async function upsertProfile(partial: Record<string, any>) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('profiles').upsert(partial).select().single();
}

export async function getProfile(userId: string) {
  if (!supabase) return { data: null, error: null };
  return supabase.from('profiles').select('*').eq('id', userId).single();
}
