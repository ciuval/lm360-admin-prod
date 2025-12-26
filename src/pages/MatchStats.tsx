// src/pages/MatchStats.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const MatchStats = ({ currentUser }: { currentUser: any }) => {
  const [perDay, setPerDay] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.rpc('matchs_per_day');
      if (data) setPerDay(data.reverse());
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    // Controlla se l'utente è admin (es. da tabella ruoli o ID autorizzati)
    const adminList = ['admin-id-1', 'admin-id-2']; // Inserisci gli ID admin veri
    setIsAdmin(adminList.includes(currentUser?.id));
  }, [currentUser]);

  const handleExportCSV = () => {
    const csvRows = [['Data', 'Numero Match']];
    perDay.forEach(row => {
      csvRows.push([row.day, row.count]);
    });

    const csvContent = csvRows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'match_stats.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
  const headers = ['user1_id', 'user2_id', 'created_at'];
  const rows = matchLogs.map(log => [log.user1_id, log.user2_id, new Date(log.created_at).toLocaleString()]);
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'match_log_dettagliato.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div style={{ padding: '2rem', background: '#121212', color: '#fff', fontFamily: 'system-ui' }}>
      <h2 style={{ color: '#bb86fc' }}>📈 Match 100 negli ultimi 7 giorni</h2>

      {isAdmin && (
        <button
          onClick={handleExportCSV}
          style={{
            background: '#00e676',
            color: '#000',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📥 Esporta CSV
        </button>
      )}

      {loading ? (
        <p>Caricamento...</p>
      ) : perDay.length === 0 ? (
        <p>Nessun dato disponibile.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={perDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#bb86fc' }} />
            <Line type="monotone" dataKey="count" stroke="#bb86fc" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MatchStats;

