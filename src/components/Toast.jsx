import React, { useEffect, useState } from 'react';

export default function Toast() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const h = (e) => {
      const it = { id: Date.now() + Math.random(), ...e.detail };
      setItems((prev) => [...prev, it]);
      setTimeout(() => setItems((prev) => prev.filter((x) => x.id !== it.id)), 2000);
    };
    window.addEventListener('toast:show', h);
    return () => window.removeEventListener('toast:show', h);
  }, []);
  const wrap = { position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 8, zIndex: 1000 };
  const box = (k) => ({
    padding: '10px 12px',
    borderRadius: 12,
    fontWeight: 600,
    background: k === 'err' ? '#3b0d0d' : '#0f2a19',
    color: k === 'err' ? '#ffb4b4' : '#b6f3c4',
    border: '1px solid #223',
  });
  return (
    <div style={wrap} aria-live="polite" aria-atomic="true">
      {items.map((it) => (
        <div key={it.id} role="status" style={box(it.kind)}>
          {it.msg}
        </div>
      ))}
    </div>
  );
}
