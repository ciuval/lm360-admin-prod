import { supabase } from "./supabaseClient";

// Event codes usabili ovunque (match.js importa EV)
export const EV = {
  VIEW_PREMIUM: "view_premium",
  CLICK_PAY: "click_pay",
  LOGIN: "login",
  LOGOUT: "logout",
  PROFILE_SAVE: "profile_save",
  LIKE_SEND: "like_send",
  MUTUAL_MATCH: "mutual_match"
};

// Toggle remoto (di default OFF finché non fissiamo la tabella `events`)
const REMOTE_ENABLED = (import.meta.env.VITE_EVENTS_REMOTE ?? "0") === "1";

let queue = [];
let flushing = false;
const nowIso = () => new Date().toISOString();

/**
 * Mai PII in `meta`.
 * Se non loggato -> NIENTE chiamate REST.
 */
export async function track(type, meta = {}) {
  try {
    if (!REMOTE_ENABLED) return; // soft kill remoto finché non pronto
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return;       // hard gate: blocca del tutto

    queue.push({ type, meta, user_id: user.id, created_at: nowIso() });
    void flush();
  } catch { /* no-op */ }
}

async function flush() {
  if (flushing || queue.length === 0) return;
  flushing = true;
  const batch = queue.splice(0, queue.length);
  try {
    // Inserimento minimale (type, meta, user_id, created_at)
    const { error } = await supabase.from("events").insert(batch);
    if (error && import.meta.env.DEV) console.warn("[analytics] skip:", error.message);
  } catch (e) {
    if (import.meta.env.DEV) console.warn("[analytics] skip:", e?.message || e);
  } finally {
    flushing = false;
  }
}
