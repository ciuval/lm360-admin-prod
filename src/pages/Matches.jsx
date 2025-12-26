import { getJson, setJson } from '../lib/storage';
import React from 'react';
export default function Matches() {
  return (
    <main id="main" tabIndex={-1} style={{ padding: '24px', maxWidth: 880, margin: '0 auto' }}>
      <h1>Match</h1>
      <p className="muted">Quando il like è reciproco, la chat si sblocca qui.</p>
    </main>
  );
}
