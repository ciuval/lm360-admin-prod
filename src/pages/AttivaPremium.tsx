// src/pages/AttivaPremium.tsx

import React, { useEffect } from 'react';
import CheckoutButton from '../components/CheckoutButton';
import { trackEvent } from '../lib/analytics';

const AttivaPremium = () => {
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
      <h1 style={{ fontSize: '2rem', color: '#bb86fc' }}>💎 Passa a LoveMatch360 Premium</h1>

      <p style={{ fontSize: '1.1rem', margin: '1rem 0' }}>
        Ottieni accesso esclusivo alla chat con match compatibili (100/100), visualizza i visitatori del profilo
        e sblocca funzionalità avanzate.
      </p>

      <p style={{ marginBottom: '2rem' }}>
        Il piano Premium supporta lo sviluppo del progetto ❤️
      </p>

      <CheckoutButton />
    </div>
  );
};

export default AttivaPremium;
