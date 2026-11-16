/**
 * LoveMatch360 — RLS / IDOR con terzo account temporaneo e la coppia A/B
 * già creata nel LAB, SOLO http://127.0.0.1:54321.
 * Non mostra MAI email, UUID, credenziali, token, contenuti della chat
 * o messaggi del provider. Non modifica utenti, messaggi o match A/B.
 * Pulizia: elimina esclusivamente l'account C appena creato.
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { assertLocalE2eUrl } from "../src/lib/localE2eSafety.js";

const url = assertLocalE2eUrl(process.env.LM360_LOCAL_SUPABASE_URL);
const anonKey = process.env.LM360_LOCAL_SUPABASE_ANON_KEY;
const serviceKey = process.env.LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
if (!anonKey || !serviceKey) throw new Error("LOCAL_KEYS_REQUIRED");

const opts = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const client = (key) => createClient(url, key, opts);
const admin = client(serviceKey);
const anon = client(anonKey);
let createdId = null;
let stage = "PREFLIGHT";

function check(condition, code) {
  if (!condition) throw new Error(code);
}
function dataOf(result, code) {
  if (result?.error) {
    // Mai riprodurre l'errore del provider: può contenere dati privati.
    throw new Error(code);
  }
  return result?.data;
}
function pass(label) {
  process.stdout.write("PASS " + label + "\n");
}
function requireEmpty(result, code) {
  const rows = dataOf(result, code);
  check(Array.isArray(rows) && rows.length === 0, code);
}
async function countAllPairs(ids) {
  const q = await admin.from("messaggi")
    .select("id", { count: "exact", head: true })
    .in("mittente_id", ids).in("destinatario_id", ids);
  check(!q.error && Number.isInteger(q.count), "BASELINE_MESSAGES_UNAVAILABLE");
  return q.count;
}
async function run() {
  // A/B devono essere ESATTAMENTE i due account di browser sintetici.
  const profiles = dataOf(await admin.from("profili")
    .select("id,nome,email")
    .in("nome", ["Andrea Test", "Bianca Test"]), "LOCAL_PROFILES_UNAVAILABLE");
  check(Array.isArray(profiles) && profiles.length === 2, "SYNTHETIC_PAIR_NOT_UNIQUE");
  const a = profiles.find((p) => p.nome === "Andrea Test");
  const b = profiles.find((p) => p.nome === "Bianca Test");
  check(Boolean(a?.id && b?.id && a.id !== b.id), "SYNTHETIC_PAIR_NOT_FOUND");
  check([a,b].every((p) => typeof p.email === "string" &&
    p.email.endsWith("@example.test")), "NON_SYNTHETIC_PAIR_BLOCKED");
  const ids = [a.id, b.id];

  const before = await countAllPairs(ids);
  check(before >= 2, "SYNTHETIC_CONVERSATION_NOT_FOUND");
  const sample = dataOf(await admin.from("messaggi").select("id")
    .in("mittente_id", ids).in("destinatario_id", ids)
    .order("id", { ascending: true }).limit(1), "SYNTHETIC_MESSAGE_UNAVAILABLE");
  check(sample?.length === 1, "SYNTHETIC_MESSAGE_NOT_FOUND");
  const messageId = sample[0].id; // Solo memoria, nessun contenuto letto.

  // Prima confermiamo l'accesso anonimo negato: qualunque altro
  // errore che non sia 42501 non deve essere scambiato per PASS.
  stage = "ANON";
  const anonymous = await anon.from("messaggi")
    .select("id", { count: "exact", head: true });
  if (anonymous.error) {
    // Soltanto codici tecnici allowlistati: niente message/hint/details,
    // token, headers o URL del provider. Errori inattesi restano FAIL.
    const code = String(anonymous.error.code ?? "");
    if (code !== "42501") {
      const safeCode = /^[A-Z0-9_]{1,20}$/.test(code) ? code : "UNKNOWN";
      const safeStatus = Number.isInteger(anonymous.status) &&
        anonymous.status >= 100 && anonymous.status <= 599
        ? String(anonymous.status) : "UNKNOWN";
      process.stdout.write("ANON_DIAGNOSTIC_CODE=" + safeCode +
        " HTTP=" + safeStatus + "\n");
      throw new Error("ANON_UNEXPECTED_ERROR");
    }
  } else {
    check(anonymous.count === 0, "ANON_READ_ALLOWED");
  }
  pass("account anonimo: accesso ai messaggi negato");

  stage = "CREATE_C";
  // Nessun account reale: indirizzo riservato .test e credenziali casuali.
  const email = "lm360-outsider-" + randomBytes(12).toString("hex") + "@example.test";
  const password = "LM360!local-" + randomBytes(24).toString("hex");
  const created = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { source: "local_synthetic_privacy_test" },
  });
  // Salva subito l'ID prima di ogni controllo che potrebbe fallire.
  createdId = created?.data?.user?.id || null;
  dataOf(created, "CREATE_SYNTHETIC_C_FAILED");
  check(createdId, "CREATE_SYNTHETIC_C_MISSING");

  const outsider = client(anonKey);
  dataOf(await outsider.auth.signInWithPassword({ email, password }), "LOGIN_SYNTHETIC_C_FAILED");
  const identity = dataOf(await outsider.auth.getUser(), "IDENTITY_SYNTHETIC_C_FAILED");
  check(identity?.user?.id === createdId, "IDENTITY_SYNTHETIC_C_MISMATCH");
  // Il terzo account ha un profilo proprio, mai il match con A/B.
  dataOf(await outsider.from("profili").insert({
    id: createdId,
    email,
    nome: "Carlo Test",
    bio: "Utente temporaneo per la verifica privacy locale.",
    interessi: "sicurezza",
  }), "CREATE_SYNTHETIC_PROFILE_FAILED");
  const mine = dataOf(await outsider.from("profili")
    .select("id").eq("id", createdId).maybeSingle(), "OWN_PROFILE_READ_FAILED");
  check(mine?.id === createdId, "OWN_PROFILE_NOT_VISIBLE");
  pass("terzo account sintetico autenticato e profilo proprio leggibile");

  stage = "READ_DENIAL";
  const allMessages = await outsider.from("messaggi")
    .select("id", { count: "exact", head: true });
  check(!allMessages.error && allMessages.count === 0, "OUTSIDER_GLOBAL_CHAT_LEAK");
  requireEmpty(await outsider.from("messaggi")
    .select("id").eq("id", messageId), "OUTSIDER_TARGETED_CHAT_LEAK");
  requireEmpty(await outsider.from("messaggi")
    .select("id").in("mittente_id", ids).in("destinatario_id", ids),
    "OUTSIDER_CONVERSATION_LEAK");
  pass("terzo account: lettura globale, per ID e per coppia negate");

  stage = "OTHER_PRIVACY";
  const pair = [...ids].sort();
  requireEmpty(await outsider.from("match_scores")
    .select("user_a,user_b,score").eq("user_a", pair[0]).eq("user_b", pair[1]),
    "OUTSIDER_MATCH_LEAK");
  requireEmpty(await outsider.from("stanze_360")
    .select("user_id").in("user_id", ids), "OUTSIDER_STANZA_LEAK");
  requireEmpty(await outsider.from("profili")
    .select("id").in("id", ids), "OUTSIDER_PRIVATE_PROFILE_LEAK");
  pass("terzo account: match, Stanza 360 e profili riservati non visibili");

  stage = "WRITE_DENIAL";
  const canOpen = dataOf(await outsider.rpc("can_open_stanza", {
    target_user_id: a.id,
  }), "OUTSIDER_ROOM_ACCESS_ERROR");
  check(canOpen === false, "OUTSIDER_ROOM_ACCESS_ALLOWED");
  const sent = dataOf(await outsider.rpc("send_stanza_message", {
    target_user_id: a.id,
    message_content: "Messaggio sintetico BLOCCATO: utente estraneo.",
  }), "OUTSIDER_SEND_ERROR");
  check(sent === false, "OUTSIDER_MESSAGE_SEND_ALLOWED");
  const outsiderCount = await admin.from("messaggi")
    .select("id", { count: "exact", head: true }).eq("mittente_id", createdId);
  check(!outsiderCount.error && outsiderCount.count === 0, "OUTSIDER_MESSAGE_WRITTEN");
  check((await countAllPairs(ids)) === before, "ORIGINAL_CONVERSATION_CHANGED");
  pass("terzo account: stanza e invio negati; conversazione originale intatta");

  stage = "DONE";
  pass("privacy RLS/IDOR: 3 account nel Supabase locale");
}

async function cleanup() {
  if (!createdId) return false;
  // Non toccare mai A o B. La FK auth.users → profili usa CASCADE.
  const result = await admin.auth.admin.deleteUser(createdId);
  dataOf(result, "CLEANUP_SYNTHETIC_C_FAILED");
  const remaining = dataOf(await admin.from("profili")
    .select("id").eq("id", createdId).maybeSingle(), "CLEANUP_PROFILE_CHECK_FAILED");
  check(remaining === null, "CLEANUP_PROFILE_REMAINS");
  return true;
}

try {
  await run();
} catch (error) {
  const code = /^[A-Z0-9_]{1,80}$/.test(error?.message || "")
    ? error.message : "UNEXPECTED";
  process.stderr.write("FAIL " + stage + " " + code + "\n");
  process.exitCode = 1;
} finally {
  try {
    const createdAndRemoved = await cleanup();
    process.stdout.write(createdAndRemoved
      ? "CLEANUP solo account C locale: PASS\n"
      : "CLEANUP account C: NON NECESSARIO (nessun account creato)\n");
  } catch {
    // Non proporre db reset: A/B devono rimanere intatti.
    process.stderr.write("FAIL CLEANUP_C: verifica manuale SOLO nel LAB, NON usare db reset\n");
    process.exitCode = 1;
  }
}
