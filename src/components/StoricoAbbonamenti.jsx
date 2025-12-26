import { getJson, setJson } from '../lib/storage';
// src/components/StoricoAbbonamenti.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function StoricoAbbonamenti() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const { data: ses } = await supabase.auth.getSession();
        const uid = ses?.session?.user?.id;
        if (!uid) {
          setRows([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('abbonamenti_api')
          .select('*')
          .eq('utente_id', uid)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setRows(data ?? []);
      } catch (e) {
        setErr(e?.message || 'Errore caricamento storico');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ opacity: 0.7 }}>Caricamento storicoâ€¦</p>;
  if (err) return <p style={{ color: '#f88' }}>Impossibile caricare lo storico: {err}</p>;
  if (!rows.length) return <p style={{ opacity: 0.7 }}>Nessun abbonamento trovato.</p>;

  return (
    <div>
      <h3 style={{ margin: '0.75rem 0' }}>ðŸ“œ Storico abbonamenti</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {rows.map((r) => (
          <li
            key={`${r.stripe_subscription_id}-${r.created_at}`}
            style={{
              background: '#1e1e1e',
              border: '1px solid #333',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 8,
            }}
          >
            <div>
              <strong>Stato:</strong> {r.status}
            </div>
            <div>
              <strong>Creato:</strong> {new Date(r.created_at).toLocaleString()}
            </div>
            {r.scadenza && (
              <div>
                <strong>Scade il:</strong> {new Date(r.scadenza).toLocaleString()}
              </div>
            )}
            <div>
              <small>ID subscr.: {r.stripe_subscription_id}</small>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
