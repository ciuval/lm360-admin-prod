import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useState } from 'react';

export default function PremiumCheckoutTest() {
  const [prices, setPrices] = useState([]);
  const [chosen, setChosen] = useState(null);
  const [err, setErr] = useState('');
  const [tok, setTok] = useState(getJson('LM_TOK') || getJson('lm_tok') || '');

  // carica prezzi e, se manca, prova a prendere un token DEV
  useEffect(() => {
    (async () => {
      try {
        if (!tok) {
          const rTok = await fetch('/api/dev-get-access-token');
          if (rTok.ok) {
            const j = await rTok.json();
            setTok(j.access_token);
            setJson('LM_TOK', j.access_token);
          }
        }
      } catch {}
      try {
        const r = await fetch('/api/get-prices');
        const j = await r.json();
        setPrices(j.prices || []);
      } catch {
        setErr('get-prices fallita');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = async () => {
    setErr('');
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (tok) headers['Authorization'] = 'Bearer ' + tok;

      const res = await fetch('/api/checkout-create', {
        method: 'POST',
        headers,
        body: JSON.stringify({ price_id: chosen }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.url) throw new Error(j.error || res.statusText || 'checkout failed');

      window.location.href = j.url;
    } catch (e) {
      setErr(String(e?.message || e));
    }
  };

  return (
    <div style={{ color: '#eee', padding: 24 }}>
      <h3>Checkout Premium — Test</h3>
      {err && <div style={{ color: '#f66', marginBottom: 12 }}>Errore: {err}</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {prices.map((p) => (
          <li key={p.price_id} style={{ margin: '6px 0' }}>
            <label>
              <input type="radio" name="p" onChange={() => setChosen(p.price_id)} /> {p.product} —{' '}
              {p.amount} {p.currency}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={go} disabled={!chosen} style={{ padding: '10px 16px' }}>
        Vai al checkout
      </button>
    </div>
  );
}
