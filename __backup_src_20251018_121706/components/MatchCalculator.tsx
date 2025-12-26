// src/components/MatchCalculator.tsx

import React, { useEffect, useState } from 'react';
import { checkAndTrackMatchScore } from '../lib/MatchEngine';

const MatchCalculator = ({ currentUser, altroUtente }) => {
  const [matchScore, setMatchScore] = useState<number | null>(null);

  useEffect(() => {
    // Simulazione di un punteggio match
    const punteggio = calcolaMatch(currentUser, altroUtente);
    setMatchScore(punteggio);

    // Traccia se è 100
    checkAndTrackMatchScore(currentUser.id, altroUtente.id, punteggio);
  }, [currentUser, altroUtente]);

  return (
    <div style={{ padding: '1rem', color: '#fff' }}>
      <h3>Punteggio Match</h3>
      {matchScore !== null ? (
        <p>Il punteggio tra {currentUser.name} e {altroUtente.name} è <strong>{matchScore}</strong></p>
      ) : (
        <p>Calcolo in corso...</p>
      )}
    </div>
  );
};

// Funzione di esempio (può essere sostituita con una query o logica reale)
function calcolaMatch(user1, user2): number {
  // Per ora ritorna 100 come simulazione
  return 100;
}

export default MatchCalculator;
