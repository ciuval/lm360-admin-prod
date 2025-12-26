// src/components/MatchVerifier.tsx

import React, { useEffect } from 'react';
import { checkMatchScoreFromSupabase } from '../lib/checkMatchScoreFromSupabase';

/**
 * Componente che verifica se due utenti hanno un match 100
 * e traccia l'evento 'match_100' in Google Analytics.
 *
 * @param {string} userId1 - ID del primo utente
 * @param {string} userId2 - ID del secondo utente
 */
const MatchVerifier = ({ userId1, userId2 }: { userId1: string; userId2: string }) => {
  useEffect(() => {
    if (userId1 && userId2) {
      checkMatchScoreFromSupabase(userId1, userId2);
    }
  }, [userId1, userId2]);

  return null; // Questo componente non rende nulla a schermo
};

export default MatchVerifier;
