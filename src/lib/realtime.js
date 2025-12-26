import { supabase } from './supabaseClient';

/** Chiave unica per una coppia utente */
export function pairKey(a, b) {
  const A = String(a),
    B = String(b);
  return A < B ? `${A}_${B}` : `${B}_${A}`;
}

/** Apre canale realtime per la coppia (solo broadcast, niente DB) */
export function openMatchChannel(key, onLike) {
  const ch = supabase.channel(`mock-match:${key}`, {
    config: { broadcast: { ack: true } },
  });
  ch.on('broadcast', { event: 'like' }, (payload) => {
    onLike?.(payload?.payload);
  });
  ch.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      // ready
    }
  });
  return ch;
}

/** Invia "like" su canale di coppia */
export async function sendLike(channel, from, to) {
  await channel?.send({
    type: 'broadcast',
    event: 'like',
    payload: { from, to, ts: Date.now() },
  });
}
