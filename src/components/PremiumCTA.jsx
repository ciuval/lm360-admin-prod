import { getJson, setJson } from '../lib/storage';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function getDevToken() {
  try {
    const r = await fetch('/api/dev-get-access-token');
    const j = await r.json().catch(() => null);
    return j?.access_token || null;
  } catch {
    return null;
  }
}
async function postPortal(
  body,
  token,
  paths = ['/api/customer-portal', '/api/create-billing-portal-session', '/api/portal']
) {
  for (const p of paths) {
    try {
      const r = await fetch(p, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: Bearer } : {}),
        },
        body: JSON.stringify(body || {}),
      });
      const j = await r.json().catch(() => null);
      if (j?.url) return j.url;
    } catch {}
  }
  return null;
}

export default function PremiumCTA() {
  const [st, setSt] = useState({
    loading: true,
    isPremium: false,
    until: null,
    loadingPortal: false,
  });
  // Mostra solo nella pagina /premium
  const isPremiumPage = typeof location !== 'undefined' && location.hash.includes('/premium');

  useEffect(() => {
    if (!isPremiumPage) {
      setSt((s) => ({ ...s, loading: false }));
      return;
    }
    let ok = true;
    (async () => {
      const { data } = await supabase
        .from('abbonamenti_api')
        .select('scadenza')
        .order('scadenza', { ascending: false })
        .limit(1)
        .maybeSingle();
      const until = data?.scadenza ?? null;
      const isPremium = until ? new Date(until) > new Date() : false;
      if (ok) setSt({ loading: false, isPremium, until, loadingPortal: false });
    })();
    return () => {
      ok = false;
    };
  }, [isPremiumPage]);

  if (st.loading || !isPremiumPage) return null;

  const onManage = async () => {
    setSt((s) => ({ ...s, loadingPortal: true }));
    let token = null;
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      token = session?.access_token || null;
    } catch {}
    if (!token) token = await getDevToken();
    const url = await postPortal({}, token);
    if (url) location.href = url;
    else {
      setSt((s) => ({ ...s, loadingPortal: false }));
      alert('Portale fatturazione non disponibile');
    }
  };

  const btnBase = {
    padding: '12px 18px',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  };
  return (
    <div style={{ margin: '0 0 1rem 0' }}>
      {st.isPremium ? (
        <button
          onClick={onManage}
          style={{ ...btnBase, background: '#1f7a6a' }}
          aria-busy={st.loadingPortal}
        >
          {st.loadingPortal ? 'Apro il portale…' : 'Gestisci abbonamento'}
        </button>
      ) : (
        <a
          href="#/premium-checkout-test"
          style={{
            ...btnBase,
            background: '#b80a4a',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Attiva Premium
        </a>
      )}
    </div>
  );
}
