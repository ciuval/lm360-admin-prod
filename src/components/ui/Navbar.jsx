import { getJson, setJson } from '../lib/storage';
import React from 'react';

/** Navbar (HashRouter): usa window.location.hash per aria-current */
export default function Navbar() {
  const cur = typeof window !== 'undefined' ? window.location.hash : '#/';
  const link = (href, label) => (
    <a href={href} aria-current={cur === href ? 'page' : undefined}>
      {label}
    </a>
  );
  return (
    <div className="ui-navbar">
      <nav className="ui-nav-inner ui-nav" aria-label="Navigazione principale">
        <div className="ui-nav-brand">LoveMatch360</div>
        {link('#/discover', 'Scopri')}
        {link('#/likes', 'Like')}
        {link('#/matches', 'Match')}
        {link('#/chat', 'Chat')}
        {link('#/premium', 'Premium')}
        <span style={{ marginLeft: 'auto' }}>{link('#/signup', 'Iscriviti')}</span>
      </nav>
    </div>
  );
}
