/**
 * Gate 2.1-B — verifica revoca match esclusivamente nel Supabase Docker LAB.
 * Crea due account @example.test nuovi e li elimina in finally.
 * Non usa dati o account browser esistenti. Output solo PASS/FAIL.
 */
import { randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { assertLocalE2eUrl } from "../src/lib/localE2eSafety.js";

const url = assertLocalE2eUrl(process.env.LM360_LOCAL_SUPABASE_URL);
if (process.env.LM360_GATE21_LOCAL_GUARD !== "YES") throw new Error("GATE21_LOCAL_GUARD_REQUIRED");
const anonKey = process.env.LM360_LOCAL_SUPABASE_ANON_KEY;
const serviceKey = process.env.LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
if (!anonKey || !serviceKey) throw new Error("GATE21_LOCAL_KEYS_MISSING");
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const makeClient = (key) => createClient(url, key, options);
const admin = makeClient(serviceKey);
const createdIds = [];
const qualities = ["affettuoso", "affidabile", "calmo", "rispettoso", "sincero"];
const room = { qualities_offered: qualities, qualities_sought: qualities, imperfections: [], imperfections_accepted: [] };
const ok = (test, code) => { if (!test) throw new Error(code); };
const dataOf = (response, code) => {
  if (response.error) throw new Error(code);
  return response.data;
};
const status = (label, success) => {
  process.stdout.write((success ? "PASS " : "FAIL ") + label + "\n");
  return success;
};
let phase = "PREFLIGHT";

async function makeActor(code) {
  const client = makeClient(anonKey);
  const email = "gate21-" + code + "-" + randomBytes(12).toString("hex") + "@example.test";
  const password = "LM360!gate21-" + randomBytes(24).toString("hex");
  const signup = await client.auth.signUp({
    email, password,
    options: { data: { adult_attested: true, privacy_acknowledged: true, source: "local_synthetic_gate21" } },
  });
  const userId = signup.data?.user?.id;
  if (userId) createdIds.push(userId);
  dataOf(signup, "SIGNUP_FAILED");
  ok(Boolean(userId), "SIGNUP_MISSING_ID");
  if (!signup.data.session) {
    dataOf(await admin.auth.admin.updateUserById(userId, { email_confirm: true }), "LOCAL_CONFIRM_FAILED");
    dataOf(await client.auth.signInWithPassword({ email, password }), "LOCAL_LOGIN_FAILED");
  }
  const signedIn = dataOf(await client.auth.getUser(), "USER_CHECK_FAILED");
  ok(signedIn?.user?.id === userId, "IDENTITY_MISMATCH");
  return { id: userId, client, email };
}

async function preparePair(a, b) {
  for (const actor of [a, b]) {
    dataOf(await actor.client.from("profili").upsert({
      id: actor.id, nome: "Persona test Gate 2.1", email: actor.email,
    }, { onConflict: "id" }), "PROFILE_SETUP_FAILED");
    dataOf(await actor.client.from("stanze_360").upsert({
      user_id: actor.id, ...room,
    }, { onConflict: "user_id" }), "ROOM_SETUP_FAILED");
  }
  dataOf(await a.client.from("likes").insert({
    user_id: a.id, user_from: a.id, user_to: b.id,
  }), "LIKE_A_FAILED");
  dataOf(await b.client.from("likes").insert({
    user_id: b.id, user_from: b.id, user_to: a.id,
  }), "LIKE_B_FAILED");

  const first = dataOf(await a.client.rpc("can_open_stanza", { target_user_id: b.id }), "BEFORE_RPC_A_FAILED");
  const second = dataOf(await b.client.rpc("can_open_stanza", { target_user_id: a.id }), "BEFORE_RPC_B_FAILED");
  ok(first === true && second === true, "BEFORE_CHAT_NOT_OPEN");
  const original = dataOf(await a.client.rpc("send_stanza_message", {
    target_user_id: b.id, message_content: "Messaggio sintetico prima della revoca",
  }), "BEFORE_SEND_FAILED");
  ok(original === true, "BEFORE_SEND_NOT_AUTHORIZED");
  const row = dataOf(await b.client.from("messaggi").select("id")
    .eq("mittente_id", a.id).eq("destinatario_id", b.id), "BEFORE_READ_FAILED");
  ok(row.length === 1, "BEFORE_MESSAGE_NOT_READABLE");
  return row[0].id;
}

async function run() {
  phase = "PREFLIGHT";
  for (const name of ["profili", "likes", "match_scores", "messaggi", "stanze_360"]) {
    dataOf(await admin.from(name).select("*", { count: "exact", head: true }), "LOCAL_SCHEMA_MISSING");
  }
  status("GATE21_LOCAL_PREFLIGHT", true);
  phase = "SETUP";
  const a = await makeActor("a");
  const b = await makeActor("b");
  const originalId = await preparePair(a, b);
  status("GATE21_BEFORE_REVOCATION", true);

  phase = "REVOCATION";
  const deleted = dataOf(await a.client.from("likes").delete()
    .eq("user_id", a.id).eq("user_to", b.id).select("id"), "LIKE_DELETE_FAILED");
  ok(deleted.length === 1, "LIKE_DELETE_NOT_CONFIRMED");
  status("GATE21_LIKE_REVOKED", true);

  phase = "AFTER_REVOCATION";
  // Provare da ENTRAMBE le sessioni e via RPC diretta, non solo dalla UI.
  const aAllowed = await a.client.rpc("can_open_stanza", { target_user_id: b.id });
  const bAllowed = await b.client.rpc("can_open_stanza", { target_user_id: a.id });
  const aSent = await a.client.rpc("send_stanza_message", {
    target_user_id: b.id, message_content: "Messaggio sintetico dopo revoca A",
  });
  const bSent = await b.client.rpc("send_stanza_message", {
    target_user_id: a.id, message_content: "Messaggio sintetico dopo revoca B",
  });
  const aRead = await a.client.from("messaggi").select("id").eq("id", originalId);
  const bRead = await b.client.from("messaggi").select("id").eq("id", originalId);

  const checks = [
    ["CAN_OPEN_A_DENIED", aAllowed.data !== true],
    ["CAN_OPEN_B_DENIED", bAllowed.data !== true],
    ["SEND_A_DENIED", aSent.data !== true],
    ["SEND_B_DENIED", bSent.data !== true],
    ["HISTORY_A_DENIED", Boolean(aRead.error) || aRead.data?.length === 0],
    ["HISTORY_B_DENIED", Boolean(bRead.error) || bRead.data?.length === 0],
  ];
  const allDenied = checks.map(([label, value]) => status(label, value)).every(Boolean);
  status("GATE21_REVOCATION_E2E", allDenied);
  if (!allDenied) process.exitCode = 1;
}

async function cleanup() {
  if (!createdIds.length) return;
  const ids = [...new Set(createdIds)];
  // Scope esclusivamente gli UUID degli account creati da questo processo.
  let failed = false;
  const cleanupQueries = [
    admin.from("messaggi").delete().in("mittente_id", ids),
    admin.from("likes").delete().in("user_id", ids),
    admin.from("match_scores").delete().in("user_a", ids),
    admin.from("match_scores").delete().in("user_b", ids),
    admin.from("stanze_360").delete().in("user_id", ids),
  ];
  for (const query of cleanupQueries) {
    try { const result = await query; if (result.error) failed = true; }
    catch { failed = true; }
  }
  for (const id of ids) {
    try { const result = await admin.auth.admin.deleteUser(id); if (result.error) failed = true; }
    catch { failed = true; }
  }
  ok(!failed, "CLEANUP_FAILED");
}

try {
  await run();
} catch {
  process.stderr.write("FAIL GATE21_STAGE=" + phase + "\n");
  process.exitCode = 1;
} finally {
  try { await cleanup(); status("GATE21_CLEANUP", true); }
  catch { status("GATE21_CLEANUP", false); process.exitCode = 1; }
}
