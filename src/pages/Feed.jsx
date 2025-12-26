import React, { useEffect, useRef, useState } from 'react';
import { getJson, setJson } from '../lib/storage';
import PostCard from '../components/PostCard.jsx';

const PAGE_SIZE = 6;
const CACHE_KEY = 'feed-public-v1';
const CACHE_TTL_MS = 90 * 1000; // 90s

export default function Feed() {
  // boot da cache per UX istantanea
  const cache = getJson(CACHE_KEY) || { items: [], page: 0, done: false, t: 0 };

  const [items, setItems] = useState(cache.items || []);
  const [page, setPage] = useState(cache.page || 0);
  const [loading, setLoad] = useState(false);
  const [done, setDone] = useState(!!cache.done);
  const [error, setError] = useState(null);

  const ctrlRef = useRef(null);

  async function load(p = 1) {
    if (loading || done) return;

    // aborta eventuale richiesta precedente
    try {
      ctrlRef.current?.abort();
    } catch {}
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    setLoad(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        status: 'published',
        visibility: 'public',
        page: String(p),
        limit: String(PAGE_SIZE),
      }).toString();

      const res = await fetch(`/api/posts-list?${qs}`, {
        signal: ctrl.signal,
        headers: { accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`http_${res.status}`);

      const data = await res.json();
      const batch = Array.isArray(data?.items) ? data.items : [];

      setItems((prev) => (p === 1 ? batch : [...prev, ...batch]));
      setPage(p);
      if (batch.length < PAGE_SIZE) setDone(true);

      // aggiorna cache (no PII)
      setJson(CACHE_KEY, {
        items: p === 1 ? batch : [...items, ...batch],
        page: p,
        done: batch.length < PAGE_SIZE,
        t: Date.now(),
      });
    } catch (e) {
      if (e?.name === 'AbortError') return;
      setError(e?.message || 'errore_sconosciuto');
    } finally {
      setLoad(false);
    }
  }

  // primo paint: se cache fresca, evita fetch immediata
  useEffect(() => {
    const fresh = Date.now() - (cache.t || 0) < CACHE_TTL_MS && cache.items?.length;
    if (fresh) {
      // Se la cache è “fresca” ma non completa, abilita il prossimo “Carica altri”
      if (!cache.done && cache.page >= 1) setPage(cache.page);
      return;
    }
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles = {
    main: { minHeight: '100vh', background: '#0b0d10', color: '#e8edf2', padding: '24px' },
    h1: { fontSize: 24, margin: '0 0 16px' },
    list: { display: 'grid', gap: 16, gridTemplateColumns: '1fr', maxWidth: 920, margin: '0 auto' },
    btn: {
      padding: '10px 14px',
      background: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: 10,
      fontWeight: 700,
      cursor: 'pointer',
    },
    disabled: { opacity: 0.5, cursor: 'not-allowed' },
    alert: {
      background: '#2b0f12',
      border: '1px solid #4b1a1f',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Consigli — Feed pubblico</h1>

      {error && (
        <div role="alert" style={styles.alert}>
          Errore: {error}
        </div>
      )}

      <section role="list" aria-label="Elenco consigli" style={styles.list}>
        {items.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
        {loading && (
          <div aria-busy="true" style={{ opacity: 0.8 }}>
            Caricamento…
          </div>
        )}
        {!loading && items.length === 0 && <div>Nessun post pubblicato.</div>}
      </section>

      <div
        style={{
          maxWidth: 920,
          margin: '16px auto 0',
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        {!done && (
          <button
            onClick={() => load(Math.max(page, 1) + 1)}
            disabled={loading}
            aria-label="Carica altri consigli"
            style={{ ...styles.btn, ...(loading ? styles.disabled : {}) }}
          >
            {loading ? 'Attendi…' : 'Carica altri'}
          </button>
        )}
        {done && items.length > 0 && <div style={{ opacity: 0.7 }}>Fine della lista</div>}
      </div>
    </main>
  );
}
