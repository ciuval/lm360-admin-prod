const STORAGE_KEY = "lm360.activation_journey.v1";
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getStorage() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function createFlowId() {
  try {
    const values = new Uint32Array(3);
    window.crypto.getRandomValues(values);
    return Array.from(values, (value) => value.toString(36).padStart(7, "0"))
      .join("")
      .slice(0, 30);
  } catch {
    return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  }
}

function normalizeJourney(value, now = Date.now()) {
  if (!value || typeof value !== "object") return null;

  const flow = String(value.flow || "").trim();
  const startedAt = Number(value.startedAt);

  if (!/^[a-z0-9]{12,30}$/i.test(flow)) return null;
  if (!Number.isFinite(startedAt) || startedAt <= 0) return null;
  if (now - startedAt > MAX_AGE_MS || startedAt > now + 60_000) return null;

  return { flow, startedAt };
}

export function readActivationJourney(now = Date.now()) {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const journey = normalizeJourney(JSON.parse(storage.getItem(STORAGE_KEY)), now);

    if (!journey) {
      storage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      ...journey,
      signup_elapsed_seconds: Math.max(0, Math.round((now - journey.startedAt) / 1000)),
    };
  } catch {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      // Storage is optional; keep the product flow working without it.
    }
    return null;
  }
}

export function startActivationJourney(now = Date.now()) {
  const existing = readActivationJourney(now);
  if (existing) return existing;

  const journey = {
    flow: createFlowId(),
    startedAt: now,
  };

  try {
    getStorage()?.setItem(STORAGE_KEY, JSON.stringify(journey));
  } catch {
    // Measurement must never block registration.
  }

  return {
    ...journey,
    signup_elapsed_seconds: 0,
  };
}

export function getActivationJourneyProps(now = Date.now()) {
  const journey = readActivationJourney(now);
  if (!journey) return {};

  return {
    flow: journey.flow,
    signup_elapsed_seconds: journey.signup_elapsed_seconds,
  };
}
