/**
 * LoveMatch360 — prova API reale con DUE account fittizi, SOLO Supabase locale.
 * NON è uno smoke browser. Non esegue MAI sul progetto Supabase cloud.
 * Avvio manuale: npm run test:e2e:local
 * Variabili: LM360_LOCAL_SUPABASE_URL, LM360_LOCAL_SUPABASE_ANON_KEY,
 *            LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY (solo stack locale).
 * Non stampare email, UUID, password, token, contenuti chat o errori del provider.
 */
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { assertLocalE2eUrl } from "../src/lib/localE2eSafety.js";
import { persistProfile, syncPrimaryProfilePhoto } from "../src/lib/persistProfile.js";
import { setProfileVisibility } from "../src/lib/profileVisibility.js";
import { calculateProfileCompletion } from "../src/lib/profileCompletion.js";
import { normalizePublicProfileProjection } from "../src/lib/publicProfiles.js";

const url = assertLocalE2eUrl(process.env.LM360_LOCAL_SUPABASE_URL);
const anonKey = process.env.LM360_LOCAL_SUPABASE_ANON_KEY;
const serviceKey = process.env.LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
if (!anonKey || !serviceKey) throw new Error("LOCAL_KEYS_REQUIRED");

const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const makeClient = (key) => createClient(url, key, options);
const admin = makeClient(serviceKey);
const anon = makeClient(anonKey);
const createdIds = [];
let phase = "preflight";
const syntheticPhoto = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/E9kAAAAASUVORK5CYII=";
const roomQualities = ["affettuoso", "affidabile", "calmo", "rispettoso", "sincero"];
const room = {
  qualities_offered: roomQualities,
  qualities_sought: roomQualities,
  imperfections: [],
  imperfections_accepted: [],
};
const message = "Messaggio sintetico locale per il test";

function requireData(result, code) {
  if (result?.error) {
    const safeCode = /^[a-zA-Z0-9_]{1,22}$/.test(result.error.code ?? "")
      ? result.error.code : "API";
    throw new Error(code + "_" + safeCode);
  }
  return result?.data;
}
function check(test, label) {
  if (!test) throw new Error(label);
}
function announce(label) { process.stdout.write("PASS " + label + "\n"); }

async function preflight() {
  const tables = ["profili", "profili_foto", "likes", "match_scores", "messaggi", "stanze_360"];
  for (const table of tables) {
    // HEAD, count senza consultare righe o contenuti.
    requireData(await admin.from(table).select("*", { count: "exact", head: true }), "MISSING_TABLE_" + table);
  }
  // Le chiamate di controllo usano solo parametri null/impossibili.
  requireData(await admin.rpc("lm360_get_public_profiles", { p_profile_id: null }), "MISSING_PUBLIC_RPC");
  const neverExisting = "00000000-0000-4000-8000-0000000000ee";
  requireData(await admin.rpc("get_stanza_compatibility", { target_user_id: neverExisting }), "MISSING_ROOM_RPC");
  requireData(await admin.rpc("send_stanza_message", { target_user_id: neverExisting, message_content: "" }), "MISSING_SEND_RPC");
}

async function createSyntheticAccount(code) {
  const client = makeClient(anonKey);
  const suffix = randomBytes(12).toString("hex");
  const email = `lm360-${code}-${suffix}@example.test`;
  const password = `LM360!local-${randomBytes(24).toString("hex")}`;
  const signup = await client.auth.signUp({
    email, password,
    options: { data: { adult_attested: true, privacy_acknowledged: true, source: "local_synthetic_test" } },
  });
  const userId = signup.data?.user?.id;
  if (userId) createdIds.push(userId); // solo memoria, mai log
  requireData(signup, "SIGNUP_" + code);
  check(userId, "SIGNUP_USER_MISSING");

  if (!signup.data.session) {
    // Conferma amministrativa esclusivamente LOCALE: non sostituisce
    // un test della email reale nel Mailpit locale.
    requireData(await admin.auth.admin.updateUserById(userId, { email_confirm: true }), "LOCAL_CONFIRM_" + code);
    requireData(await client.auth.signInWithPassword({ email, password }), "LOCAL_LOGIN_" + code);
  }
  const fetched = requireData(await client.auth.getUser(), "GET_USER_" + code);
  check(fetched?.user?.id === userId, "IDENTITY_MISMATCH_" + code);
  return { client, id: userId, email };
}

