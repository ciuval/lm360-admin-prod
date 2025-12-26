export async function fetchPublicPosts({ page = 1, limit = 10 } = {}) {
  const qs = new URLSearchParams({
    status: "published",
    visibility: "public",
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(`/api/posts-list?${qs.toString()}`, {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray(data.items) ? data.items : [];
}
