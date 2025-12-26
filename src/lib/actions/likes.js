// src/lib/actions/likes.js
import { createClient } from '@supabase/supabase-js';
import { track } from '../analytics';

const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: true },
});

export async function sendLike(targetId) {
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error('not-auth');
  const { data, error } = await sb
    .from('likes')
    .insert({ user_id: user.id, user_to: targetId })
    .select('id')
    .single();
  if (!error) {
    track('like_sent', { to: targetId });
  }
  return { data, error };
}
