import React from 'react';
import { AuthGuard } from '../lib/authContext';
import LikeReal from '../components/LikeReal.jsx';
import { defaultAvatarUrl } from '../lib/avatar';

function LabMatchInner() {
  const other = {
    id: '00000000-0000-0000-0000-0000000000aa', // demo user id fittizio
    name: 'Marta Demo',
    avatar: defaultAvatarUrl(),
  };

  return (
    <main
      style={{ maxWidth: 720, margin: '8vh auto', padding: '0 24px', display: 'grid', gap: 16 }}
    >
      <h2>Lab Match (reale)</h2>
      <p style={{ opacity: 0.85 }}>
        Fai login in due finestre con 2 account → invia Like su entrambi: quando è reciproco,
        compare “È un match!”.
      </p>
      <LikeReal
        otherId={other.id}
        otherName={other.name}
        otherAvatar={other.avatar}
        onMatch={() => {
          /* opzionale: redirect chat */
        }}
      />
    </main>
  );
}

export default function LabMatch() {
  return (
    <AuthGuard>
      <LabMatchInner />
    </AuthGuard>
  );
}
