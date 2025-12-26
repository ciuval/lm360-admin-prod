// src/lib/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabase } from '../lib/supabaseClient';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

let _client: SupabaseClient | null = null;

/**
 * Ritorna un client Supabase se le ENV sono presenti.
 * Altrimenti ritorna null e NON manda in crash l'app.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anon) {
    console.warn('[LM360] Supabase non configurato (mancano VITE_SUPABASE_URL/ANON_KEY).');
    return null;
  }
  if (!_client) {
    _client = createClient(url, anon, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}
const supabase = getSupabase();
if (!supabase) {
  // UI amichevole: niente crash
  return <EmptyState message="Servizio momentaneamente non disponibile (SB_CFG). Riprova tra poco." />;
}