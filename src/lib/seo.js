import { getJson, setJson } from './storage';
export function setTitle(t) {
  try {
    document.title = t;
  } catch {}
}
export function setDescription(d) {
  try {
    let el = document.querySelector('meta[name="description"]');
    if (!el) {
      el = document.createElement('meta');
      el.name = 'description';
      document.head.appendChild(el);
    }
    el.setAttribute('content', d || '');
  } catch {}
}
export function injectJsonLd(id, obj) {
  try {
    const old = document.getElementById(id);
    if (old) old.remove();
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = id;
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  } catch {}
}
