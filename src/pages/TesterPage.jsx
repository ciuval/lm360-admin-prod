import { getJson, setJson } from '../lib/storage';
// src/pages/TesterPage.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';

export default function TesterPage() {
  const [session, setSession] = useState({
    user: {
      id: 'vale-test-id',
      email: 'vale-test@example.com',
    },
  });
  const [profilo, setProfilo] = useState(null);
  const [log, setLog] = useState([]);
  const [messaggi, setMessaggi] = useState([]);
  const [output, setOutput] = useState('');

  useEffect(() => {
    const userId = session.user.id;

    supabase
      .from('profili')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (!error) setProfilo(data);
      });

    supabase
      .from('log_attivita')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (!error) setLog(data || []);
      });

    supabase
      .from('messaggi')
      .select('*')
      .or(`mittente_id.eq.${userId},destinatario_id.eq.${userId}`)
      .then(({ data, error }) => {
        if (!error) setMessaggi(data || []);
      });
  }, [session]);

  const handleLogout = async () => {
    toast('âœ… Finto logout completato');
    setSession(null);
    setTimeout(() => window.location.reload(), 1000);
  };

  const generaMatch = async () => {
    const fakeUserId = session.user.id;

    const { data: me } = await supabase.from('profili').select('*').eq('id', fakeUserId).single();

    if (!me) return toast('âš ï¸ Profilo utente non trovato');

    const { data: altri } = await supabase.from('profili').select('*').neq('id', fakeUserId);

    const risultati = (altri || []).map((altro) => {
      const interessiA = (me.interessi || '').toLowerCase().split(',');
      const interessiB = (altro.interessi || '').toLowerCase().split(',');
      const match = interessiA.filter((i) => interessiB.includes(i.trim())).length;
      const score = Math.round((match / Math.max(interessiA.length, 1)) * 100);
      return {
        user_id: me.id,
        matched_user_id: altro.id,
        score,
      };
    });

    const { error } = await supabase.from('match_scores').upsert(risultati, {
      onConflict: ['user_id', 'matched_user_id'],
    });

    if (error) {
      toast.error(`âŒ Errore: ${error.message}`);
      return;
    }

    toast.success('âœ… Match generati!');
    setOutput(JSON.stringify(risultati, null, 2));
  };

  return (
    <div style={containerStyle}>
      <Toaster position="top-right" />
      <h2 style={titleStyle}>ðŸ§¬ Tester Supabase + RLS (Fake Login)</h2>

      {!session && (
        <p style={warningText}>âš ï¸ Nessuna sessione trovata. Fai login finto attivo.</p>
      )}

      {session && (
        <>
          <h3>ðŸ‘¤ Sessione finta attiva</h3>
          <p>
            <b>ID:</b> {session.user.id}
          </p>
          <p>
            <b>Email:</b> {session.user.email}
          </p>

          <div style={{ marginBottom: '1rem' }}>
            <button onClick={generaMatch} style={buttonStyle}>
              ðŸ§  Genera Match
            </button>
            <button onClick={handleLogout} style={logoutBtn}>
              ðŸ”“ Logout
            </button>
          </div>

          <pre style={outputBox}>{output}</pre>

          <h3>ðŸ“˜ Profilo</h3>
          <pre style={outputBox}>{JSON.stringify(profilo, null, 2)}</pre>

          <h3>ðŸ“ Log attivitÃ </h3>
          <pre style={outputBox}>{JSON.stringify(log, null, 2)}</pre>

          <h3>ðŸ’¬ Messaggi</h3>
          <pre style={outputBox}>{JSON.stringify(messaggi, null, 2)}</pre>
        </>
      )}
    </div>
  );
}

// STILI
const containerStyle = {
  padding: '2rem',
  backgroundColor: '#121212',
  color: '#fff',
  minHeight: '100vh',
  fontFamily: "'Segoe UI', sans-serif",
};

const titleStyle = {
  color: '#f08fc0',
  fontSize: '1.5rem',
  marginBottom: '1rem',
};

const warningText = {
  backgroundColor: '#332222',
  padding: '1rem',
  borderRadius: '6px',
  border: '1px solid #aa4444',
};

const outputBox = {
  whiteSpace: 'pre-wrap',
  backgroundColor: '#1e1e1e',
  padding: '1rem',
  borderRadius: '6px',
  border: '1px solid #333',
  fontSize: '0.9rem',
  marginBottom: '1.5rem',
};

const buttonStyle = {
  marginRight: '1rem',
  backgroundColor: '#2196f3',
  color: '#fff',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const logoutBtn = {
  ...buttonStyle,
  backgroundColor: '#f44336',
};
