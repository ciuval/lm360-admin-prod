import { getJson, setJson } from '../lib/storage';
import React from 'react';
let pushToast = null;

export function Toasts() {
  const [items, setItems] = React.useState([]);
  React.useEffect(() => {
    pushToast = (t) => {
      const id = Math.random().toString(36).slice(2);
      setItems((prev) => [...prev, { id, ...t }]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== id)), t?.timeout ?? 3000);
    };
    window.toast = (title, desc, tone = 'info') => pushToast({ title, desc, tone });
    return () => {
      pushToast = null;
      window.toast = undefined;
    };
  }, []);
  const wrap = {
    position: 'fixed',
    right: 16,
    bottom: 16,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };
  const card = (tone) => ({
    minWidth: 260,
    maxWidth: 360,
    padding: '10px 12px',
    borderRadius: 12,
    background: tone === 'success' ? '#22C55E' : tone === 'danger' ? '#EF4444' : '#111827',
    color: '#fff',
    boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
  });
  return (
    <div aria-live="polite" aria-atomic="true" style={wrap}>
      {items.map((t) => (
        <div key={t.id} role="status" style={card(t.tone)}>
          <strong style={{ display: 'block' }}>{t.title}</strong>
          {t.desc && <small>{t.desc}</small>}
        </div>
      ))}
    </div>
  );
}
