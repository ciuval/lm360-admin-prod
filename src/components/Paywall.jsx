import { getJson, setJson } from '../lib/storage';
/**
 * Paywall "soft": se esiste VITE_PAYMENT_LINK_URL => redirect.
 * Altrimenti chiama un endpoint /api/checkout?price=... (da fare dopo).
 */
export function openPaywall(opts = {}) {
  const link = import.meta?.env?.VITE_PAYMENT_LINK_URL || '';
  const priceId = opts.priceId || import.meta?.env?.VITE_PRICE_ID || '';
  const base = (import.meta?.env?.VITE_API_BASE || '/api').replace(/\/$/, '');
  if (link) {
    window.location.href = link; // Payment Link Stripe
    return;
  }
  if (!priceId) {
    alert('Prezzo non configurato. Imposta VITE_PAYMENT_LINK_URL o VITE_PRICE_ID.');
    return;
  }
  const url = `${base}/checkout?price=${encodeURIComponent(priceId)}&source=app`;
  window.location.href = url;
}

export function PayButton({ children = 'Attiva Premium', onClick, ...props }) {
  return (
    <button
      aria-label="Attiva Premium"
      onClick={(e) => {
        onClick?.(e);
        openPaywall();
      }}
      style={{
        padding: '12px 16px',
        borderRadius: 12,
        border: 'none',
        background: '#7C3AED',
        color: '#fff',
      }}
      {...props}
    >
      {children}
    </button>
  );
}
