// src/pages/ProfilePublicCard.tsx

import React from 'react';
import MatchVerifier from '../components/MatchVerifier';
import MatchBanner from '../components/MatchBanner';

const ProfilePublicCard = ({ currentUser, profiloVisitato }: { currentUser: any; profiloVisitato: any }) => {
  if (!currentUser || !profiloVisitato) return <p>Caricamento profilo...</p>;

  return (
    <div style={{
      background: '#121212',
      color: '#fff',
      padding: '2rem',
      fontFamily: 'system-ui'
    }}>
      <h1>{profiloVisitato.name}</h1>
      <p>Età: {profiloVisitato.age}</p>
      <p>Interessi: {profiloVisitato.interests?.join(', ')}</p>

      {/* Tracciamento silenzioso match_100 */}
      <MatchVerifier userId1={currentUser.id} userId2={profiloVisitato.id} />

      {/* Banner visivo se match = 100 */}
      <MatchBanner userId1={currentUser.id} userId2={profiloVisitato.id} />
    </div>
  );
};

export default ProfilePublicCard;
