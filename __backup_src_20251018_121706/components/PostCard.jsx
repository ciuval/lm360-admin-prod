import React from 'react';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const dt = post.created_at ? new Date(post.created_at) : null;

  const styles = {
    card: { background:'#12161b', border:'1px solid #1e252d', borderRadius:12, padding:16 },
    title:{ fontSize:18, fontWeight:700, margin:'0 0 8px', color:'#cfe3ff', textDecoration:'none' },
    content:{ margin:'0 0 10px', lineHeight:1.5, whiteSpace:'pre-wrap' },
    meta:{ fontSize:12, opacity:.75 }
  };

  return (
    <article role="listitem" tabIndex={0} aria-labelledby={	-\} style={styles.card}>
      {post.image_url ? (
        <img
          src={post.image_url}
          alt={post.title ? Immagine: \ : 'Immagine del post'}
          loading="lazy"
          style={{width:'100%', height:'auto', borderRadius:8, marginBottom:10}}
        />
      ) : null}

      <h3 id={	-\} style={{margin:0}}>
        <Link style={styles.title} to={/post/\}>{post.title || 'Senza titolo'}</Link>
      </h3>
      <p style={styles.content}>{post.content || '—'}</p>

      <div style={styles.meta}>
        {dt ? <time dateTime={dt.toISOString()}>{dt.toLocaleDateString('it-IT')}</time> : null}
        {post.visibility ? <> • visibilità: {post.visibility}</> : null}
      </div>
    </article>
  );
}
