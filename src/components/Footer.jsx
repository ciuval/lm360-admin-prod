import { getJson, setJson } from '../lib/storage';
import React from 'react';
import StickyCTA from './StickyCTA';
import { Toasts } from './Toasts';

export default function Footer() {
  return (
    <>
      <footer style={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.1)', marginTop: 24 }}>
        <nav aria-label="Link utili" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a href="#/privacy">Privacy</a>
          <a href="#/termini">Termini</a>
          <a href="#/about">About</a>
          <a href="#/contatti">Contatti</a>
        </nav>
      </footer>
      <StickyCTA />
      <Toasts />
    </>
  );
}
