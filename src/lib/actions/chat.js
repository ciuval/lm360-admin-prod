// src/lib/actions/chat.js
import { createClient } from '@supabase/supabase-js';
import { track } from '../analytics';

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const sb = createClient(url, anon, { auth: { persistSession: true } });

export async function getMe() {
  const { data } = await sb.auth.getUser();
  return data?.user ?? null;
}

/**
 * Lista match (score >= 100) dell'utente loggato.
 * Ritorna [{ other_id, score, updated_at, profile? }]
 */
export async function fetchMatches() {
  const me = await getMe();
  if (!me) return [];

  const { data: rows, error } = await sb
    .from('match_scores')
    .select('user_a,user_b,score,updated_at')
    .or(`user_a.eq.${me.id},user_b.eq.${me.id}`)
    .gte('score', 100)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const otherIds = [];
  const base = (rows || []).map((r) => {
    const other = r.user_a === me.id ? r.user_b : r.user_a;
    otherIds.push(other);
    return { other_id: other, score: r.score, updated_at: r.updated_at };
  });

  if (otherIds.length === 0) return base;

  const { data: prof } = await sb
    .from('profiles')
    .select('id, display_name, avatar_url')
    .in('id', otherIds);

  const map = new Map((prof || []).map((p) => [p.id, p]));
  return base.map((r) => ({ ...r, profile: map.get(r.other_id) || null }));
}

/**
 * Carica thread fra me e otherId.
 */
export async function fetchThread(otherId, limit = 50) {
  const me = await getMe();
  if (!me) return [];

  const { data, error } = await sb
    .from('messages')
    .select('id,sender_id,receiver_id,content,created_at')
    .in('sender_id', [me.id, otherId])
    .in('receiver_id', [me.id, otherId])
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Invia un messaggio (stringa non vuota).
 */
export async function sendMessage(otherId, text) {
  const me = await getMe();
  if (!me) throw new Error('no-auth');
  const body = (text || '').trim();
  if (!body) return;

  const { error } = await sb.from('messages').insert({
    sender_id: me.id,
    receiver_id: otherId,
    content: body,
  });

  if (!error) track('message_sent', { len: body.length });
  if (error) throw error;
}

/**
 * Realtime: notifica nuovi messaggi ricevuti dall'utente loggato.
 * Restituisce una funzione unsubscribe().
 */
export async function subscribeIncoming(onInsert) {
  const me = await getMe();
  if (!me) return () => {};

  const ch = sb
    .channel(`messages:${me.id}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${me.id}` },
      (payload) => onInsert?.(payload.new)
    )
    .subscribe();

  return () => sb.removeChannel(ch);
}
