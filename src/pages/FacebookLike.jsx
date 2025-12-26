import { getJson, setJson } from '../lib/storage';
// src/pages/FacebookLike.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import FeatureToggle from '../components/FeatureToggle';

// --- layout minimal ---
const shell = { display: 'flex', gap: 16, padding: 16, maxWidth: 1200, margin: '0 auto' };
const colL = { width: 280, background: '#1e1e1e', borderRadius: 12, padding: 12 };
const colC = { flex: 1, minHeight: 400 };
const colR = { width: 300, display: 'none' };
const card = { background: '#1e1e1e', borderRadius: 12, padding: 12 };

const Item = ({ children }) => (
  <div
    style={{
      padding: '10px 12px',
      borderRadius: 8,
      marginBottom: 6,
      background: '#2a2a2a',
      cursor: 'pointer',
    }}
  >
    {children}
  </div>
);

// ---- prerequisito: almeno 1 post (se 'posts' non esiste, non bloccare) ----
async function prereqAtLeastOnePost(userId) {
  try {
    const { count, error } = await supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);
    if (error) throw error;
    return { ok: (count || 0) >= 1, reason: 'Serve almeno 1 ðŸ“ post' };
  } catch {
    return { ok: true };
  }
}

// ---- loader conteggio (usato anche per badge realtime) ----------------------
async function countUserPosts(userId) {
  const { count, error } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw error;
  return count || 0;
}

