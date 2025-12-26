// src/lib/MatchEngine.ts

import { trackEvent } from './analytics';

/**
 * Verifica se due utenti hanno raggiunto il match 100.
 * Se sì, esegue il tracciamento GA4.
 */
export function checkAndTrackMatchScore(userId1: string, userId2: string, score: number): void {
  if (score === 100) {
    trackEvent('match_100', {
      user1: userId1,
      user2: userId2
    });
  }
}
