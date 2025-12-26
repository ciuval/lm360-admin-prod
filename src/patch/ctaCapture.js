const PAYMENT_LINK = import.meta.env.VITE_PAYMENT_LINK_URL;

function isStartLabel(t) {
  const s = (t || '').trim().toLowerCase();
  return (
    s.startsWith('inizia gratis') ||
    s.startsWith('entra ora') ||
    s.startsWith('registrati') ||
    s.startsWith('prova ora')
  );
}
function isPremiumLabel(t) {
  const s = (t || '').trim().toLowerCase();
  return s.includes('premium');
}

window.addEventListener(
  'click',
  (ev) => {
    const el = ev.target?.closest?.('button,a,[data-cta]');
    if (!el) return;

    const label = (el.getAttribute('aria-label') || el.textContent || '').trim();

    // CTA Start → vai a #/signup
    if (el.matches('[data-cta="start"]') || isStartLabel(label)) {
      try {
        ev.preventDefault();
        ev.stopPropagation();
        window.location.hash = '#/signup';
      } catch {}
      return;
    }

    // CTA Premium → Payment Link o Checkout
    if (el.matches('[data-cta="premium"]') || isPremiumLabel(label)) {
      try {
        ev.preventDefault();
        ev.stopPropagation();
        if (PAYMENT_LINK) {
          window.location.href = PAYMENT_LINK;
          return;
        }
        fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
          .then((r) => r.json())
          .then((j) => {
            if (j?.url) location.href = j.url;
          })
          .catch(() => {});
      } catch {}
    }
  },
  true
); // capture=true
