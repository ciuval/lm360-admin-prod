import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
const PAYMENT_LINK = import.meta.env.VITE_PAYMENT_LINK_URL;

export default function PaywallButton() {
  const [loading, setLoading] = useState(false);
  const goPremium = async () => {
    if (PAYMENT_LINK) {
      window.location.href = PAYMENT_LINK;
      return;
    }
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const r = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const j = await r.json();
      if (j?.url) window.location.href = j.url;
    } finally {
      setLoading(false);
    }
  };
  return (
    <button aria-label="Scopri Premium" onClick={goPremium} disabled={loading}>
      {loading ? '...' : 'Scopri Premium — 9,99€'}
    </button>
  );
}
