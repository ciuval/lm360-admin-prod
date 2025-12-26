import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ReportEconomicoMensile from '../components/ReportEconomicoMensile';

export default function AdminDashboard() {
  const [utenti, setUtenti] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    fetchUtenti();
  }, []);

  const fetchUtenti = async () => {
    const { data, error } = await supabase.from('profili').select('*');
    if (!error && data) setUtenti(data);
  };

  const cambiaRuolo = async (id, nuovoRuolo) => {
    await supabase.from('profili').update({ ruolo: nuovoRuolo }).eq('id', id);
    fetchUtenti();
  };

  const cambiaPremium = async (id, nuovoValore) => {
    await supabase.from('profili').update({ premium: nuovoValore }).eq('id', id);
    fetchUtenti();
  };

  const eliminaUtente = async (id) => {
    await supabase.from('profili').delete().eq('id', id);
    fetchUtenti();
  };

  const utentiFiltrati = utenti.filter((u) =>
    (u.username || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>ðŸ› ï¸ Admin Dashboard</h2>

      <input
        type="text"
        placeholder="ðŸ” Cerca utente..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={inputStyle}
      />

      <ul style={listStyle}>
        {utentiFiltrati.map((u) => (
          <li key={u.id} style={itemStyle}>
            <strong>{u.username || 'Anonimo'}</strong> â€“ <code>{u.ruolo}</code>
            {u.premium && <span style={premiumBadge}> ðŸŒŸ Premium</span>}
            <br />
            <button onClick={() => cambiaRuolo(u.id, 'admin')} style={btn}>
              ðŸ”‘ Admin
            </button>
            <button onClick={() => cambiaRuolo(u.id, 'utente')} style={btn}>
              ðŸ™‹â€â™‚ï¸ Utente
            </button>
            <button
              onClick={() => cambiaPremium(u.id, !u.premium)}
              style={{
                ...btn,
                backgroundColor: u.premium ? '#888' : '#ffd700',
                color: u.premium ? '#fff' : '#000',
              }}
            >
              <ReportEconomicoMensile />
              {u.premium ? 'ðŸ’¼ Rimuovi Premium' : 'ðŸŒŸ Rendi Premium'}
            </button>
            <button
              onClick={() => eliminaUtente(u.id)}
              style={{ ...btn, backgroundColor: '#ff4d4d' }}
            >
              ðŸ—‘ï¸ Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// STILI
const containerStyle = {
  backgroundColor: '#121212',
  color: '#fff',
  padding: '2rem',
  fontFamily: 'Segoe UI, sans-serif',
  minHeight: '100vh',
};

const titleStyle = {
  color: '#f08fc0',
  textShadow: '0 0 10px #f08fc0',
  marginBottom: '1rem',
};

const inputStyle = {
  padding: '0.6rem',
  marginBottom: '1rem',
  width: '100%',
  borderRadius: '6px',
  backgroundColor: '#1e1e1e',
  color: '#fff',
  border: 'none',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
};

const itemStyle = {
  marginBottom: '1rem',
  borderBottom: '1px solid #333',
  paddingBottom: '1rem',
};

const btn = {
  margin: '0.4rem 0.4rem 0 0',
  padding: '0.4rem 0.8rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  backgroundColor: '#333',
  color: '#fff',
};

const premiumBadge = {
  backgroundColor: '#ffd700',
  color: '#000',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  marginLeft: '0.5rem',
  fontWeight: 'bold',
};
