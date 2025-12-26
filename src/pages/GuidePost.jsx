import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useMemo } from 'react';
import { GUIDES } from '../content/guides';
import { setTitle, setDescription, injectJsonLd } from '../lib/seo';

function getSlug() {
  try {
    return (location.hash || '#/').slice(2).split('/')[1];
  } catch {
    return '';
  }
}

export default function GuidePost() {
  const slug = getSlug();
  const post = useMemo(() => GUIDES.find((g) => g.slug === slug), [slug]);

  useEffect(() => {
    if (post) {
      setTitle(`${post.title} | LoveMatch360`);
      setDescription(post.description || '');
      injectJsonLd('ld-guide', {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date,
        author: { '@type': 'Organization', name: 'LoveMatch360' },
      });
    } else {
      setTitle('Guida non trovata | LoveMatch360');
      setDescription('');
    }
  }, [post]);

  if (!post)
    return (
      <main id="main" tabIndex={-1} style={{ padding: '24px' }}>
        <h1>Guida non trovata</h1>
      </main>
    );

  return (
    <main id="main" tabIndex={-1} style={{ padding: '24px', maxWidth: 880, margin: '0 auto' }}>
      <p style={{ fontSize: 14, opacity: 0.7 }}>{post.date}</p>
      <h1>{post.title}</h1>
      <article style={{ marginTop: 12 }} dangerouslySetInnerHTML={{ __html: post.body }} />
      <p style={{ marginTop: 16 }}>
        <a href="#/guide">← Torna alle guide</a>
      </p>
    </main>
  );
}
