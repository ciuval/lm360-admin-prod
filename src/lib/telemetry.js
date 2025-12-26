const QUEUE_KEY = 'lm360_log_queue';
const CID_KEY = 'lm360_cid';

export function getClientId() {
  try {
    let cid = localStorage.getItem(CID_KEY);
    if (!cid) {
      cid = crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(16).slice(2) + Date.now().toString(16);
      localStorage.setItem(CID_KEY, cid);
    }
    return cid;
  } catch {
    return 'cid-' + Math.random().toString(16).slice(2);
  }
}

function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveQueue(q) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
  } catch {}
}

async function sendOne(evt) {
  const r = await fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(evt),
  });
  if (!r.ok) throw new Error('http ' + r.status);
}

async function flushQueue() {
  const q = loadQueue();
  if (!q.length) return;
  const next = [];
  for (const e of q) {
    try {
      await sendOne(e);
    } catch {
      next.push(e);
    }
  }
  saveQueue(next);
}

['visibilitychange', 'focus', 'online'].forEach((ev) => {
  try {
    window.addEventListener(ev, () => {
      if (navigator.onLine) flushQueue();
    });
  } catch {}
});

export async function logEvent(
  name,
  props = {},
  path = window.location?.pathname || '/',
  client_id = getClientId()
) {
  const evt = { name, props, path, client_id };
  try {
    await sendOne(evt);
  } catch {
    const q = loadQueue();
    q.push(evt);
    saveQueue(q);
  }
}

import { useEffect } from 'react';
export function useTelemetry(name, props = {}, deps = []) {
  useEffect(() => {
    logEvent(name, props).catch(() => {});
  }, deps);
}
