import React from 'react';
import { usePremium } from '../hooks/usePremium';

export default function RequirePremium({ children, fallback = 'Per accedere serve Premium.', showLink = true }) {
  const { loading, premium } = usePremium?.() ?? { loading: false, premium: false };

  // Evita jitter all'utente: mostra nulla durante il check iniziale
  if (loading) return null;

  if (!premium) {
    return (
      <div style={{padding:'24px',maxWidth:680,margin:'40px auto',lineHeight:1.6}}>
        <div style={{marginBottom:12,fontWeight:600}}>Area riservata</div>
        <div style={{opacity:.9,marginBottom:12}}>
          {fallback}
        </div>
        {showLink && (
          <a href="#/premium" style={{color:'#9cf',textDecoration:'underline'}}>
            Diventa Premium per sbloccare l’accesso
          </a>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
