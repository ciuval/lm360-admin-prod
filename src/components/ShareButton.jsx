import React from 'react';

export default function ShareButton({ id, title }) {
  const url = `${window.location.origin}/#/consigli/${id}`;

  async function share() {
    const payload = {
      title: 'LoveMatch360 — Consiglio',
      text: title,
      url,
    };

    // Web Share API (mobile / browser moderni)
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // se l'utente annulla, passiamo al fallback
      }
    }

    // WhatsApp Web (desktop/mobile)
    try {
      const wa = `https://wa.me/?text=${encodeURIComponent(title + ' — ' + url)}`;
      window.open(wa, '_blank', 'noopener,noreferrer');
      return;
    } catch {}

    // Fallback: copia link
    try {
      await navigator.clipboard.writeText(url);
      window.toast?.('Link copiato', 'puoi condividerlo dove vuoi', 'success');
    } catch {
      window.prompt('Copia il link:', url);
    }
  }

  return (
    <button
      className="btn"
      type="button"
      onClick={share}
      aria-label="Condividi questo consiglio"
      style={{ fontSize: 14 }}
    >
      🔗 Condividi
    </button>
  );
}
