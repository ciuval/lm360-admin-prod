import { getJson, setJson } from '../lib/storage';
import React, { useEffect } from 'react';
export default function Terms() {
  useEffect(() => {
    document.title = 'Termini & Condizioni | LoveMatch360';
  }, []);
  return (
    <main id="main" tabIndex={-1} style={{ padding: '24px', maxWidth: 880, margin: '0 auto' }}>
      <h1>Termini &amp; Condizioni</h1>
      <p role="doc-subtitle">Ultimo aggiornamento: 18 ottobre 2025</p>
      <p>Servizio, rimborsi 30 giorni, community moderata.</p>
    </main>
  );
}
