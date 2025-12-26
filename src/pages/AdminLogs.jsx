import React, { useEffect, useMemo, useState } from 'react';
import Sparkline from '../components/charts/Sparkline.jsx';

const EVENTS = [
  { value: 'all', label: 'Tutti' },
  { value: 'paywall_view', label: 'paywall_view' },
  { value: 'chat_view', label: 'chat_view' },
  { value: 'message_received', label: 'message_received' },
];

async function getJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('http ' + r.status);
  return r.json();
}

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [event, setEvent] = useState('all');
  const [sum24, setSum24] = useState(0);
  const [sum7d, setSum7d] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const q = event !== 'all' ? `?event=${encodeURIComponent(event)}` : '';
      const daily = await getJson('/api/logs-daily' + q.replace('?', '&'));
      setLogs(daily?.data || []);

      const c24 = await getJson('/api/logs-count?window=24h' + (q ? '&' + q.slice(1) : ''));
      const c7d = await getJson('/api/logs-count?window=7d' + (q ? '&' + q.slice(1) : ''));
      setSum24(c24?.count ?? 0);
      setSum7d(c7d?.count ?? 0);
      setErr(null);
    } catch (e) {
      console.error(e);
      setErr(e.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [event]);
  useEffect(() => {
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [event]);

  const counts = useMemo(() => logs.map((x) => x.count || 0), [logs]);
  const total = useMemo(() => counts.reduce((a, b) => a + b, 0), [counts]);
  const avg = useMemo(
    () => (counts.length ? Math.round(total / counts.length) : 0),
    [counts, total]
  );

  return (
    <main className="container" style={{ padding: 24 }}>
      <h1>📊 Logs giornalieri</h1>

      <div style={{ margin: '12px 0', display: 'flex', gap: 8 }}>
        <label htmlFor="ev" className="ui-label" style={{ alignSelf: 'center' }}>
          Evento
        </label>
        <select id="ev" className="btn" value={event} onChange={(e) => setEvent(e.target.value)}>
          {EVENTS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button className="btn" onClick={load}>
          ↻ Aggiorna
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 12,
          margin: '12px 0',
        }}
      >
        <div className="card" style={{ padding: 16 }}>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Ultime 24 ore</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{sum24}</div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ opacity: 0.7, fontSize: 12 }}>Ultimi 7 giorni</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{sum7d}</div>
        </div>
      </div>

      {loading && <p>Caricamento…</p>}
      {err && (
        <p role="alert" style={{ color: 'var(--danger)' }}>
          Errore: {err}
        </p>
      )}

      {!loading && !err && (
        <>
          <div className="card" style={{ padding: 16 }}>
            <strong>Eventi / giorno (ultimi 14 giorni)</strong>
            <div style={{ marginTop: 10 }}>
              <Sparkline points={counts} width={420} height={80} strokeWidth={2} />
            </div>
            <div style={{ display: 'flex', gap: 12, opacity: 0.8, fontSize: 13, marginTop: 6 }}>
              <span>Totale: {total}</span>
              <span>Media: {avg}</span>
            </div>
          </div>

          <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th align="left">Giorno</th>
                <th align="right">Conteggio</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((row) => (
                <tr key={row.day}>
                  <td>{row.day}</td>
                  <td align="right">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}
