// src/components/PurchaseButton.tsx

import React from 'react';
import { trackEvent } from '../lib/analytics';

const PurchaseButton = () => {
  const handlePurchase = () => {
    // Qui andrebbe la logica di redirect a Stripe Checkout

    // Tracciamento evento
    trackEvent('purchase', {
      value: 9.90,
      currency: 'EUR',
      method: 'Stripe'
    });
  };

  return (
    <button
      onClick={handlePurchase}
      style={{
        background: '#00e676',
        color: '#000',
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      Acquista Premium
    </button>
  );
};

export default PurchaseButton;
