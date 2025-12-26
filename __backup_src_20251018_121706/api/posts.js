export async function fetchPublicPosts({ page = 1, limit = 10 } = {}) {
  const url = /api/posts-list?status=published&visibility=public&page=&limit=;
  const res = await fetch(url, { headers: { 'accept': 'application/json' } });
  if (!res.ok) throw new Error(HTTP );
  return res.json(); // { ok, items, meta }
}
