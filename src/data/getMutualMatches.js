// src/data/getMutualMatches.js
import { supabase } from '../lib/supabase';

export async function getMutualMatches(userId, { limit = 50, offset = 0 } = {}) {
  // 1) righe match reciproci
  const { data: rows, error } = await supabase
    .from('match_scores')
    .select('user_a,user_b,score,updated_at')
    .eq('score', 100)
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .order('updated_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  // 2) calcolo la controparte e carico i profili
  const peers = Array.from(new Set(rows.map((r) => (r.user_a === userId ? r.user_b : r.user_a))));

  // se hai la tabella profiles
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, ultimo_accesso')
    .in('id', peers);

  if (pErr) throw pErr;

  const pMap = new Map(profiles.map((p) => [p.id, p]));
  return rows.map((r) => {
    const peer_id = r.user_a === userId ? r.user_b : r.user_a;
    return {
      peer_id,
      score: r.score,
      updated_at: r.updated_at,
      profile: pMap.get(peer_id) || { id: peer_id },
    };
  });
}
