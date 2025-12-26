/**
 * Helper storage JSON safe:
 * - getJson(key, fallback)
 * - setJson(key, value)
 * Non lancia eccezioni se localStorage non è disponibile o se il JSON è rotto.
 */

export function getJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignora errori (quota, privacy, ecc.)
  }
}
