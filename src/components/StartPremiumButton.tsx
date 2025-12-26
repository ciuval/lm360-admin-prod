import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const StartPremiumButton = () => {
  const handleClick = async () => {
    const stripe = await stripePromise;
    const res = await fetch('/api/checkout-session', { method: 'POST' });
    const session = await res.json();
    stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: '#bb86fc',
        color: '#000',
        padding: '1rem 2rem',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}
    >
      Attiva Premium 💎
    </button>
  );
};
