import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJSON } from '../lib/http.js';
import { shareLink } from '../lib/share.js';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        const data = await getJSON(
          `/api/posts-list?status=published&visibility=public&page=1&limit=50`
        );
        const found = data.items?.find((x) => x.id === id);
        if (!stop) {
          if (found) setPost(found);
          else setErr('Post non trovato');
        }
      } catch (e) {
        if (!stop) setErr(e.message || 'Errore di caricamento');
      }
    })();
    return () => {
      stop = true;
    };
  }, [id]);

  if (err)
    return (
      <div className="container">
        <p>
          <Link to="/consigli">← Torna ai consigli</Link>
        </p>
        <div style={{ color: '#ff6b6b' }}>{err}</div>
      </div>
    );
  if (!post)
    return (
      <div className="container">
        <p>
          <Link to="/consigli">← Torna ai consigli</Link>
        </p>
        <div>Caricamento…</div>
      </div>
    );

  const url = location.href;

  return (
    <div className="container">
      <p>
        <Link to="/consigli">← Torna ai consigli</Link>
      </p>
      <h1 style={{ marginBottom: 4 }}>{post.title}</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <span className="badge">{new Date(post.created_at).toLocaleDateString('it-IT')}</span>
        <button
          onClick={() =>
            shareLink({ title: post.title, text: (post.content || '').slice(0, 120), url })
          }
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: '1px solid #2a3b5e',
            background: '#1a2236',
            color: '#e5e7eb',
            cursor: 'pointer',
          }}
        >
          Condividi
        </button>
      </div>
      <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{post.content}</p>
    </div>
  );
}
