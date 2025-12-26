import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useState } from 'react';

export default function PremiumBadge() {
  const [st, setSt] = useState({ loading: true, is_premium: false, messages: 0 });
  const PAY = import.meta.env.VITE_PAYMENT_LINK_URL;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/premium-stats', { credentials: 'include' });
        const j = await r.json();
        if (!alive) return;
        if (j.ok)
          setSt({ loading: false, is_premium: !!j.is_premium, messages: Number(j.messages || 0) });
        else setSt({ loading: false, is_premium: false, messages: 0 });
      } catch {
        setSt({ loading: false, is_premium: false, messages: 0 });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (st.loading) return <span className="badge">...</span>;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        className={'badge ' + (st.is_premium ? 'badge--premium' : 'badge--free')}
        aria-label={st.is_premium ? 'Stato: Premium' : 'Stato: Free'}
      >
        {st.is_premium ? 'â­ Premium' : 'Free'}
      </span>
      {!st.is_premium && (
        <a className="btn" href={PAY} target="_blank" rel="noreferrer" aria-label="Sblocca Premium">
          Sblocca
        </a>
      )}
    </div>
  );
}
