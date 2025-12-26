import { getJson, setJson } from "./storage";

const DEFAULT_TTL_MS = 5 * 60 * 1000;

export function cacheGet(key, ttlMs = DEFAULT_TTL_MS) {
  try {
    const cached = getJson(key) || null; // <-- niente stringa "null", niente parentesi in più
    if (!cached) return null;
    const age = Date.now() - (cached.ts || 0);
    if (age > ttlMs) return null;
    return cached.data ?? null;
  } catch {
    return null;
  }
}

export function cacheSet(key, data) {
  try {
    setJson(key, { ts: Date.now(), data });
  } catch {}
}

// Esempio di helper: ottieni stato premium con cache
export async function getPremiumStatus(fetcher, { key = "premium-status", ttlMs = DEFAULT_TTL_MS } = {}) {
  const cached = cacheGet(key, ttlMs);
  if (cached !== null) return cached;
  const data = await fetcher();
  cacheSet(key, data);
  return data;
}

