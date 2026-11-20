import { normalizePublicProfileProjection } from "./publicProfiles.js";

/**
 * Legge solo il nome pubblico del partner esplicitamente visibile tramite
 * la proiezione minimizzata. Non consulta mai la tabella profili direttamente.
 * Il permesso di entrare in Stanza/chat è verificato a parte: questa funzione
 * ha uso esclusivamente presentazionale e non lo concede.
 */
export async function loadConsentedPartnerName(client, viewerId, partnerId) {
  const fallback = "questa persona";
  if (!viewerId || !partnerId || viewerId === partnerId) return fallback;

  try {
    const { data, error } = await client.rpc(
      "lm360_get_public_profiles",
      { p_profile_id: partnerId }
    );
    if (error || !Array.isArray(data)) return fallback;

    const profile = normalizePublicProfileProjection(data, viewerId)
      .find((item) => item.id === partnerId);

    return profile?.nome?.trim() || fallback;
  } catch {
    return fallback;
  }
}
