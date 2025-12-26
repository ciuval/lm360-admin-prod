import React, { useState } from 'react';
import { sendLikeDb } from '../lib/match';
import { defaultAvatarUrl } from '../lib/avatar';

export default function LikeReal({
  otherId,
  otherName,
  otherAvatar = defaultAvatarUrl(),
  onMatch,
}) {
  const [liked, setLiked] = useState(false);
  const [mutual, setMutual] = useState(false);
  const [err, setErr] = useState('');

  const clickLike = async () => {
    if (liked) return;
    setErr('');
    setLiked(true);
    try {
      const r = await sendLikeDb(otherId);
      if (r.mutual) {
        setMutual(true);
        window.dispatchEvent(
          new CustomEvent('toast:show', { detail: { kind: 'ok', msg: 'È un match! 🎉' } })
        );
        onMatch?.();
      } else {
        window.dispatchEvent(
          new CustomEvent('toast:show', {
            detail: { kind: 'ok', msg: `Piaci a ${otherName} (in attesa)` },
          })
        );
      }
    } catch {
      setErr('Impossibile inviare il like. Riprova.');
      setLiked(false);
    }
  };

  return (
    <div
      role="group"
      aria-label={`Profilo ${otherName}`}
      style={{
        border: '1px solid #1e252d',
        borderRadius: 12,
        padding: 16,
        display: 'grid',
        gap: 12,
        background: '#12161b',
      }}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <img
          alt={`Avatar di ${otherName}`}
          src={otherAvatar}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1px solid #2b323b',
          }}
        />
        <strong>{otherName}</strong>
      </div>
      {err && (
        <div role="alert" style={{ color: '#ff6b6b' }}>
          {err}
        </div>
      )}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={clickLike}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #2b323b',
            cursor: 'pointer',
            background: liked ? '#3A7AFE' : '#1b2129',
            color: '#e8edf2',
          }}
        >
          {liked ? (mutual ? 'Match!' : 'Like inviato') : 'Metti Like'}
        </button>
      </div>
    </div>
  );
}
