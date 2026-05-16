import { supabase } from "./supabaseClient";

const CONSENT_KEY = "cmp.analytics";

const MAX_EVENT_NAME_LENGTH = 64;
const MAX_PROP_KEYS = 12;
const MAX_PROP_KEY_LENGTH = 40;
const MAX_PROP_STRING_LENGTH = 80;
const MAX_PATH_LENGTH = 120;

const SAFE_EVENT_NAME_RE = /^[a-z0-9][a-z0-9_.:-]{0,63}$/i;
const SAFE_PROP_KEY_RE = /^[a-zA-Z0-9_.:-]{1,40}$/;
const SAFE_PROP_STRING_RE = /^[a-zA-Z0-9_.:-]{1,80}$/;

const UUID_RE =
  /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/gi;

const EMAIL_RE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const SENSITIVE_KEY_RE =
  /(email|mail|name|nome|surname|cognome|phone|telefono|tel|address|indirizzo|street|via|city|citta|cap|zip|password|pass|token|secret|jwt|session|cookie|bearer|key|apikey|api_key|stripe|payment|card|iban|fiscale|tax|message|messaggio|bio|description|descrizione|reason|motivo|note|profile|profilo|photo|foto|avatar|image|url|link|ip|user_agent|ua)/i;

const SENSITIVE_VALUE_RE =
  /(sk_live_|sk_test_|pk_live_|pk_test_|eyJ[a-zA-Z0-9_-]+\.|bearer\s+|password|token|secret|api[_-]?key|https?:\/\/|www\.|@)/i;

function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

function normalizeEventName(name) {
  const raw = String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_.:-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, MAX_EVENT_NAME_LENGTH);

  if (!SAFE_EVENT_NAME_RE.test(raw)) return null;

  return raw;
}

function sanitizePath() {
  try {
    const hashRoute = window.location.hash
      ? window.location.hash.replace(/^#/, "")
      : "";

    const rawPath = hashRoute || window.location.pathname || "/";

    const cleanPath = rawPath
      .split("?")[0]
      .split("&")[0]
      .replace(UUID_RE, ":id")
      .replace(/\/\d{4,}(?=\/|$)/g, "/:id")
      .replace(/\/+/g, "/")
      .slice(0, MAX_PATH_LENGTH);

    return cleanPath || "/";
  } catch {
    return "/";
  }
}

function sanitizePropValue(value) {
  if (typeof value === "boolean") return value;

  if (typeof value === "number") {
    if (!Number.isFinite(value)) return undefined;
    return Math.round(value * 1000) / 1000;
  }

  if (typeof value === "string") {
    const safe = value.trim().slice(0, MAX_PROP_STRING_LENGTH);

    if (!safe) return undefined;
    if (!SAFE_PROP_STRING_RE.test(safe)) return undefined;
    if (EMAIL_RE.test(safe)) return undefined;
    if (UUID_RE.test(safe)) return undefined;
    if (SENSITIVE_VALUE_RE.test(safe)) return undefined;

    return safe;
  }

  return undefined;
}

function sanitizeProps(props) {
  if (!props || typeof props !== "object" || Array.isArray(props)) {
    return {};
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(props).slice(0, MAX_PROP_KEYS)) {
    const safeKey = String(key || "").trim().slice(0, MAX_PROP_KEY_LENGTH);

    if (!SAFE_PROP_KEY_RE.test(safeKey)) continue;
    if (SENSITIVE_KEY_RE.test(safeKey)) continue;

    const safeValue = sanitizePropValue(value);

    if (safeValue !== undefined) {
      sanitized[safeKey] = safeValue;
    }
  }

  return sanitized;
}

async function getSafeUserId() {
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id ?? null;
  } catch {
    return null;
  }
}

export async function track(name, props = {}) {
  if (!hasAnalyticsConsent()) return;

  const safeName = normalizeEventName(name);
  if (!safeName) return;

  const safeProps = sanitizeProps(props);
  const safePath = sanitizePath();
  const uid = await getSafeUserId();

  try {
    await supabase.from("events").insert({
      name: safeName,
      props: safeProps,
      path: safePath,
      user_id: uid,
    });
  } catch {
    // No console logging: analytics must never leak PII or secrets.
  }
}
