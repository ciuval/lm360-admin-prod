import { getJson, setJson } from '../lib/storage';
// src/pages/PublicProfilesPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

/**
 * Lista profili pubblici minimal:
 * - legge dalla vista "profili_public"
 * - filtra solo attivi e pubblici
 * - fallback avatar se foto_url è mancante o rotta
 */

export default function PublicProfilesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const { data, error } = await supabase
          .from('profili_public')
          .select('id, nome, ruolo, foto_url, status_account, profilo_pubblico')
          .eq('status_account', 'attivo')
          .eq('profilo_pubblico', true)
          .order('nome', { ascending: true });

        if (error) throw error;
        if (alive) setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn('[PublicProfiles] load error:', e?.message || e);
        if (alive) setErr('Impossibile caricare i profili.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => (r.nome || '').toLowerCase().includes(s));
  }, [rows, q]);

  return (
    <div style={page}>
      <h2 style={title}>Profili pubblici</h2>

      <div style={toolbar}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca per nome…"
          aria-label="Cerca per nome"
          style={search}
        />
        <button onClick={() => navigate('/match')} style={primary}>
          Vai ai match
        </button>
      </div>

      {loading && <p style={{ opacity: 0.8 }}>Caricamento…</p>}
      {!loading && err && <p style={{ color: '#ff8080' }}>{err}</p>}
      {!loading && !err && filtered.length === 0 && (
        <p style={{ opacity: 0.7 }}>Nessun profilo trovato.</p>
      )}

      <ul role="list" style={grid}>
        {filtered.map((p) => (
          <li key={p.id} style={card}>
            <img
              src={p.foto_url || '/avatar.svg'}
              onError={(e) => {
                if (e.currentTarget.src.endsWith('/avatar.svg')) return;
                e.currentTarget.src = '/avatar.svg';
              }}
              alt={p.nome ? `Foto profilo di ${p.nome}` : 'Foto profilo'}
              width={56}
              height={56}
              style={avatar}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={nameRow}>
                <strong
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {p.nome || '—'}
                </strong>
                <span style={roleBadge}>{p.ruolo || 'user'}</span>
              </div>
              <div style={{ opacity: 0.7, fontSize: 12 }}>
                {p.status_account === 'attivo' ? 'Attivo' : p.status_account}
              </div>
            </div>
            <Link
              to={`/profilo/${p.id}`}
              style={linkBtn}
              aria-label={`Vedi profilo di ${p.nome || 'utente'}`}
            >
              Vedi profilo
            </Link>
          </li>
        ))}
      </ul>

      <footer style={{ marginTop: 16, opacity: 0.6 }}>
        <Link to="/privacy">Privacy</Link> · <Link to="/terms">Termini</Link> ·{' '}
        <Link to="/cookies">Cookie</Link> · <Link to="/supporto">Supporto</Link>
      </footer>
    </div>
  );
}

/* -------------------- Stili -------------------- */
const page = { maxWidth: 900, margin: '0 auto', padding: '1rem' };
const title = { color: '#f08fc0', textShadow: '0 0 8px #f08fc0' };
const toolbar = { display: 'flex', gap: 8, alignItems: 'center', margin: '8px 0 12px' };
const search = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #2b2b2b',
  background: '#1c1c1c',
  color: '#fff',
};
const primary = {
  background: '#1e88e5',
  color: '#fff',
  border: 'none',
  padding: '10px 14px',
  borderRadius: 8,
  fontWeight: 700,
  cursor: 'pointer',
};
const grid = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 10,
  listStyle: 'none',
  padding: 0,
  margin: 0,
};
const card = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 12,
  border: '1px solid #2b2b2b',
  borderRadius: 10,
  background: '#181818',
};
const avatar = { borderRadius: '50%', objectFit: 'cover', background: '#2b2b2b' };
const nameRow = { display: 'flex', alignItems: 'center', gap: 8 };
const roleBadge = {
  fontSize: 12,
  border: '1px solid #444',
  borderRadius: 999,
  padding: '2px 8px',
  opacity: 0.8,
};
const linkBtn = { color: '#8ab4ff', textDecoration: 'underline', whiteSpace: 'nowrap' };
