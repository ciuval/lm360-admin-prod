export function userAvatarPath(uid) {
  return `users/${uid}/avatar.jpg`;
}

/**
 * SVG -> data: URL per avatar con iniziali (inline, zero dipendenze).
 */
export function defaultAvatarUrl(initials = "LM") {
  const txt = String(initials || "LM").slice(0, 2).toUpperCase();
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="${txt}">
  <rect width="128" height="128" rx="64" fill="#1f2937"/>
  <text x="50%" y="50%" dy=".36em" text-anchor="middle"
    font-family="system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Helvetica Neue,Arial,Noto Sans,sans-serif"
    font-size="56" fill="#e5e7eb">${txt}</text>
</svg>`;
  const encoded = encodeURIComponent(svg.trim());
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Normalizza la sorgente avatar in URL finale:
 * - data:, blob:, http(s) -> la ritorna tal quale
 * - chiave storage -> la risolve sul bucket 'avatars'
 */
export function resolveAvatarUrl(src, fallbackInitials = "LM") {
  if (!src) return defaultAvatarUrl(fallbackInitials);
  const s = String(src).trim();
  if (/^(data:|blob:|https?:\/\/)/i.test(s)) return s;
  const base = import.meta.env.VITE_SUPABASE_URL;
  const key = s.replace(/^\/+/, "");
  return `${base}/storage/v1/object/public/avatars/${key}`;
}