async function profileWithPhoto(actor, name) {
  const query = await actor.client.from("profili").select("id").eq("id", actor.id).maybeSingle();
  const existing = requireData(query, "PROFILE_PREFLIGHT");
  const saved = await persistProfile(actor.client, {
    userId: actor.id, profileExists: Boolean(existing),
    email: actor.email, name,
    bio: "Profilo sintetico creato per verificare il percorso relazionale.",
    interests: "arte, lettura", photoUrl: null,
  });
  check(saved?.id === actor.id, "PROFILE_NOT_SAVED");
  requireData(await actor.client.from("profili_foto").insert({
    profilo_id: actor.id, foto_url: syntheticPhoto, ordine: 0, is_primary: true,
  }), "PHOTO_INSERT");
  await syncPrimaryProfilePhoto(actor.client, { userId: actor.id, photoUrl: syntheticPhoto });

  const completion = calculateProfileCompletion({
    profile: { ...saved, foto_url: syntheticPhoto },
    photos: [{ url: syntheticPhoto }],
  });
  check(completion.isComplete, "PROFILE_INCOMPLETE");
}

async function discover(reader, targetId, expectedVisible) {
  const result = requireData(await reader.client.rpc("lm360_get_public_profiles", { p_profile_id: targetId }), "DISCOVER_RPC");
  const rows = normalizePublicProfileProjection(result, reader.id);
  check(rows.some((p) => p.id === targetId) === expectedVisible, "CONSENT_DISCOVERY_MISMATCH");
  for (const row of rows) {
    check(Object.keys(row).sort().join(",") === "bio,foto_url,id,interessi,nome,premium", "EXCESS_PUBLIC_FIELDS");
  }
}

async function assertMatch(actor, other, expected) {
  const pair = [actor.id, other.id].sort();
  const result = requireData(await actor.client.from("match_scores")
    .select("user_a,user_b,score")
    .eq("user_a", pair[0]).eq("user_b", pair[1]).maybeSingle(), "MATCH_READ");
  check(Boolean(result?.score === 100) === expected, "MATCH_STATE_MISMATCH");
}

