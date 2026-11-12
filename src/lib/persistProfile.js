/**
 * Aggiorna soltanto i campi del profilo modificabili dall'utente.
 * Nessun tentativo di aggiornare id, email, ruoli, premium o billing.
 */
export const PROFILE_PUBLIC_SELECT =
  "id, nome, email, bio, interessi, foto_url, avatar_url, profilo_pubblico, ruolo, premium, premium_start, premium_fine, tipo_abbonamento, status_account";

export async function persistProfile(client, {
  userId,
  profileExists,
  email,
  name,
  bio,
  interests,
  photoUrl,
}) {
  if (!userId) throw new Error("Utente non autenticato.");

  const editable = {
    nome: String(name ?? "").trim(),
    bio: String(bio ?? "").trim(),
    interessi: String(interests ?? "").trim(),
    foto_url: photoUrl ?? null,
    updated_at: new Date().toISOString(),
  };

  // Upsert include la PK nell'UPDATE e richiede privilegi non concessi.
  // UPDATE e INSERT separati rispettano i privilegi colonna esistenti.
  const query = profileExists
    ? client.from("profili").update(editable).eq("id", userId)
    : client.from("profili").insert({
        id: userId,
        email: email || null,
        ...editable,
      });

  // .single() restituisce un errore se RLS impedisce la scrittura:
  // non dichiarare riuscito un salvataggio che non ha aggiornato righe.
  const { data, error } = await query.select(PROFILE_PUBLIC_SELECT).single();
  if (error) throw error;
  if (!data) throw new Error("Salvataggio profilo non confermato.");
  return data;
}


/** Mantiene la foto principale visibile anche fuori dalla galleria. */
export async function syncPrimaryProfilePhoto(client, { userId, photoUrl }) {
  if (!userId) throw new Error("Utente non autenticato.");

  const { data, error } = await client
    .from("profili")
    .update({ foto_url: photoUrl || null, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("id, foto_url")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Foto principale non sincronizzata.");
  return data;
}
