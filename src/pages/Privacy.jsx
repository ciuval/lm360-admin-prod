import { getJson, setJson } from '../lib/storage';
import React, { useEffect } from 'react';
export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy | LoveMatch360';
  }, []);
  return (
    <main id="main" tabIndex={-1} style={{ padding: '24px', maxWidth: 880, margin: '0 auto' }}>
      <h1>Informativa Privacy</h1>
      <p role="doc-subtitle">Ultimo aggiornamento: 18 ottobre 2025</p>
      <p>GDPR, diritti, contatti: support@lovematch360.com</p>
    </main>
  );
}
