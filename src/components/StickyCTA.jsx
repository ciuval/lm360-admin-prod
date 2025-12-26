import { getJson, setJson } from '../lib/storage';
import React, { useMemo } from 'react';
import { assign, abClick } from '../lib/ab';

export default function StickyCTA() {
  // Mostra ovunque tranne su Premium
  const hash = typeof location !== 'undefined' ? location.hash || '' : '';
  if (hash.includes('#/premium')) return null;

  const EXP = 'sticky_cta_1v2';
  const variant = useMemo(() => assign(EXP, ['one', 'two']), []); // one=1 bottone, two=2 bottoni

  const wrap = {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    bottom: 'env(safe-area-inset-bottom, 12px)',
    zIndex: 9999,
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    padding: '8px 10px',
    background: 'rgba(10,10,12,.7)',
    backdropFilter: 'blur(6px)',
    border: '1px solid rgba(255,255,255,.08)',
    borderRadius: 14,
  };
  const btn = { padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer' };
  const ghost = {
    padding: '10px 14px',
    borderRadius: 12,
    border: '1px solid #CBD5E1',
    background: 'transparent',
    color: 'inherit',
  };

  const goSignup = () => {
    abClick(EXP, variant, 'primary_sticky');
    location.hash = '#/signup';
  };
  const goPremium = () => {
    abClick(EXP, variant, 'secondary_sticky');
    location.hash = '#/premium';
  };

  if (variant === 'one') {
    return (
      <div role="region" aria-label="Azione rapida" style={wrap}>
        <button style={{ ...btn, background: '#7C3AED', color: '#fff' }} onClick={goSignup}>
          Inizia gratis
        </button>
      </div>
    );
  }
  return (
    <div role="region" aria-label="Azioni rapide" style={wrap}>
      <button style={{ ...btn, background: '#7C3AED', color: '#fff' }} onClick={goSignup}>
        Inizia gratis
      </button>
      <button style={ghost} onClick={goPremium}>
        Premium
      </button>
    </div>
  );
}
