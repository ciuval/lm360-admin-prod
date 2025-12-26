import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';

export default function RequirePremium({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, premium: false });

  useEffect(() => {
    let alive = true;
    (async () => {
      if (import.meta.env.VITE_FORCE_PREMIUM === '1') {
        setState({ loading: false, premium: true });
        return;
      }
      if (!user) {
        setState({ loading: false, premium: false });
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('is_premium, role')
        .eq('id', user.id)
        .maybeSingle();
      const premium = !!data?.is_premium || data?.role === 'premium';
      setState({ loading: false, premium });
    })();
    return () => {
      alive = false;
    };
  }, [user]);

  if (state.loading)
    return (
      <section style={{ maxWidth: 720, margin: '8vh auto', padding: '0 24px' }}>
        <p>Carico…</p>
      </section>
    );
  if (state.premium) return children;

  const link = import.meta.env.VITE_PAYMENT_LINK_URL || '/#/premium';
  window.plausible?.('paywall_view');

  return (
    <main style={{ maxWidth: 720, margin: '8vh auto', padding: '0 24px' }}>
      <section
        style={{
          border: '1px solid #1e252d',
          borderRadius: 12,
          padding: 20,
          background: '#12161b',
        }}
      >
        <h2>Contenuto Premium</h2>
        <p style={{ opacity: 0.9 }}>
          Sblocca le guide complete e i template. Abbonamento mensile, cancelli quando vuoi.
        </p>
        <a className="btn btn-primary" href={link} aria-label="Vai al Premium">
          Scopri Premium
        </a>
      </section>
    </main>
  );
}
