const PAYMENT_LINK = import.meta.env.VITE_PAYMENT_LINK_URL;

function tagButtons() {
  const startLabels = ['Inizia gratis', 'Entra ora', 'Registrati', 'Prova ora'];
  const premLabels = ['Scopri Premium', 'Premium', 'Premium — 9,99€', 'Premium 9,99€'];
  document.querySelectorAll('a,button').forEach((b) => {
    const t = (b.textContent || '').trim().toLowerCase();
    if (startLabels.some((l) => t.startsWith(l.toLowerCase()))) b.classList.add('cta-start');
    if (premLabels.some((l) => t.startsWith(l.toLowerCase()))) b.classList.add('cta-premium');
  });
}

async function goPremium(e) {
  e?.preventDefault?.();
  if (PAYMENT_LINK) {
    window.location.href = PAYMENT_LINK;
    return;
  }
  try {
    const r = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const j = await r.json();
    if (j?.url) window.location.href = j.url;
  } catch (_) {}
}

function goStart(e) {
  e?.preventDefault?.();
  // HashRouter: naviga a #/signup
  try {
    window.location.hash = '#/signup';
  } catch {}
}

document.addEventListener('DOMContentLoaded', tagButtons);
setTimeout(tagButtons, 600);

document.addEventListener(
  'click',
  (ev) => {
    const s = ev.target.closest('[data-cta="start"], .cta-start');
    if (s) return goStart(ev);
    const p = ev.target.closest('[data-cta="premium"], .cta-premium');
    if (p) return goPremium(ev);
  },
  { capture: true }
);
