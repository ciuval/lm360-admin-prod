import { calculateProfileCompletion } from "./profileCompletion.js";

function firstGalleryPhoto(rows = []) {
  return [...rows]
    .filter((row) => row?.foto_url)
    .sort((a, b) => {
      if (Boolean(a.is_primary) !== Boolean(b.is_primary)) {
        return a.is_primary ? -1 : 1;
      }
      return (a.ordine ?? 99) - (b.ordine ?? 99);
    })[0]?.foto_url || "";
}

export function buildDiscoverableProfiles(profiles = [], photoRows = [], currentUserId = null) {
  const photosByProfile = new Map();

  for (const photo of photoRows) {
    if (!photo?.profilo_id) continue;
    const existing = photosByProfile.get(photo.profilo_id) || [];
    existing.push(photo);
    photosByProfile.set(photo.profilo_id, existing);
  }

  return profiles
    .filter((profile) => profile?.id && profile.id !== currentUserId && profile.profilo_pubblico === true && profile.status_account === "attivo")
    .map((profile) => {
      const galleryPhoto = firstGalleryPhoto(photosByProfile.get(profile.id));
      return {
        ...profile,
        foto_url: profile.foto_url || profile.avatar_url || galleryPhoto,
      };
    })
    .filter((profile) => calculateProfileCompletion({ profile }).isComplete);
}


/**
 * La RPC lm360_get_public_profiles applica l'autorizzazione lato PostgreSQL.
 * Questo adattatore mantiene solo i sei campi previsti dal contratto,
 * senza effettuare query dirette a profili o foto di altre persone.
 *
 * Non sostituisce le verifiche server-side sul consenso.
 */
export function normalizePublicProfileProjection(rows = [], currentUserId = null) {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter((row) => row?.id && row.id !== currentUserId)
    .map((row) => ({
      id: row.id,
      nome: row.nome || "",
      bio: row.bio || "",
      interessi: row.interessi || "",
      foto_url: row.foto_url || "",
      premium: row.premium === true,
    }))
    .filter((row) => calculateProfileCompletion({ profile: row }).isComplete);
}
