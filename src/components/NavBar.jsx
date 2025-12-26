import React from 'react';
import { useAuth } from '../lib/authContext';
import { supabase } from '../lib/supabaseClient';

export default function Navbar() {
  const { user } = useAuth();

  const bar = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #1e252d',
    position: 'sticky',
    top: 0,
    background: '#0b0d10',
    zIndex: 10,
  };
  const link = { color: '#e8edf2', textDecoration: 'none', padding: '8px 10px', borderRadius: 8 };
  const btnP = { ...link, background: '#3A7AFE', color: '#fff', fontWeight: 600 };
  const btnG = { ...link, border: '1px solid #2b323b' };

  const isActive = (hash) =>
    typeof location !== 'undefined' && location.hash.startsWith(hash) ? 'page' : undefined;
  const logout = async () => {
    await supabase.auth.signOut();
    location.hash = '#/home';
  };

  return (
    <nav style={bar} role="navigation" aria-label="Principale">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a href="#/home" style={{ ...link, fontWeight: 700 }} aria-current={isActive('#/home')}>
          LoveMatch360
        </a>
        <a href="#/premium" style={link} aria-current={isActive('#/premium')}>
          Premium
        </a>
        <a href="#/discover" style={link} aria-current={isActive('#/discover')}>
          Scopri
        </a>
        {user && (
          <a href="#/profile" style={link} aria-current={isActive('#/profile')}>
            Profilo
          </a>
        )}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {user ? (
          <>
            <a href="#/account" style={btnG} aria-current={isActive('#/account')}>
              Account
            </a>
            <button onClick={logout} style={btnG} aria-label="Esci">
              Esci
            </button>
          </>
        ) : (
          <>
            <a href="#/login" style={btnG} aria-current={isActive('#/login')}>
              Accedi
            </a>
            <a
              href="#/signup"
              style={btnP}
              aria-label="Registrati"
              aria-current={isActive('#/signup')}
            >
              Registrati
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
