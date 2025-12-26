import { getJson, setJson } from '../lib/storage';
import React from 'react';

export default function PremiumStatusBox({ ruolo, premium_fine }) {
  if (ruolo !== 'premium') return null;

  const fine = premium_fine ? new Date(premium_fine).toLocaleDateString() : 'âˆž';

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <strong style={{ color: 'gold' }}>ðŸ’Ž Premium attivo</strong>
      <p style={{ color: '#ccc' }}>Scade il: {fine}</p>
    </div>
  );
}
