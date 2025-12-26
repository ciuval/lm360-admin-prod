import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard.jsx';

const PAGE_SIZE = 6;

export default function Feed() {
  const [items, setItems]   = useState([]);
  const [page, setPage]     = useState(1);
  const [loading, setLoad]  = useState(false);
  const [done, setDone]     = useState(false);
  const [error, setError]   = useState(null);

  async function load(p = 1) {
    if (loading || done) return;
    setLoad(true);
    setError(null);
    try {
      const qs = new URLSearchParams({
        status: 'published',
        visibility: 'public',
        page: String(p),
        limit: String(PAGE_SIZE)
      });
      const res = await fetch(/api/posts-list?\);
      if (!res.ok) throw new Error(\HTTP \\);
      const data = await res.json();
      const batch = data?.items ?? [];
      setItems(prev => p === 1 ? batch : [...prev, ...batch]);
      setPage(p);
      if (batch.length < PAGE_SIZE) setDone(true);
    } catch (e) {
      setError(e.message || 'errore_sconosciuto');
    } finally {
      setLoad(false);
    }
  }

  useEffect(() => { load(1); }, []);

  const styles = {
    main: { minHeight:'100vh', background:'#0b0d10', color:'#e8edf2', padding:'24px' },
    h1:   { fontSize:24, margin:'0 0 16px' },
    list: { display:'grid', gap:16, gridTemplateColumns:'1fr', maxWidth:920, margin:'0 auto' },
    btn:  { padding:'10px 14px', background:'#2563eb', color:'#fff', border:'none', borderRadius:10, fontWeight:700, cursor:'pointer' },
    disabled:{ opacity:.5, cursor:'not-allowed' },
    alert:{ background:'#2b0f12', border:'1px solid #4b1a1f', padding:12, borderRadius:8, marginBottom:12 }
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Consigli — Feed pubblico</h1>

      {error && <div role="alert" style={styles.alert}>Errore: {error}</div>}

      <section role="list" aria-label="Elenco consigli" style={styles.list}>
        {items.map(p => <PostCard key={p.id} post={p} />)}
        {loading && <div aria-busy="true" style={{opacity:.8}}>Caricamento…</div>}
        {!loading && items.length === 0 && <div>Nessun post pubblicato.</div>}
      </section>

      <div style={{maxWidth:920, margin:'16px auto 0', display:'flex', gap:12, alignItems:'center'}}>
        {!done && (
          <button
            onClick={() => load(page + 1)}
            disabled={loading}
            aria-label="Carica altri consigli"
            style={{...styles.btn, ...(loading ? styles.disabled : {})}}
          >
            {loading ? 'Attendi…' : 'Carica altri'}
          </button>
        )}
        {done && items.length > 0 && <div style={{opacity:.7}}>Fine della lista</div>}
      </div>
    </main>
  );
}
