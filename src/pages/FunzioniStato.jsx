import { getJson, setJson } from '../lib/storage';
import React from 'react';

export default function FunzioniStato() {
  const shareLink = 'https://lovematch360.com/#/funzioni';

  const copiaLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert('ðŸ”— Link copiato negli appunti!');
  };

  return (
    <div style={{ padding: '2rem', color: '#fff', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#f08fc0' }}>
        ðŸŒ LoveMatch360: Funzioni & Stato
      </h1>

      <h2 style={{ color: '#90ee90', fontSize: '1.25rem' }}>âœ… Funzioni Attive</h2>
      <ul>
        <li>ðŸ§  Matchmaking + dashboard ðŸ’˜</li>
        <li>ðŸ’¬ Chat realtime</li>
        <li>ðŸ“¬ Newsletter Supabase+Zoho</li>
        <li>ðŸ§‘â€ðŸ’» Admin Dashboard</li>
        <li>ðŸ“ˆ Visite profili</li>
        <li>ðŸ”” Notifiche toast + suono</li>
        <li>ðŸ“ Feed post</li>
        <li>ðŸŒ‘ Dark Mode</li>
      </ul>

      <h2 style={{ color: 'orange', fontSize: '1.25rem', marginTop: '2rem' }}>
        ðŸ› ï¸ In Sviluppo
      </h2>
      <ul>
        <li>ðŸ”´ Badge messaggi</li>
        <li>ðŸ§­ Contatore match</li>
        <li>ðŸ‘€ Visitatori</li>
      </ul>

      <h2 style={{ color: '#87ceeb', fontSize: '1.25rem', marginTop: '2rem' }}>âœ¨ Consigli</h2>
      <ul>
        <li>ðŸ”’ CAPTCHA + RLS</li>
        <li>ðŸ’¡ Punteggio visibile</li>
        <li>ðŸ¤– AI Match Assistant</li>
      </ul>

      {/* ðŸ”— Bottoni condivisione */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={button('green')}
        >
          ðŸ“¤ WhatsApp
        </a>
        <a
          href={`mailto:?subject=Funzioni LoveMatch360&body=Scopri tutte le funzioni: ${shareLink}`}
          style={button('blue')}
        >
          ðŸ“§ Email
        </a>
        <button onClick={copiaLink} style={button('gray')}>
          ðŸ“‹ Copia Link
        </button>
      </div>
    </div>
  );
}

function button(color) {
  const colors = {
    green: '#16a34a',
    blue: '#2563eb',
    gray: '#4b5563',
  };
  return {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    backgroundColor: colors[color],
    color: '#fff',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
    border: 'none',
  };
}
