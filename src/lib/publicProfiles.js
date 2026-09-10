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
    .filter((profile) => profile?.id && profile.id !== currentUserId)
    .map((profile) => {
      const galleryPhoto = firstGalleryPhoto(photosByProfile.get(profile.id));
      return {
        ...profile,
        foto_url: profile.foto_url || profile.avatar_url || galleryPhoto,
      };
    })
    .filter((profile) => calculateProfileCompletion({ profile }).isComplete);
}
