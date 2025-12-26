import { getJson, setJson } from '../lib/storage';
// âœ… File: src/pages/LogViewerAdmin.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LogViewerAdmin() {
  const [logs, setLogs] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      const { data: user, error: authError } = await supabase.auth.getUser();
      if (!user || authError) return;

      const { data: profilo } = await supabase
        .from('profili')
        .select('ruolo')
        .eq('id', user.user.id)
        .single();

      if (profilo?.ruolo !== 'admin') {
        setLogs([{ tipo_azione: 'ACCESSO NEGATO', descrizione: 'Non sei admin.' }]);
        return;
      }

      let query = supabase
        .from('log_attivitÃ ')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (tipoFiltro) {
        query = query.eq('tipo_azione', tipoFiltro);
      }

      const { data, error } = await query;
      if (!error) setLogs(data);
    };

    fetchLogs();
  }, [tipoFiltro]);

  const esportaCSV = () => {
    const righe = logs.map((log) => {
      return `"${log.created_at}","${log.tipo_azione}","${log.user_id}","${log.pagina}","${log.descrizione}"`;
    });
    const header = 'Data,Tipo,Utente,Pagina,Descrizione';
    const csvContent = [header, ...righe].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'log_attivitÃ .csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tipiDisponibili = [...new Set(logs.map((log) => log.tipo_azione))];

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'monospace',
        backgroundColor: '#121212',
        color: '#f0f0f0',
      }}
    >
      <h2 style={{ color: '#f08fc0' }}>ðŸ“œ Log attivitÃ  (Admin)</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>ðŸ” Filtro tipo_azione: </label>
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          style={{
            padding: '0.5rem',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '6px',
          }}
        >
          <option value="">(Tutti)</option>
          {tipiDisponibili.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <button
          onClick={esportaCSV}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            backgroundColor: '#f08fc0',
            color: 'black',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          â¬‡ï¸ Esporta CSV
        </button>
      </div>

      <pre
        style={{
          background: '#1e1e1e',
          padding: '1rem',
          borderRadius: '8px',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        {logs.map((log) => (
          <div key={log.id}>
            <span>ðŸ•“ {new Date(log.created_at).toLocaleString()}</span> |{' '}
            <strong>{log.tipo_azione}</strong> | ðŸ‘¤ {log.user_id} | ðŸ“„ {log.pagina}
            <br />
            â†’ {log.descrizione}
            <hr style={{ borderColor: '#333' }} />
          </div>
        ))}
      </pre>
    </div>
  );
}
