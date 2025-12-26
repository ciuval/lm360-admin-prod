import React, { useEffect, useMemo, useState } from 'react';
import { openMatchChannel, pairKey, sendLike } from '../lib/realtime';
import { useAuth } from '../lib/authContext';

export default function LikeMock({ otherId, otherName, otherAvatar, demo = false, onMatch }) {
  const { user } = useAuth();
  const uid = user?.id;
  const key = useMemo(() => pairKey(uid, otherId), [uid, otherId]);

  const [liked, setLiked] = useState(false);
  const [remoteLiked, setRemoteLiked] = useState(false);

  useEffect(() => {
    const ch = openMatchChannel(key, (msg) => {
      if (msg?.from && msg.from !== uid) {
        setRemoteLiked(true);
        window.dispatchEvent(
          new CustomEvent('toast:show', { detail: { kind: 'ok', msg: `Piaci a ${otherName}` } })
        );
      }
    });
    return () => {
      ch?.unsubscribe();
    };
  }, [key, uid, otherName]);

  useEffect(() => {
    if (liked && remoteLiked) {
      window.dispatchEvent(
        new CustomEvent('toast:show', { detail: { kind: 'ok', msg: 'È un match! 🎉' } })
      );
      window.plausible?.('mutual_match');
      onMatch?.();
    }
  }, [liked, remoteLiked, onMatch]);

  // DEMO: se non arriva like remoto entro 6s, simula (solo quando demo=true)
  useEffect(() => {
    if (!demo || !liked) return;
    const t = setTimeout(() => setRemoteLiked(true), 6000);
    return () => clearTimeout(t);
  }, [demo, liked]);

  const clickLike = async () => {
    if (liked) return;
    setLiked(true);
    window.plausible?.('like_sent');
    await sendLike(supabase.channel(`mock-match:${key}`), uid, otherId); // fallback se riapre il canale
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
        <div>
          <strong>{otherName}</strong>
          <div style={{ opacity: 0.7, fontSize: 14 }}>Anteprima match mock</div>
        </div>
      </div>

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
          {liked ? 'Piace (inviato)' : 'Metti Like'}
        </button>
        <div aria-live="polite" style={{ alignSelf: 'center', opacity: 0.8 }}>
          {remoteLiked ? 'Ti ha messo Like' : 'In attesa del suo Like…'}
        </div>
      </div>
    </div>
  );
}
