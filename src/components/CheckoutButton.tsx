// src/components/CheckoutButton.tsx

import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutButton = () => {
  const handleClick = async () => {
    const stripe = await stripePromise;

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
    });

    const session = await res.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '0.75rem 1.5rem',
        background: '#bb86fc',
        color: '#121212',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        fontSize: '1rem',
        cursor: 'pointer'
      }}
    >
      💳 Attiva Premium
    </button>
  );
};

export default CheckoutButton;