async function run() {
  await preflight();
  announce("preflight Auth/DB/RPC locale");

  phase = "registrazione";
  const a = await createSyntheticAccount("a");
  const b = await createSyntheticAccount("b");
  announce("registrazione e login di A e B");

  phase = "profilo-foto";
  await profileWithPhoto(a, "Andrea Test");
  await profileWithPhoto(b, "Bianca Test");
  announce("profili completi e foto sintetiche");

  phase = "consenso";
  await discover(a, b.id, false);
  check(await setProfileVisibility(b.client, { userId: b.id, makePublic: true }) === true, "OPT_IN_DENIED");
  await discover(a, b.id, true);
  check(await setProfileVisibility(a.client, { userId: a.id, makePublic: true }) === true, "OPT_IN_DENIED");
  await discover(b, a.id, true);
  const otherPrivate = await a.client.from("profili").select("id").eq("id", b.id);
  check(Boolean(otherPrivate.error) || otherPrivate.data?.length === 0, "PRIVATE_PROFILE_READABLE");
  announce("consenso e proiezione minima");

  phase = "primo-like";
  requireData(await a.client.from("likes").insert({ user_id: a.id, user_from: a.id, user_to: b.id }), "LIKE_A");
  await assertMatch(a, b, false);

  const spoof = await a.client.from("likes").insert({ user_id: b.id, user_from: b.id, user_to: a.id });
  check(Boolean(spoof.error), "LIKE_IMPERSONATION_ALLOWED");
  const fabricated = await a.client.from("match_scores").insert({
    user_a: [a.id,b.id].sort()[0], user_b: [a.id,b.id].sort()[1], score: 100,
  });
  check(Boolean(fabricated.error), "MATCH_FABRICATION_ALLOWED");
  announce("primo like e diniego falsificazioni");

  phase = "like-reciproco";
  requireData(await b.client.from("likes").insert({ user_id: b.id, user_from: b.id, user_to: a.id }), "LIKE_B");
  await assertMatch(a, b, true);
  await assertMatch(b, a, true);
  announce("match reciproco 100 senza scrittura client");

  phase = "stanza";
  const premature = requireData(await a.client.rpc("send_stanza_message", {
    target_user_id: b.id, message_content: message,
  }), "SEND_BEFORE_ROOM");
  check(premature !== true, "MESSAGE_BEFORE_ROOM_ALLOWED");

  for (const actor of [a, b]) {
    requireData(await actor.client.from("stanze_360").upsert({
      user_id: actor.id, ...room,
    }, { onConflict: "user_id" }), "ROOM_SAVE");
  }
  const compatibility = requireData(await a.client.rpc("get_stanza_compatibility", {
    target_user_id: b.id,
  }), "ROOM_COMPAT");
  const ready = Array.isArray(compatibility) ? compatibility[0] : compatibility;
  check(ready?.both_ready === true && ready.opens === true, "ROOM_CLOSED");
  announce("Stanza 360 con accesso autorizzato");

  phase = "chat";
  const sent = requireData(await a.client.rpc("send_stanza_message", {
    target_user_id: b.id, message_content: message,
  }), "SEND_VALID");
  check(sent === true, "SEND_NOT_CONFIRMED");

  const received = requireData(await b.client.from("messaggi")
    .select("id,mittente_id,destinatario_id,testo")
    .eq("mittente_id", a.id).eq("destinatario_id", b.id), "CHAT_RECEIVE");
  check(received.length === 1 && received[0].testo === message, "CHAT_NOT_RECEIVED");

  const publicRead = await anon.from("messaggi").select("id").eq("mittente_id", a.id);
  check(Boolean(publicRead.error) || publicRead.data?.length === 0, "ANON_CAN_READ_CHAT");
  announce("invio, lettura e divieto di accesso anonimo");

  phase = "revoca";
  check(await setProfileVisibility(b.client, { userId: b.id, makePublic: false }) === false, "OPT_OUT_DENIED");
  await discover(a, b.id, false);
  announce("revoca visibilita");

  phase = "complete";
  announce("Fase 2 API locale: due account sintetici");
}

async function cleanLocalTestRows() {
  if (!createdIds.length) return;
  const ids = [...new Set(createdIds)];
  // Nessun SELECT indiscriminato e nessuna operazione su account altrui.
  const operations = [
    admin.from("messaggi").delete().in("mittente_id", ids),
    admin.from("likes").delete().in("user_id", ids),
    admin.from("stanze_360").delete().in("user_id", ids),
    admin.from("profili_foto").delete().in("profilo_id", ids),
  ];
  await Promise.allSettled(operations);
  for (const id of ids) {
    const result = await admin.auth.admin.deleteUser(id);
    if (result.error) throw new Error("LOCAL_TEST_CLEANUP_FAILED");
  }
}

try {
  await run();
} catch (error) {
  // Solo codici controllati, mai payload o dettagli del provider.
  const code = /^[A-Z0-9_]{1,80}$/.test(error?.message || "")
    ? error.message : "UNEXPECTED";
  process.stderr.write(`FAIL fase ${phase}: ${code}\n`);
  process.exitCode = 1;
} finally {
  try {
    await cleanLocalTestRows();
    process.stdout.write("CLEANUP account sintetici locali completato\n");
  } catch {
    process.stderr.write("FAIL CLEANUP: usare il reset dello stack locale, non la produzione\n");
    process.exitCode = 1;
  }
}
