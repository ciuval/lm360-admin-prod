// src/lib/match.js
import { supabase } from './supabaseClient';
import { track } from './analytics';

export function normPair(u1, u2) {
  const A = String(u1),
    B = String(u2);
  return A < B ? { a: A, b: B } : { a: B, b: A };
}

export async function sendLikeDb(toUserId) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) throw new Error('not_authenticated');

  // salva like
  const { error } = await supabase.from('likes').insert({ user_from: user.id, user_to: toUserId });
  if (error && error.code !== '23505') throw error; // 23505 = duplicate (giÃ  messo like)
  track(EV.LIKE_SENT);

  // verifichiamo match_scores
  const { a, b } = normPair(user.id, toUserId);
  const { data: ms } = await supabase
    .from('match_scores')
    .select('score, matched_at')
    .eq('a', a)
    .eq('b', b)
    .maybeSingle();

  const mutual = !!ms && ms.score === 100;
  if (mutual) track(EV.MUTUAL_MATCH);
  return { mutual };
}

