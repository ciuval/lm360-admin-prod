import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkExpiredPremiums() {
  console.log("🔍 Controllo utenti con abbonamenti scaduti...");

  const { data: utenti } = await supabase
    .from("abbonamenti")
    .select("user_id, fine")
    .eq("status", "attivo")
    .lt("fine", new Date().toISOString());

  for (const abbo of utenti || []) {
    await supabase
      .from("profili")
      .update({ ruolo: "user" })
      .eq("id", abbo.user_id);

    await supabase
      .from("abbonamenti")
      .update({ status: "scaduto" })
      .eq("user_id", abbo.user_id);

    console.log(`⚠️ Utente ${abbo.user_id} declassato (abbonamento scaduto)`);
  }

  console.log("✅ Controllo completato.");
}

checkExpiredPremiums();
