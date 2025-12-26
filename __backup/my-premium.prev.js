import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok:false, error:"method_not_allowed" });
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  let token = req.headers.authorization?.replace(/^Bearer\s+/i,"") || null;

  // DEV fallback: se manca il token e siamo in locale, provo a chiedere a /api/dev-get-access-token
  if (!token && process.env.NODE_ENV !== "production") {
    try {
      const base = "http://localhost:3010";
      const r = await fetch(base + "/api/dev-get-access-token");
      const j = await r.json();
      token = j.access_token;
    } catch {}
  }

  if (!token) return res.status(401).json({ ok:false, error:"missing_token" });

  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ ok:false, error:"invalid_token" });

  const user_id = user.id;
  const nowIso = new Date().toISOString();

  // 1) provo dalla vista se esiste
  let { data: rows, error } = await supabase
    .from("v_abbonamenti_last")
    .select("*")
    .eq("utente_id", user_id)
    .order("ultima_modifica", { ascending:false })
    .limit(1);

  // 2) fallback tabella grezza
  if (error || !rows || rows.length === 0) {
    const r2 = await supabase
      .from("abbonamenti")
      .select("*")
      .eq("utente_id", user_id)
      .order("ultima_modifica", { ascending:false })
      .limit(1);
    rows = r2.data || [];
    error = r2.error;
  }

  if (error) return res.status(500).json({ ok:false, error: error.message });
  const row = rows[0] || null;
  const premium = !!(row && row.status === "active" && row.scadenza && row.scadenza > nowIso);

  return res.status(200).json({ ok:true, premium, row });
}
