import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Feed() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('id, content, author, created_at')
          .order('created_at', { ascending: false })
          .limit(10);
        if (!alive) return;
        if (!error && data?.length) {
          setItems(data);
          return;
        }
      } catch {}
      // fallback mock
      setItems([
        {
          id: 'm1',
          content: 'Benvenut* su LoveMatch360. Completa il profilo per i primi match!',
          author: 'system',
          created_at: new Date().toISOString(),
        },
      ]);
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (!items) return null;

  return (
    <section style={{ maxWidth: 720, margin: '24px auto', padding: '0 24px' }}>
      <h3>Novità</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
        {items.map((p) => (
          <li
            key={p.id}
            style={{
              border: '1px solid #1e252d',
              borderRadius: 12,
              padding: '12px 14px',
              background: '#12161b',
            }}
          >
            <p style={{ margin: 0 }}>{p.content}</p>
            <small style={{ opacity: 0.7 }}>{new Date(p.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
