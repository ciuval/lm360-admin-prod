import { getJson, setJson } from '../lib/storage';
import React, { useEffect } from 'react';
import { usePaywall } from '../hooks/usePaywall';

export default function PaywallGate({ title = 'Contenuto Premium', children }) {
  const { premium, meter, requireUpgrade, bumpView } = usePaywall();

  useEffect(() => {
    bumpView();
  }, []); // conteggia questa vista

  const box = {
    border: '1px solid #1f2937',
    background: '#0f172a',
    borderRadius: 12,
    padding: 16,
    color: '#e5e7eb',
  };
  const btn = {
    padding: '10px 16px',
    borderRadius: 8,
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  };

  if (premium) {
    return <div style={box}>{children}</div>;
  }

  if (requireUpgrade) {
    return (
      <div style={box}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p>Hai esaurito le letture gratuite di oggi.</p>
        <a href="#/premium-checkout-test" style={{ display: 'inline-block', marginTop: 8 }}>
          <button style={btn} aria-label="Attiva Premium">
            Attiva Premium
          </button>
        </a>
        <p style={{ marginTop: 12, fontSize: 13, opacity: 0.8 }}>
          Puoi continuare domani con nuove letture gratuite.
        </p>
      </div>
    );
  }

  return (
    <div style={box} aria-live="polite">
      <div style={{ fontSize: 13, marginBottom: 8 }}>
        Letture gratuite rimaste oggi: <strong>{meter.remaining}</strong> / {meter.limit}
      </div>
      {children}
    </div>
  );
}
