// src/agent/devguard.js
import dayjs from 'dayjs';

const state = {
  endpoint: '/api/error-report',
  release: import.meta.env.VITE_APP_VERSION || 'dev',
  env: import.meta.env.MODE || 'dev',
  buf: [],
  open: false,
  sessionId: Math.random().toString(36).slice(2),
};

function safeFetch(url, opts) {
  try {
    if (navigator.sendBeacon && (opts?.method || 'POST') === 'POST') {
      const blob = new Blob([opts.body], { type: 'application/json' });
      if (navigator.sendBeacon(url, blob)) return Promise.resolve({ ok: true, beacon: true });
    }
  } catch {}
  return fetch(url, opts);
}

function send(item) {
  const body = JSON.stringify(item);
  return safeFetch(state.endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  }).catch(() => {});
}

function report(evt) {
  const item = {
    level: evt.level || 'error',
    message: String(evt.message || evt.reason || 'unknown'),
    stack: evt.stack || (evt.error && evt.error.stack) || (evt.reason && evt.reason.stack) || null,
    url: location.href,
    route: location.hash || location.pathname,
    user_agent: navigator.userAgent,
    session_id: state.sessionId,
    meta: evt.meta || {},
    release: state.release,
    env: state.env,
  };
  state.buf.push(item);
  if (state.buf.length > 20) state.buf.shift();
  send(item);
  if (state.open) window.dispatchEvent(new CustomEvent('devguard:update'));
}

/** Patch global listeners */
export function initDevGuard(opts = {}) {
  Object.assign(state, opts);

  // window error
  window.addEventListener('error', (e) => {
    report({
      message: e.message,
      error: e.error,
      stack: e?.error?.stack,
      meta: { type: 'window.error' },
    });
  });

  // unhandled rejection
  window.addEventListener('unhandledrejection', (e) => {
    report({
      message: String(e.reason),
      reason: e.reason,
      stack: e?.reason?.stack,
      meta: { type: 'promise' },
    });
  });

  // console error/warn
  ['error', 'warn'].forEach((lvl) => {
    const orig = console[lvl];
    console[lvl] = (...args) => {
      try {
        report({
          level: lvl,
          message: args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' '),
          meta: { type: 'console' },
        });
      } catch {}
      orig?.apply(console, args);
    };
  });

  // fetch 4xx/5xx
  const origFetch = window.fetch;
  window.fetch = async (input, init) => {
    const t0 = performance.now();
    try {
      const res = await origFetch(input, init);
      const ms = Math.round(performance.now() - t0);
      if (!res.ok) {
        report({
          level: res.status >= 500 ? 'error' : 'warn',
          message: `fetch ${res.status} ${res.statusText} ${typeof input === 'string' ? input : input.url || ''}`,
          meta: { ms },
        });
      }
      return res;
    } catch (err) {
      report({ message: `fetch failed ${String(err)}`, meta: { url: String(input) } });
      throw err;
    }
  };

  // toggle via hotkey
  window.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key.toLowerCase() === 'd') {
      state.open = !state.open;
      window.dispatchEvent(new CustomEvent('devguard:toggle', { detail: state.open }));
    }
  });

  // auto-open se ?debug=1 o localStorage
  const qs = new URLSearchParams(location.search);
  if (qs.get('debug') === '1' || localStorage.getItem('lm360:debug') === '1') {
    state.open = true;
    setTimeout(() => window.dispatchEvent(new CustomEvent('devguard:toggle', { detail: true })), 0);
  }
}

/** Esporta l’ultimo buffer (per il pannello) */
export function getBuffer() {
  return state.buf.slice().reverse();
}
export function isOpen() {
  return state.open;
}
export function getState() {
  return state;
}
