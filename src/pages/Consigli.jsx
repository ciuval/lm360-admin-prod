import React, { useEffect, useRef, useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ShareButton from '../components/ShareButton.jsx';
import { useTelemetry } from '../lib/telemetry';

/**
 * Estrae tag "furbi" dal contenuto di un post (top keywords).
 */
function extractTags(text, max = 3) {
  if (!text) return [];
  const stop = new Set([
    'questo',
    'quella',
    'quello',
    'questa',
    'essere',
    'avere',
    'poter',
    'allora',
    'perche',
    'perché',
    'della',
    'delle',
    'alla',
    'alle',
    'agli',
    'queste',
    'questi',
    'nella',
    'nello',
    'quindi',
    'comunque',
    'sempre',
  ]);
  const words = text
    .toLowerCase()
    .replace(/[^a-zàèéìòù0-9 ]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !stop.has(w));

  const score = {};
  for (const w of words) {
    score[w] = (score[w] || 0) + 1;
  }

  return Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([k]) => k);
}

export default function Consigli() {
  useTelemetry('consigli_view', { source: 'spa' }, []);

  const LIMIT = 10;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);

  async function load(p = page) {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/posts-list?status=published&visibility=public&page=${p}&limit=${LIMIT}`
      );
      const data = await res.json();
      const list = data?.items || [];

      if (list.length > 0) {
        setItems((prev) => [...prev, ...list]);
        setPage(p + 1);
        if (list.length < LIMIT) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.warn('Consigli load error:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // infinite scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          load(page);
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [page, hasMore, loading]);

  function handleManualLoad() {
    if (!hasMore || loading) return;
    load(page);
  }

  return (
    <main className="container" style={{ paddingBottom: 32 }}>
      <h1 style={{ marginBottom: 12 }}>Consigli</h1>

      <div style={{ display: 'grid', gap: 16 }}>
        {items.map((post) => {
          const tags = extractTags(post.content, 3);
          return (
            <Card key={post.id} padding="lg">
              <Card.Header
                title={post.title}
                subtitle={new Date(post.created_at).toLocaleDateString('it-IT')}
              />
              <Card.Body>
                {tags.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: 6,
                      marginBottom: 6,
                      flexWrap: 'wrap',
                    }}
                  >
                    {tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: '2px 8px',
                          borderRadius: 999,
                          background: 'rgba(255,255,255,.06)',
                          fontSize: 12,
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                <p>{post.content}</p>
              </Card.Body>
              <Card.Footer>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 12, opacity: 0.7 }}>ID: {post.id.slice(0, 8)}…</span>
                  <ShareButton id={post.id} title={post.title} />
                </div>
              </Card.Footer>
            </Card>
          );
        })}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} style={{ padding: 24, textAlign: 'center', opacity: 0.6 }}>
          {loading ? (
            'Carico altri consigli…'
          ) : (
            <>
              <div>Scorri fino in fondo per caricare altri</div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleManualLoad}
                style={{ marginTop: 8 }}
              >
                Carica altri
              </Button>
            </>
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div style={{ padding: 24, textAlign: 'center', opacity: 0.4 }}>
          Hai visto tutti i consigli disponibili.
        </div>
      )}

      {!hasMore && items.length === 0 && (
        <div style={{ padding: 24, textAlign: 'center', opacity: 0.4 }}>
          Nessun consiglio disponibile al momento.
        </div>
      )}
    </main>
  );
}
