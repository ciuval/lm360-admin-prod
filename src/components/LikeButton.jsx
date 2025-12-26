import React, { useState } from 'react';
import { sendLike } from '../lib/actions/likes';
import { track } from '../lib/analytics';

export default function LikeButton({ targetId, onDone }) {
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);

  const fireToast = (msg, type = 'info') => {
    try {
      window.dispatchEvent(new CustomEvent('toast', { detail: { msg, type } }));
    } catch {}
  };

  const onClick = async () => {
    if (busy || ok) return;
    setBusy(true);
    try {
      const { error } = await sendLike(targetId);
      if (error) throw error;
      setOk(true);
      track('like_sent', { to: targetId }); // no PII nei log console
      fireToast('Like inviato');
      onDone?.();
    } catch {
      fireToast('Impossibile inviare il like', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      aria-label="Metti like"
      onClick={onClick}
      disabled={busy || ok}
      style={{
        padding: '8px 12px',
        borderRadius: 10,
        background: ok ? '#16a34a' : '#7C3AED',
        color: '#fff',
        border: 'none',
        cursor: busy ? 'wait' : 'pointer',
      }}
    >
      {ok ? 'Piaci a vicenda' : busy ? 'Invio…' : 'Metti like'}
    </button>
  );
}
