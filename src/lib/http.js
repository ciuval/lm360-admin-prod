import { getJson, setJson } from './storage';
export async function getJSON(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = path + (qs ? '?' + qs : '');
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('http ' + res.status);
  return await res.json();
}
