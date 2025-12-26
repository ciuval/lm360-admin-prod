import { getJson, setJson } from '../lib/storage';
// src/components/FooterBasic.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { EMAILS, mailto } from '../config/emails';

export default function FooterBasic() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '16px',
        color: 'var(--muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <span>Â© {new Date().getFullYear()} LoveMatch360</span>
      <nav style={{ display: 'flex', gap: 12 }}>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Termini</Link>
        <Link to="/cookies">Cookie</Link>
        <a href={mailto(EMAILS.SUPPORT, 'Supporto LoveMatch360')}>Supporto</a>
      </nav>
    </footer>
  );
}
