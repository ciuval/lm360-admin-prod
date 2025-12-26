// src/utils/abbonamenti.js
export async function attivaAbbonamento({ lookup_key, user_id, email }) {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

  const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lookup_key, user_id, email }),
  });

  if (!res.ok) {
    const t = await res.text();
    return { error: t || res.statusText };
  }

  const out = await res.json();
  if (out?.url) {
    window.location.href = out.url; // redirect a Stripe
    return { ok: true };
  }
  return { error: 'URL non ricevuta dal server' };
}
