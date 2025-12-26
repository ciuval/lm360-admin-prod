import { getJson, setJson } from './storage';
const STOP = new Set([
  'di',
  'a',
  'da',
  'in',
  'con',
  'su',
  'per',
  'tra',
  'fra',
  'il',
  'lo',
  'la',
  'i',
  'gli',
  'le',
  'un',
  'una',
  'uno',
  'e',
  'o',
  'ma',
  'che',
  'non',
  'piu',
  'più',
  'meno',
  'della',
  'delle',
  'degli',
  'del',
  'degli',
  'agli',
  'alle',
  'alla',
]);
export function suggestTags(text, max = 6) {
  if (!text) return [];
  const ws =
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .match(/[a-zàèéìòóù]+/gi) || [];
  const freq = new Map();
  for (const w of ws) {
    const ww = w.trim();
    if (!ww || STOP.has(ww) || ww.length < 3) continue;
    freq.set(ww, (freq.get(ww) || 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([w]) => w);
}
