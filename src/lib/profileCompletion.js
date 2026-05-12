const REQUIRED_ITEMS = [
  {
    key: "name",
    label: "Nome",
    description: "Aggiungi un nome visibile.",
  },
  {
    key: "bio",
    label: "Bio",
    description: "Scrivi una bio di almeno 20 caratteri.",
  },
  {
    key: "interests",
    label: "Interessi",
    description: "Inserisci almeno un interesse.",
  },
  {
    key: "photos",
    label: "Foto",
    description: "Carica almeno una foto profilo.",
  },
];

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeInterests(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  return normalizeText(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasValidPhoto(profile = {}, photos = []) {
  const galleryHasPhoto =
    Array.isArray(photos) && photos.some((photo) => normalizeText(photo?.url));

  return (
    galleryHasPhoto ||
    Boolean(normalizeText(profile.foto_url) || normalizeText(profile.avatar_url))
  );
}

export function calculateProfileCompletion({ profile = {}, photos = [] } = {}) {
  const checks = {
    name: normalizeText(profile.nome).length >= 2,
    bio: normalizeText(profile.bio).length >= 20,
    interests: normalizeInterests(profile.interessi).length >= 1,
    photos: hasValidPhoto(profile, photos),
  };

  const items = REQUIRED_ITEMS.map((item) => ({
    ...item,
    completed: Boolean(checks[item.key]),
  }));

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const score = Math.round((completedCount / totalCount) * 100);
  const missingItems = items.filter((item) => !item.completed);

  return {
    score,
    completedCount,
    totalCount,
    isComplete: completedCount === totalCount,
    items,
    missingItems,
    missingKeys: missingItems.map((item) => item.key),
  };
}
