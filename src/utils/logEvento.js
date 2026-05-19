import { supabase } from "../lib/supabaseClient";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const MAX_EVENT_TYPE_LENGTH = 40;

const ALLOWED_EVENTS = new Map([
  ["LOGIN", "account_login"],
  ["LOGOUT", "account_logout"],
  ["SIGNUP", "account_signup"],
  ["REGISTER", "account_signup"],
  ["PROFILE_UPDATE", "profile_update"],
  ["PROFILE_SAVE", "profile_update"],
  ["PHOTO_UPLOAD", "profile_photo_upload"],
  ["PHOTO_DELETE", "profile_photo_delete"],
  ["LIKE", "like_created"],
  ["MATCH", "match_created"],
  ["PREMIUM_VIEW", "premium_view"],
  ["BILLING_VIEW", "billing_view"],
  ["COOKIE_CONSENT", "cookie_consent"],
  ["MFA_SETUP", "mfa_setup"],
  ["ADMIN_VIEW", "admin_view"],
  ["SUBSCRIPTION_ACTIVATE", "subscription_activate"],
]);

function normalizeUuid(value) {
  const raw = String(value || "").trim();

  if (!UUID_RE.test(raw)) {
    return null;
  }

  return raw.toLowerCase();
}

function normalizeEventType(value) {
  const raw = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_:-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, MAX_EVENT_TYPE_LENGTH);

  if (!ALLOWED_EVENTS.has(raw)) {
    return null;
  }

  return raw;
}

async function getAuthenticatedUserId() {
  try {
    const { data } = await supabase.auth.getUser();
    return normalizeUuid(data?.user?.id);
  } catch {
    return null;
  }
}

export async function logEvento(
  userId,
  tipo,
  _legacyDescription = "",
  _legacyPage = ""
) {
  const profiloId = normalizeUuid(userId);
  const authUserId = await getAuthenticatedUserId();
  const safeTipo = normalizeEventType(tipo);

  if (!profiloId || !authUserId || profiloId !== authUserId || !safeTipo) {
    return { ok: false, skipped: true };
  }

  try {
    const { error } = await supabase.from("log_attivita").insert({
      profilo_id: profiloId,
      tipo: safeTipo,
      descrizione: ALLOWED_EVENTS.get(safeTipo),
    });

    if (error) {
      return { ok: false, error: "LOG_EVENT_FAILED" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "LOG_EVENT_FAILED" };
  }
}
