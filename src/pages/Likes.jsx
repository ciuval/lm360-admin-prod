import { getJson, setJson } from '../lib/storage';
import React from 'react';
export default function Likes() {
  return (
    <main id="main" tabIndex={-1} style={{ padding: '24px', maxWidth: 880, margin: '0 auto' }}>
      <h1>I tuoi Like</h1>
      <p className="muted">Invia il primo like per iniziare la conversazione.</p>
    </main>
  );
}
