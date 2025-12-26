import { createClient } from "@supabase/supabase-js";

const url  = process.env.SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY;

function supa() {
  if (!url || !anon) throw new Error("missing_supabase_env");
  return createClient(url, anon, { auth: { persistSession:false, autoRefreshToken:false }});
}

/** Ritorna gli ultimi post (adatta i campi/nome tabella se servono) */
export async function listPosts({ limit = 20 } = {}) {
  const s = supa();
  const { data, error } = await s
    .from("posts") // <-- se la tabella si chiama diversamente, cambiala qui
    .select("id, title, content, image_url, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}
