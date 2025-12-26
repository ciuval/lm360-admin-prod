// src/lib/checkMatchScoreFromSupabase.ts

import { supabase } from './supabaseClient';
import { trackEvent } from './analytics';

/**
 * Controlla se due utenti hanno match 100
 * → Traccia evento GA4
 * → Salva nel DB (match_event_log)
 */
export async function checkMatchScoreFromSupabase(userId1: string, userId2: string) {
  try {
    const { data, error } = await supabase
      .from('match_scores_flat')
      .select('score')
      .match({ user_id: userId1, other_user_id: userId2 })
      .maybeSingle();

    if (error) {
      console.error('Errore Supabase:', error.message);
      return;
    }

    const score = data?.score;
    if (score === 100) {
      // Traccia evento GA4
      trackEvent('match_100', { user1: userId1, user2: userId2 });

      // Salva evento nel DB
      await supabase.from('match_event_log').insert({
        user1_id: userId1,
        user2_id: userId2,
        type: 'match_100',
        created_at: new Date().toISOString()
      });

      console.log('✅ Match 100 tracciato e salvato.');
    }
  } catch (err) {
    console.error('Errore durante il controllo match score:', err);
  }
}

