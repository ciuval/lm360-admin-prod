import React from 'react';
import { isPremium } from '../lib/premium';

export default function PremiumGate({ used = 0, limitFree = 20, children }) {
  const premium = isPremium();
  const blocked = !premium && used >= limitFree;
  if (!blocked) return <>{children}</>;

  const link = import.meta.env.VITE_PAYMENT_LINK_URL || '#';
  return (
    <div className="card" role="dialog" aria-labelledby="paywall-title">
      <h3 id="paywall-title">Chat illimitata con Premium</h3>
      <p>
        Hai usato {used}/{limitFree} messaggi gratis. Sblocca notifiche e chat senza limiti.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <a className="btn brand" href={link} target="_blank" rel="noreferrer">
          Passa a Premium
        </a>
        <button className="btn" onClick={() => window.history.back()}>
          Torna indietro
        </button>
      </div>
    </div>
  );
}
