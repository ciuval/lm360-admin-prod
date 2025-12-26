import { getJson, setJson } from '../lib/storage';
// src/pages/AttivaPremium.jsx
// LoveMatch360 â€” Checkout reale (subscription) + Customer Portal
// Richiede: server con /api/checkout/session e /api/customer-portal
// Frontend .env: VITE_API_BASE=http://localhost:3000

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';

const API = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function AttivaPremium() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState('premium_monthly'); // default mensile
  const [loading, setLoading] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);

  // carica utente
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });
  }, []);

  // messaggi da query (es. /premium?canceled=1)
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get('canceled') === '1') {
      toast('Checkout annullato. Nessun addebito â¤ï¸');
    }
  }, [location.search]);

  async function startCheckout() {
    if (!user) {
      toast.error('Devi accedere per attivare Premium.');
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/checkout/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan, // "premium_monthly" | "premium_yearly"
          user_id: user.id, // permette al webhook di mapparti
          email: user.email || null,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.url) {
        throw new Error(json?.error || 'Errore creazione sessione');
      }
      // Redirect a Stripe Checkout
      window.location.href = json.url;
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Errore rete');
    } finally {
      setLoading(false);
    }
  }

  async function openPortal() {
    if (!user) {
      toast.error('Accedi per gestire lâ€™abbonamento.');
      navigate('/login');
      return;
    }
    try {
      setLoadingPortal(true);
      const res = await fetch(`${API}/api/customer-portal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          // opzionale: return_url custom
          // return_url: window.location.origin + "/#/premium"
        }),
      });
      const json = await res.json();
      if (!res.ok || !json?.url) {
        throw new Error(json?.error || 'Errore apertura Portal');
      }
      window.location.href = json.url;
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Errore rete');
    } finally {
      setLoadingPortal(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '1.25rem', color: '#fff' }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>LoveMatch360 Premium ðŸ’Ž</h1>
      <p style={{ opacity: 0.9, marginBottom: 16 }}>
        Match intelligenti, ambiente sicuro, vibe elegante. Nessun caos.
      </p>

      {/* Scelta piano */}
      <div
        role="radiogroup"
        aria-label="Seleziona il piano"
        style={{
          display: 'grid',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <label style={labelStyle(plan === 'premium_monthly')}>
          <input
            type="radio"
            name="plan"
            value="premium_monthly"
            checked={plan === 'premium_monthly'}
            onChange={() => setPlan('premium_monthly')}
            style={{ marginRight: 8 }}
          />
          <span>Mensile</span>
          <span style={pill}>Flessibile</span>
        </label>

        <label style={labelStyle(plan === 'premium_yearly')}>
          <input
            type="radio"
            name="plan"
            value="premium_yearly"
            checked={plan === 'premium_yearly'}
            onChange={() => setPlan('premium_yearly')}
            style={{ marginRight: 8 }}
          />
          <span>Annuale</span>
          <span style={pill}>Risparmi di piÃ¹</span>
        </label>
      </div>

      {/* CTA checkout */}
      <button
        onClick={startCheckout}
        disabled={loading}
        aria-busy={loading ? 'true' : 'false'}
        style={ctaPrimary}
      >
        {loading ? 'Reindirizzamentoâ€¦' : 'âœ¨ Attiva Premium'}
      </button>

      {/* Portal */}
      <div style={{ marginTop: 16 }}>
        <button
          onClick={openPortal}
          disabled={loadingPortal}
          aria-busy={loadingPortal ? 'true' : 'false'}
          style={ctaSecondary}
        >
          {loadingPortal ? 'Aperturaâ€¦' : 'Gestisci abbonamento (Portal)'}
        </button>
      </div>

      <p style={{ opacity: 0.7, fontSize: 13, marginTop: 14 }}>
        Pagamenti sicuri Stripe. Puoi annullare in qualsiasi momento dal Portal.
      </p>
    </div>
  );
}

/* ---- UI helpers ------------------------------------------------------- */
const labelStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 14px',
  borderRadius: 12,
  background: active ? '#1e1e1e' : '#141414',
  border: active ? '1px solid #f08fc0' : '1px solid #2e2e2e',
  cursor: 'pointer',
  userSelect: 'none',
});

const pill = {
  marginLeft: 'auto',
  background: '#2a2a2a',
  border: '1px solid #404040',
  borderRadius: 999,
  padding: '2px 8px',
  fontSize: 12,
  opacity: 0.9,
};

const ctaPrimary = {
  marginTop: 8,
  padding: '12px 18px',
  backgroundColor: '#f08fc0',
  color: '#121212',
  fontWeight: 700,
  border: 'none',
  borderRadius: 10,
  cursor: 'pointer',
  boxShadow: '0 0 0 0 rgba(240,143,192,0.0)',
  transition: 'transform .12s ease, box-shadow .2s ease',
};

const ctaSecondary = {
  padding: '10px 14px',
  backgroundColor: '#1e1e1e',
  color: '#fff',
  border: '1px solid #333',
  borderRadius: 10,
  cursor: 'pointer',
};
