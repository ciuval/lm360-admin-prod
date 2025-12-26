import { getJson, setJson } from '../lib/storage';
import React, { useEffect } from 'react';
import { GUIDES } from '../content/guides';
import { setTitle, setDescription } from '../lib/seo';

export default function GuideIndex() {
  useEffect(() => {
    setTitle('Guide | LoveMatch360');
    setDescription('Guide pratiche su profilo, messaggi, sicurezza, incontri offline e più.');
  }, []);
  return (
    <main id="main" tabIndex={-1} style={{ padding: '24px', maxWidth: 1120, margin: '0 auto' }}>
      <h1>Guide</h1>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))',
          gap: 12,
        }}
      >
        {GUIDES.map((p) => (
          <li key={p.slug} style={{ padding: 16, border: '1px solid #1F2937', borderRadius: 12 }}>
            <div style={{ fontSize: 14, opacity: 0.7 }}>{p.date}</div>
            <h2 style={{ margin: '6px 0', fontSize: 18 }}>{p.title}</h2>
            <p style={{ opacity: 0.85 }}>{p.description}</p>
            <a
              aria-label={`Apri ${p.title}`}
              href={`#/guide/${p.slug}`}
              style={{ display: 'inline-block', marginTop: 8 }}
            >
              Leggi
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
