import React from 'react';
export default function Hero() {
  const wrap = {
    padding: '24px',
    maxWidth: 1120,
    margin: '0 auto',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  };
  const btn = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px',
    borderRadius: 12,
    fontWeight: 600,
    textDecoration: 'none',
    lineHeight: 1.1,
  };
  const solid = { ...btn, background: '#3A7AFE', color: '#fff' };
  const ghost = {
    ...btn,
    background: 'transparent',
    color: '#e8edf2',
    border: '1px solid #2b323b',
  };
  return (
    <section style={wrap} aria-label="Hero">
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>
        LoveMatch360 · Consigli utili, scelte migliori
      </h1>
      <p style={{ opacity: 0.9, maxWidth: 720 }}>
        Match intelligenti, ambiente sicuro, zero caos. Percorsi chiari e strumenti semplici.
      </p>
      <div
        style={{ display: 'flex', gap: 12, marginTop: 12 }}
        role="group"
        aria-label="Azioni principali"
      >
        <a href="#/signup" aria-label="Inizia gratis" style={solid}>
          Inizia gratis
        </a>
        <a href="#/premium" aria-label="Scopri Premium" style={ghost}>
          Scopri Premium (9,99€)
        </a>
      </div>
    </section>
  );
}
