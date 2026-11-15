import { normalizePublicProfileProjection } from "./publicProfiles.js";

/**
 * Restituisce soltanto controparti con match reciproco 100
 * e proiezione pubblica autorizzata dalla RPC server-side.
 *
 * Non legge mai direttamente le righe 'profili' di un altro utente:
 * la RLS di profili rimane limitata al proprietario.
 */
export async function loadVisibleMatchedProfiles(client, userId) {
  if (!userId) {
    return { profiles: [], hasReciprocalMatch: false };
  }

  const { data: matches, error: matchError } = await client
    .from("match_scores")
    .select("user_a, user_b, score")
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .eq("score", 100);

  if (matchError) throw new Error("MATCH_READ_FAILED");

  const counterpartIds = [...new Set((matches || [])
    .filter((row) =>
      row?.score === 100 &&
      ((row.user_a === userId && row.user_b !== userId) ||
       (row.user_b === userId && row.user_a !== userId)))
    .map((row) => (row.user_a === userId ? row.user_b : row.user_a))
    .filter(Boolean))];

  if (counterpartIds.length === 0) {
    return { profiles: [], hasReciprocalMatch: false };
  }

  // Ogni chiamata richiede un singolo UUID: non dipende dal limite di
  // paginazione della lista generale della discovery.
  const results = await Promise.all(
    counterpartIds.map((id) => client.rpc("lm360_get_public_profiles", { p_profile_id: id }))
  );

  if (results.some((result) => result?.error)) {
    throw new Error("MATCH_PUBLIC_PROFILE_READ_FAILED");
  }

  const profiles = results.flatMap((result, index) =>
    normalizePublicProfileProjection(result?.data, userId)
      .filter((profile) => profile.id === counterpartIds[index])
  );

  // In caso di revoca del consenso la RPC può restituire zero profili:
  // è una normale restrizione privacy, NON un permesso da aggirare.
  return { profiles, hasReciprocalMatch: true };
}
