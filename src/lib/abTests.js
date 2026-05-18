import { supabase } from "./supabaseClient";

const CONSENT_KEY = "cmp.analytics";
const MAX_AB_KEY_LENGTH = 64;
const SAFE_AB_KEY_RE = /^[a-z0-9_.:-]{1,64}$/i;

function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

function normalizeExperimentKey(key) {
  const safeKey = String(key || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.:-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, MAX_AB_KEY_LENGTH);

  if (!SAFE_AB_KEY_RE.test(safeKey)) return null;

  return safeKey;
}

function normalizeVariants(variants) {
  if (!Array.isArray(variants)) return ["A"];

  const safeVariants = variants
    .map((variant) => String(variant || "").trim())
    .filter((variant) => /^[a-z0-9_.:-]{1,32}$/i.test(variant));

  return safeVariants.length > 0 ? safeVariants : ["A"];
}

function pickVariant(variants) {
  return variants[Math.floor(Math.random() * variants.length)] || variants[0] || "A";
}

function readStoredVariant(storageKey, variants) {
  try {
    const saved = localStorage.getItem(storageKey);

    if (saved && variants.includes(saved)) {
      return saved;
    }
  } catch {
    // No logging: A/B assignment must not leak browser/session details.
  }

  return null;
}

function writeStoredVariant(storageKey, variant) {
  try {
    localStorage.setItem(storageKey, variant);
  } catch {
    // No logging: A/B assignment must not leak browser/session details.
  }
}

export async function getAbVariant(userId, key, variants) {
  const safeVariants = normalizeVariants(variants);
  const fallbackVariant = safeVariants[0];
  const safeKey = normalizeExperimentKey(key);

  if (!safeKey) return fallbackVariant;

  // A/B assignment is analytics-related: no Supabase and no localStorage
  // before explicit analytics consent.
  if (!hasAnalyticsConsent()) {
    return fallbackVariant;
  }

  const storageKey = `ab:${safeKey}`;
  const storedVariant = readStoredVariant(storageKey, safeVariants);

  if (storedVariant) {
    return storedVariant;
  }

  try {
    if (userId) {
      const { data } = await supabase
        .from("ab_assignments")
        .select("variant")
        .eq("user_id", userId)
        .eq("key", safeKey)
        .maybeSingle();

      if (data?.variant && safeVariants.includes(data.variant)) {
        writeStoredVariant(storageKey, data.variant);
        return data.variant;
      }
    }
  } catch {
    // No logging: A/B assignment must not leak browser/session details.
  }

  const variant = pickVariant(safeVariants);
  writeStoredVariant(storageKey, variant);

  return variant;
}
