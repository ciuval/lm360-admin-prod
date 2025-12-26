import { getJson, setJson } from './storage';
let cachedToken = null;

export async function ensureDevToken() {
  if (cachedToken) return cachedToken;
  const inStorage = getJson('lm360.dev.token');
  if (inStorage) {
    cachedToken = inStorage;
    return cachedToken;
  }
  const r = await fetch('/api/dev-get-access-token');
  const j = await r.json();
  cachedToken = 'Bearer ' + j.access_token;
  setJson('lm360.dev.token', cachedToken);
  return cachedToken;
}

export async function apiFetch(path, opts = {}) {
  const token = await ensureDevToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    Authorization: token,
  };
  const res = await fetch(path, { ...opts, headers });
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
