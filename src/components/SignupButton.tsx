// src/components/SignupButton.tsx

import React from 'react';
import { trackEvent } from '../lib/analytics';

const SignupButton = () => {
  const handleSignup = () => {
    // Qui andrebbe la tua logica di registrazione (Supabase, ecc.)

    // Tracciamento evento
    trackEvent('signup', {
      method: 'email'
    });
  };

  return (
    <button
      onClick={handleSignup}
      style={{
        background: '#bb86fc',
        color: '#000',
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      Iscriviti ora
    </button>
  );
};

export default SignupButton;
