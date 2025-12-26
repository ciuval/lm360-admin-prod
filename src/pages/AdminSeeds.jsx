import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useState } from 'react';

function useAdminToken() {
  const [tok, setTok] = useState(getJson('lm360_seed_token') || '');
  const save = (t) => {
    setJson('lm360_seed_token', t);
    setTok(t);
  };
  return [tok, save];
}

export default function AdminSeeds() {
  const [token, saveToken] = useAdminToken();
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    status: 'draft',
    visibility: 'public',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const headers = token ? { 'X-Admin-Token': token } : {};

  async function load() {
    if (!token) return;
    setLoading(true);
    const r = await fetch('/api/seed-admin', { headers });
    const j = await r.json();
    setItems(j.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [token]);

  function askToken() {
    const t = prompt('Inserisci token admin (verrÃ  ricordato localmente)');
    if (t) saveToken(t);
  }

  async function create() {
    setLoading(true);
    const r = await fetch('/api/seed-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(form),
    });
    setMsg(r.ok ? 'Creato!' : 'Errore creazione');
    setForm({ title: '', content: '', status: 'draft', visibility: 'public' });
    await load();
    setLoading(false);
  }

  async function update(id, patch) {
    setLoading(true);
    const r = await fetch('/api/seed-admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ id, ...patch }),
    });
    setMsg(r.ok ? 'Aggiornato!' : 'Errore update');
    await load();
    setLoading(false);
  }

  async function remove(id) {
    if (!confirm('Eliminare il seed?')) return;
    setLoading(true);
    const r = await fetch('/api/seed-admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify({ id }),
    });
    setMsg(r.ok ? 'Eliminato!' : 'Errore delete');
    await load();
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 920, margin: '40px auto', padding: '0 16px' }}>
      <h1>Admin Seeds</h1>
      {!token && <button onClick={askToken}>Inserisci token</button>}
      {token && (
        <button
          onClick={() => {
            saveToken('');
          }}
        >
          Logout token
        </button>
      )}
      <p style={{ opacity: 0.7 }}>{loading ? 'Caricamentoâ€¦' : msg}</p>

      <section
        style={{ margin: '24px 0', padding: 16, border: '1px solid #333', borderRadius: 12 }}
      >
        <h2>Nuovo seed</h2>
        <input
          placeholder="Titolo"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ width: '100%', margin: '8px 0' }}
        />
        <textarea
          placeholder="Contenuto"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={{ width: '100%', height: 120 }}
        />
        <div style={{ display: 'flex', gap: 12, margin: '8px 0' }}>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <select
            value={form.visibility}
            onChange={(e) => setForm({ ...form, visibility: e.target.value })}
          >
            <option value="public">public</option>
            <option value="private">private</option>
          </select>
        </div>
        <button onClick={create}>Crea</button>
      </section>

      <section>
        <h2>Elenco</h2>
        {items.map((it) => (
          <article
            key={it.id}
            style={{ border: '1px solid #333', borderRadius: 12, padding: 16, margin: '12px 0' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{it.title}</strong>
              <span style={{ opacity: 0.7 }}>{new Date(it.created_at).toLocaleString()}</span>
            </div>
            <p style={{ whiteSpace: 'pre-wrap' }}>{it.content}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() =>
                  update(it.id, { status: it.status === 'published' ? 'draft' : 'published' })
                }
              >
                {it.status === 'published' ? 'Metti in draft' : 'Pubblica'}
              </button>
              <button
                onClick={() =>
                  update(it.id, { visibility: it.visibility === 'public' ? 'private' : 'public' })
                }
              >
                {it.visibility === 'public' ? 'Rendi private' : 'Rendi public'}
              </button>
              <button onClick={() => remove(it.id)} style={{ color: '#e33' }}>
                Elimina
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
