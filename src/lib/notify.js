import { useEffect, useState } from 'react';

const LS_KEY = (ev) => `lm360_seen_${ev}`;

export function getLastSeen(event) {
  try {
    return localStorage.getItem(LS_KEY(event)) || '1970-01-01T00:00:00.000Z';
  } catch {
    return '1970-01-01T00:00:00.000Z';
  }
}
export function markSeen(event) {
  try {
    localStorage.setItem(LS_KEY(event), new Date().toISOString());
  } catch {}
}

/**
 * useUnreadCount({ event, intervalMs })
 * Conta gli eventi (ab_events.event) dopo l'ultimo "seen".
 */
export function useUnreadCount({ event = 'message_received', intervalMs = 30000 } = {}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function tick() {
      const since = encodeURIComponent(getLastSeen(event));
      try {
        const r = await fetch(`/api/logs-count?event=${encodeURIComponent(event)}&since=${since}`);
        const j = await r.json();
        if (!cancelled) setCount(Number(j?.count || 0));
      } catch {
        /* ignore */
      }
    }

    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [event, intervalMs]);

  const markRead = () => {
    markSeen(event);
    setCount(0);
  };

  return { count, markRead };
}
