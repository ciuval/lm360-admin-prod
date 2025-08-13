import { supabase } from "../lib/supabaseClient";

export async function attivaAbbonamento(userId, tipo = "mensile") {
  if (!userId) return { error: "Nessun utente loggato" };

  const { error } = await supabase.from("abbonamenti").insert({
    user_id: userId,
    tipo: tipo,
    status: "attivo",
    inizio: new Date(),
  });

  if (error) {
    console.error("Errore abbonamento:", error.message);
    return { error: error.message };
  }

  return { success: true };
}
