export async function likeUser(supabase, toUserId) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('not-authenticated');
  const r = await fetch('/api/like-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Bearer,
    },
    body: JSON.stringify({ to_user: toUserId }),
  });
  const j = await r.json();
  if (!r.ok || !j?.ok) throw new Error(j?.error || j?.body || 'like failed');
  return j.data; // { mutual: boolean, score: int|null }
}
