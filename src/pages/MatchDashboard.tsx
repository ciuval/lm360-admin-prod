// src/pages/MatchDashboard.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const MatchDashboard = () => {
  const [matchLogs, setMatchLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const loadMatches = async () => {
    setLoading(true);

    let query = supabase
      .from('match_event_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (userFilter) {
      query = query.or(`user1_id.eq.${userFilter},user2_id.eq.${userFilter}`);
    }

    if (dateFilter) {
      query = query.gte('created_at', new Date(dateFilter).toISOString());
    }

    const { data, error } = await query;

    if (!error && data) {
      setMatchLogs(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMatches();
  }, []);

  return (
    <div style={{
      background: '#121212',
      color: '#fff',
      fontFamily: 'system-ui',
      padding: '2rem'
    }}>
      <h2 style={{ color: '#bb86fc' }}>💘 Match 100 con Filtri</h2>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          placeholder="Filtra per user_id"
          style={{ padding: '0.5rem', flex: 1 }}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
        <button onClick={loadMatches} style={{ padding: '0.5rem 1rem' }}>Filtra</button>
      </div>

      {loading ? (
        <p>Caricamento in corso...</p>
      ) : matchLogs.length === 0 ? (
        <p>Nessun match trovato.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {matchLogs.map((log) => (
            <li key={log.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
              <strong>{log.user1_id}</strong> 💘 <strong>{log.user2_id}</strong><br />
              <small>{new Date(log.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchDashboard;
