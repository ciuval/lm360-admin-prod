// src/api/posts.js
export async function fetchPublicPosts({ page = 1, limit = 10 } = {}) {
  const qs = new URLSearchParams({
    status: "published",
    visibility: "public",
    page: String(page),
    limit: String(limit),
  }).toString();

  const url = `/api/posts-list?${qs}`;

  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`http_${res.status}`);
  // atteso: { ok, items, meta }
  return res.json();
}