export default function FacebookLike({ userId }) {
  const [isPremium, setIsPremium] = useState(false);

  // UI extra quando una funzione Ã¨ attiva (sincronizzato via onChange + load iniziale)
  const [featuresEnabled, setFeaturesEnabled] = useState({
    stories: false,
    reels: false,
    live: false,
    marketplace: false,
  });

  // Premium: in dev puoi forzare con VITE_FORCE_PREMIUM=true
  useEffect(() => {
    const FORCE = String(import.meta.env.VITE_FORCE_PREMIUM || '').toLowerCase() === 'true';
    let ignore = false;
    async function load() {
      if (FORCE) {
        setIsPremium(true);
        return;
      }
      if (!userId) {
        setIsPremium(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('abbonamenti')
          .select('status')
          .eq('user_id', userId)
          .eq('status', 'attivo')
          .maybeSingle();
        if (!ignore) setIsPremium(!error && !!data);
      } catch {
        if (!ignore) setIsPremium(false);
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [userId]);

  // Carica lo stato iniziale delle 4 funzioni (da Supabase o fallback localStorage)
  useEffect(() => {
    let ignore = false;
    async function loadEnabled() {
      if (!userId) {
        setFeaturesEnabled({ stories: false, reels: false, live: false, marketplace: false });
        return;
      }
      try {
        const { data, error } = await supabase
          .from('user_features')
          .select('feature, key, enabled')
          .eq('user_id', userId);
        if (error) throw error;
        const map = { stories: false, reels: false, live: false, marketplace: false };
        (data || []).forEach((r) => {
          const k = r.feature || r.key;
          if (k && Object.prototype.hasOwnProperty.call(map, k)) {
            map[k] = !!r.enabled;
          }
        });
        if (!ignore) setFeaturesEnabled(map);
        return;
      } catch {
        // fallback locale
        const keys = ['stories', 'reels', 'live', 'marketplace'];
        const map = { ...featuresEnabled };
        keys.forEach((k) => {
          try {
            const v = getJson(`uf:${userId}:${k}`);
            map[k] = v === '1';
          } catch {}
        });
        if (!ignore) setFeaturesEnabled(map);
      }
    }
    loadEnabled();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // onChange helper per sincronizzare la UI extra
  const onChanged = (key) => (val) => setFeaturesEnabled((prev) => ({ ...prev, [key]: !!val }));

  return (
    <div style={shell}>
      <aside style={colL}>
        <div style={{ fontWeight: 700, marginBottom: 10, color: '#f08fc0' }}>ðŸ“˜ Social</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
          <span>ðŸ”Ž</span>
          <input
            placeholder="Cerca"
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #333',
              background: '#121212',
              color: '#fff',
            }}
          />
        </div>
        <Item>ðŸ  Home</Item>
        <Item>ðŸ‘¥ Amici</Item>
        <Item>ðŸ‘¥â€ðŸ‘¥ Gruppi</Item>
        <Item>ðŸª Marketplace</Item>
        <Item>ðŸ•“ Ricordi</Item>
        <Item>â­ Salvati</Item>
      </aside>

      <main style={colC}>
        <div style={card}>
          {/* Toggle: visibili solo ai Premium (gestito internamente da FeatureToggle) */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
            <FeatureToggle
              userId={userId}
              featureKey="stories"
              label="Stories"
              isPremium={isPremium}
              checkPrereq={prereqAtLeastOnePost}
              onChange={onChanged('stories')}
              loadCount={countUserPosts}
              countPollMs={30000}
              showCountWhenDisabled
              realtimeTable="posts"
              realtimeEvents={['INSERT', 'DELETE']}
              // realtimeFilter di default controlla row.user_id === userId,
              // definiscilo se vuoi filtri extra:
              // realtimeFilter={(row, ev) => row.user_id === userId && row.status === 'published'}
            />
            <FeatureToggle
              userId={userId}
              featureKey="reels"
              label="Reels"
              isPremium={isPremium}
              checkPrereq={prereqAtLeastOnePost}
              onChange={onChanged('reels')}
              loadCount={countUserPosts}
              countPollMs={30000}
              showCountWhenDisabled
              realtimeTable="posts"
              realtimeEvents={['INSERT', 'DELETE']}
            />
            <FeatureToggle
              userId={userId}
              featureKey="live"
              label="Live"
              isPremium={isPremium}
              checkPrereq={prereqAtLeastOnePost}
              onChange={onChanged('live')}
              loadCount={countUserPosts}
              countPollMs={30000}
              showCountWhenDisabled
              realtimeTable="posts"
              realtimeEvents={['INSERT', 'DELETE']}
            />
            <FeatureToggle
              userId={userId}
              featureKey="marketplace"
              label="Marketplace"
              isPremium={isPremium}
              checkPrereq={prereqAtLeastOnePost}
              onChange={onChanged('marketplace')}
              loadCount={countUserPosts}
              countPollMs={30000}
              showCountWhenDisabled
              realtimeTable="posts"
              realtimeEvents={['INSERT', 'DELETE']}
            />
          </div>

          <h3 style={{ margin: 0 }}>ðŸ“ Feed post</h3>
          <p style={{ opacity: 0.8, marginTop: 8 }}>
            Segnaposto del feed. Le funzioni sopra si sbloccheranno/mostreranno UI aggiuntive quando
            â€œattiveâ€.
          </p>

          {/* UI extra (placeholder) mostrata SOLO quando la funzione Ã¨ attiva */}
          {featuresEnabled.stories && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 8,
                background: '#212121',
                border: '1px solid #333',
              }}
            >
              <b>ðŸ“š Stories</b>
              <p style={{ opacity: 0.85, marginTop: 6 }}>
                Qui apparirÃ  il carosello delle Stories.
              </p>
            </div>
          )}

          {featuresEnabled.reels && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 8,
                background: '#212121',
                border: '1px solid #333',
              }}
            >
              <b>ðŸŽžï¸ Reels</b>
              <p style={{ opacity: 0.85, marginTop: 6 }}>
                Area Reels pronta per integrare video brevi.
              </p>
            </div>
          )}

          {featuresEnabled.live && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 8,
                background: '#212121',
                border: '1px solid #333',
              }}
            >
              <b>ðŸ”´ Live</b>
              <p style={{ opacity: 0.85, marginTop: 6 }}>
                Sezione per live streaming (placeholder).
              </p>
            </div>
          )}

          {featuresEnabled.marketplace && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 8,
                background: '#212121',
                border: '1px solid #333',
              }}
            >
              <b>ðŸ›ï¸ Marketplace</b>
              <p style={{ opacity: 0.85, marginTop: 6 }}>
                Vetrina annunci/oggetti in vendita (placeholder).
              </p>
            </div>
          )}

          {!isPremium && (
            <div
              style={{
                marginTop: 14,
                padding: 10,
                borderRadius: 8,
                background: '#2a2a2a',
                border: '1px dashed #444',
              }}
            >
              <b>ðŸ’Ž Solo per Premium</b>
              <p style={{ opacity: 0.85, marginTop: 6 }}>
                Attiva Premium per sbloccare Stories, Reels, Live e Marketplace.
              </p>
            </div>
          )}
        </div>
      </main>

      <aside style={colR}>
        <div style={card}>
          <b>Contatti</b>
          <p style={{ opacity: 0.8 }}>Coming soon</p>
        </div>
      </aside>
    </div>
  );
}
