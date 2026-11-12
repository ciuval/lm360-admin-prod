import { calculateProfileCompletion } from "./profileCompletion.js";

/**
 * Visibilità sempre opt-in. Per pubblicare verifica le informazioni salvate
 * sul server; per nascondere consente la revoca anche se il profilo è incompleto.
 * Questa verifica UI NON sostituisce RLS e i vincoli backend.
 */
export async function setProfileVisibility(client, { userId, makePublic }) {
  if (!userId) throw new Error("NOT_AUTHENTICATED");

  const nextVisibility = makePublic === true;

  if (nextVisibility) {
    const [profileResult, photoResult] = await Promise.all([
      client
        .from("profili")
        .select("nome, bio, interessi, foto_url, avatar_url, status_account")
        .eq("id", userId)
        .single(),
      client
        .from("profili_foto")
        .select("foto_url")
        .eq("profilo_id", userId)
        .limit(1),
    ]);

    if (profileResult.error || !profileResult.data || photoResult.error) {
      throw new Error("VISIBILITY_CHECK_FAILED");
    }
    const completion = calculateProfileCompletion({
      profile: profileResult.data,
      photos: (photoResult.data || []).map((row) => ({ url: row.foto_url })),
    });
    if (profileResult.data.status_account !== "attivo" || !completion.isComplete) {
      throw new Error("PROFILE_INCOMPLETE");
    }
  }

  const { data, error } = await client
    .from("profili")
    .update({ profilo_pubblico: nextVisibility })
    .eq("id", userId)
    .select("id, profilo_pubblico")
    .single();

  if (error || !data || data.id !== userId || data.profilo_pubblico !== nextVisibility) {
    throw new Error("VISIBILITY_SAVE_FAILED");
  }

  return data.profilo_pubblico;
}
