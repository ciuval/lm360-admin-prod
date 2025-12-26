const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();
(async () => {
  const url = (process.env.VITE_SUPABASE_URL||"").trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY||"").trim();
  const supabase = createClient(url, key, { auth:{ persistSession:false }});
  const { data, error } = await supabase.from("subscribers").select("id").limit(1);
  if (error) { console.error("❌ Supabase error:", error.message); process.exit(1); }
  console.log("✅ Supabase OK. Rows sample:", data?.length ?? 0);
})();
