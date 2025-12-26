import { getJson, setJson } from '../lib/storage';
import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main style={s.main}>
      <h1 style={s.h1}>LoveMatch360 — Consigli utili, zero caos</h1>
      <p style={s.p}>
        Percorsi pratici per relazioni sane e crescita personale. Ambiente sicuro, elegante, senza
        rumore.
      </p>
      <div style={s.actions}>
        <Link to="/onboarding" style={s.cta}>
          Inizia gratis
        </Link>
        <Link to="/premium" style={s.ctaAlt}>
          Scopri Premium
        </Link>
      </div>
    </main>
  );
}

const s = {
  main: {
    minHeight: '70vh',
    display: 'grid',
    placeItems: 'center',
    gap: 12,
    textAlign: 'center',
    color: '#eee',
  },
  h1: { fontSize: 28, margin: 0 },
  p: { maxWidth: 720, opacity: 0.9 },
  actions: { display: 'flex', gap: 12, justifyContent: 'center' },
  cta: {
    padding: '10px 14px',
    borderRadius: 8,
    background: '#4f46e5',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
  },
  ctaAlt: {
    padding: '10px 14px',
    borderRadius: 8,
    background: '#374151',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 600,
  },
};
