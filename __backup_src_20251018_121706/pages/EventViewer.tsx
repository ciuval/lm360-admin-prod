import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const EventViewer = ({ currentUser }) => {
  const [eventi, setEventi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState('');
  const [userId, setUserId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [tuttiTipi, setTuttiTipi] = useState<string[]>([]);

  const fetchEventi = async () => {
    setLoading(true);
    let query = supabase
      .from('event_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (eventName) query = query.eq('event_name', eventName);
    if (userId) query = query.eq('user_id', userId);
    if (dateFrom) query = query.gte('created_at', new Date(dateFrom).toISOString());

    const { data, error } = await query;
    if (!error && data) setEventi(data);
    setLoading(false);
  };

  const fetchTipi = async () => {
    const { data } = await supabase.rpc('eventi_distinti');
    if (data) setTuttiTipi(data.map(r => r.event_name));
  };

  useEffect(() => {
    fetchEventi();
    fetchTipi();
  }, [eventName, userId, dateFrom]);

  const exportCSV = () => {
    const headers = ['event_name', 'user_id', 'created_at', 'metadata'];
    const rows = eventi.map(e => [
      e.event_name,
      e.user_id,
      new Date(e.created_at).toISOString(),
      JSON.stringify(e.metadata)
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'event_log_filtrato.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ padding: '2rem', background: '#121212', color: '#fff', fontFamily: 'system-ui' }}>
      <h2 style={{ color: '#bb86fc' }}>📋 Eventi con Filtro Avanzato</h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <select value={eventName} onChange={(e) => setEventName(e.target.value)} style={{ padding: '0.5rem' }}>
          <option value="">Tutti gli eventi</option>
          {tuttiTipi.map(tipo => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filtra per user_id"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ padding: '0.5rem' }}
        />

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          style={{ padding: '0.5rem' }}
        />

        {eventi.length > 0 && (
          <button
            onClick={exportCSV}
            style={{ padding: '0.5rem 1rem', background: '#00e676', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}
          >
            📥 Esporta CSV
          </button>
        )}
      </div>

      {loading ? (
        <p>Caricamento...</p>
      ) : eventi.length === 0 ? (
        <p>Nessun evento trovato.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {eventi.map((e) => (
            <li key={e.id} style={{ marginBottom: '1rem', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
              <strong>{e.event_name}</strong> • <small>{new Date(e.created_at).toLocaleString()}</small><br />
              👤 {e.user_id}
              <pre style={{ background: '#222', padding: '0.5rem', marginTop: '0.5rem' }}>
                {JSON.stringify(e.metadata, null, 2)}
              </pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventViewer;
