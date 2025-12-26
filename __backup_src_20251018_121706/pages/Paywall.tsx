// src/pages/Paywall.tsx

import React, { useEffect } from 'react';
import SignupButton from '../components/SignupButton';
import PurchaseButton from '../components/PurchaseButton';
import { trackEvent } from '../lib/analytics';

const Paywall = () => {
  // Traccia la visualizzazione del paywall
  useEffect(() => {
    trackEvent('paywall_view');
  }, []);

  return (
    <div style={{
      padding: '3rem',
      background: '#121212',
      color: '#fff',
      fontFamily: 'system-ui',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#bb86fc', fontSize: '2rem' }}>
        💎 LoveMatch360 Premium
      </h1>
      
      <p style={{ fontSize: '1.2rem', marginTop: '1rem' }}>
        Sblocca funzionalità esclusive:
      </p>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem', fontSize: '1rem' }}>
        <li>✅ Chat illimitate con match a 100</li>
        <li>✅ Visualizzazione profili visitatori</li>
        <li>✅ Priorità nei risultati</li>
        <li>✅ Accesso a eventi esclusivi</li>
      </ul>

      <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <SignupButton />
        <PurchaseButton />
      </div>
    </div>
  );
};

export default Paywall;
