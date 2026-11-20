import { calculateProfileCompletion } from "./profileCompletion.js";

/**
 * Usa gli stessi requisiti e la stessa galleria consultati dalla guardia Scopri.
 * Se la verifica fallisce, lo stato resta sconosciuto: mai dichiarare un profilo pronto.
 */
export async function loadHomeProfileStatus(client, account) {
  if (!account?.isAuthed || account?.tier === "admin") {
    return { ready: false, verificationFailed: false };
  }

  if (!account?.user?.id) {
    return { ready: false, verificationFailed: true };
  }

  try {
    const { data, error } = await client
      .from("profili_foto")
      .select("foto_url")
      .eq("profilo_id", account.user.id)
      .limit(1);

    if (error) return { ready: false, verificationFailed: true };

    const completion = calculateProfileCompletion({
      profile: account.profile || {},
      photos: (data || []).map((photo) => ({ url: photo.foto_url })),
    });

    return { ready: completion.isComplete, verificationFailed: false };
  } catch {
    return { ready: false, verificationFailed: true };
  }
}
