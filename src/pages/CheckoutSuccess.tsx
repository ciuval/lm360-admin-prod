import React, { useEffect } from 'react';
import { trackEvent } from '../lib/analytics';

const CheckoutSuccess = () => {
  useEffect(() => {
    trackEvent('purchase', {
      value: 9.90,
      currency: 'EUR',
      method: 'Stripe'
    });
  }, []);

  return (
    <div style={{
      padding: '3rem',
      background: '#121212',
      color: '#fff',
      fontFamily: 'system-ui',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', color: '#00e676' }}>🎉 Grazie per aver attivato Premium!</h1>

      <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
        Il tuo account è ora abilitato con tutte le funzionalità esclusive di LoveMatch360.
      </p>

      <p style={{ marginTop: '2rem' }}>
        Puoi ora <a href="/chat/placeholder" style={{ color: '#bb86fc' }}>iniziare a chattare</a> con match 100/100!
      </p>
    </div>
  );
};

export default CheckoutSuccess;
