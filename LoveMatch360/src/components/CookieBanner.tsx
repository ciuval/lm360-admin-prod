// src/components/CookieBanner.tsx

import React from 'react';
import { useTrackingConsent } from '../hooks/useTrackingConsent';
import '../../styles/cookie-banner.css';

export default function CookieBanner() {
  const { consentGiven, acceptConsent, rejectConsent } = 
useTrackingConsent();

  if (consentGiven !== null) return null; // già deciso → non mostrare 
banner

  return (
    <div className="cookie-banner">
      <p>
        Questo sito utilizza cookie per migliorare l’esperienza utente e 
analizzare l’uso. Vuoi
        accettare il tracciamento?
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={acceptConsent}
          aria-label="Accetta i cookie"
        >
          Accetta
        </button>
        <button
          onClick={rejectConsent}
          aria-label="Rifiuta i cookie"
        >
          Rifiuta
        </button>
      </div>
    </div>
  );
}

