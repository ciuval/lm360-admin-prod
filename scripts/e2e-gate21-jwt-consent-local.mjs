/**
 * Gate 2.1: JWT/HTTP consent probe using disposable accounts and SQL fixture.
 * ONLY local Docker LM360_FASE2_LAB; never cloud, main, existing profiles/chats.
 * Creates a unique private schema + 3 public RPC in one transaction, then
 * removes only these objects, and deletes only accounts created in this run.
 * No emails, IDs, JWTs, tokens, messages or provider errors in output.
 */
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { assertLocalE2eUrl } from "../src/lib/localE2eSafety.js";

const db = "supabase_db_LM360_FASE2_LAB";
const url = assertLocalE2eUrl(process.env.LM360_LOCAL_SUPABASE_URL);
if (process.env.LM360_GATE21_JWT_LOCAL_GUARD !== "YES") throw new Error("GATE21_LOCAL_GUARD_REQUIRED");
const anonKey = process.env.LM360_LOCAL_SUPABASE_ANON_KEY;
const serviceKey = process.env.LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
if (!anonKey || !serviceKey) throw new Error("GATE21_LOCAL_KEYS_MISSING");
const settings = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const client = (key) => createClient(url, key, settings);
const admin = client(serviceKey);
const createdIds = [];
const suffix = randomBytes(8).toString("hex");
const names = {
  "__SCHEMA__": "lm360_gate21_jwt_probe_" + suffix,
  "__FN_CONSENT__": "lm360_probe_consent_" + suffix,
  "__FN_OPEN__": "lm360_probe_can_open_" + suffix,
  "__FN_WITHDRAW__": "lm360_probe_withdraw_" + suffix,
};
let phase = "PREFLIGHT";
let setupAttempted = false;

function check(condition, code) { if (!condition) throw new Error(code); }
function dataOf(res, code) { if (res?.error) throw new Error(code); return res?.data; }
function pass(code) { process.stdout.write("PASS " + code + "\n"); }
const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

function sqlThroughDocker(sql, expected) {
  // Docker command only, not shell. Never print SQL, stdout errors or stderr.
  const run = spawnSync("docker", [
    "exec", "-i", db, "psql", "-X", "-q", "-A", "-t", "-U", "postgres",
    "-d", "postgres", "-v", "ON_ERROR_STOP=1",
  ], {
    input: sql, encoding: "utf8", timeout: 30000, maxBuffer: 1024 * 128,
  });
  check(!run.error && run.status === 0, expected + "_EXEC_FAILED");
  const markers = (run.stdout || "").split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  check(markers.includes(expected), expected + "_MARKER_MISSING");
}

async function sqlTemplate(file, ids = {}) {
  let sql = await readFile(new URL("./local-only/" + file, import.meta.url), "utf8");
  for (const [placeholder, name] of Object.entries({ ...names, ...ids })) {
    check(/^[a-z_][a-z_0-9]*$|^[a-f0-9-]{36}$/i.test(name), "INVALID_FIXTURE_IDENTIFIER");
    sql = sql.replaceAll(placeholder, name);
  }
  check(!/__\w+__/.test(sql), "UNRESOLVED_SQL_TEMPLATE");
  return sql;
}

async function createActor(roleCode) {
  const email = "gate21-jwt-" + roleCode + "-" + randomBytes(12).toString("hex") + "@example.test";
  const password = "LM360!jwt-" + randomBytes(24).toString("hex");
  const res = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: { source: "local_ephemeral_gate21_jwt_probe" },
  });
  const id = res?.data?.user?.id;
  if (id) createdIds.push(id);
  check(!res.error && Boolean(id), "CREATE_SYNTHETIC_" + roleCode + "_FAILED");

  const actor = client(anonKey);
  dataOf(await actor.auth.signInWithPassword({ email, password }), "LOGIN_" + roleCode + "_FAILED");
  const identity = dataOf(await actor.auth.getUser(), "IDENTITY_" + roleCode + "_FAILED");
  check(identity?.user?.id === id, "IDENTITY_" + roleCode + "_MISMATCH");
  return { id, actor };
}

async function rpc(actor, name, caseId, code) {
  const result = await actor.rpc(names[name], { p_case: caseId });
  const value = dataOf(result, code + "_ERROR");
  check(typeof value === "boolean", code + "_NONBOOLEAN");
  return value;
}

async function awaitRpcReady(actor) {
  for (let attempt = 0; attempt < 24; attempt++) {
    const response = await actor.rpc(names.__FN_OPEN__, { p_case: 1 });
    if (!response.error && response.data === false) return;
    await wait(250);
  }
  throw new Error("RPC_SCHEMA_CACHE_UNAVAILABLE");
}

async function run() {
  phase = "CREATE_SYNTHETIC_ACCOUNTS";
  const a = await createActor("a");
  const b = await createActor("b");
  const m = await createActor("m");
  const x = await createActor("x");
  check(new Set([a.id, b.id, m.id, x.id]).size === 4, "ACTOR_IDS_NOT_DISTINCT");
  pass("JWT_AUTHENTICATED_SYNTHETIC_ACTORS");

  phase = "SETUP_EPHEMERAL_SQL";
  const setup = await sqlTemplate("gate21-jwt-ephemeral-setup.sql", {
    "__A__": a.id, "__B__": b.id, "__M__": m.id,
  });
  setupAttempted = true;
  sqlThroughDocker(setup, "GATE21_JWT_FIXTURE_SETUP=PASS");
  await awaitRpcReady(a.actor);
  pass("JWT_FIXTURE_RPC_READY");

  phase = "TEST_WITH_JWT";
  // No consent; M and X have no power to authorize anyone.
  check(await rpc(m.actor, "__FN_CONSENT__", 1, "M_CONSENT") === false, "M_CAN_CONSENT");
  check(await rpc(x.actor, "__FN_CONSENT__", 1, "X_CONSENT") === false, "X_CAN_CONSENT");
  check(await rpc(m.actor, "__FN_WITHDRAW__", 1, "M_WITHDRAW") === false, "M_CAN_WITHDRAW");
  check(await rpc(m.actor, "__FN_OPEN__", 1, "M_PREOPEN") === false, "M_OPEN_BEFORE_CONSENT");
  pass("JWT_THIRD_PARTY_NO_CONSENT");

  // Even with B's valid token, B may consent only for B, never for A.
  check(await rpc(b.actor, "__FN_CONSENT__", 1, "B_CONSENT") === true, "B_CONSENT_FAILED");
  check(await rpc(b.actor, "__FN_OPEN__", 1, "B_SINGLE") === false, "B_SINGLE_OPENS");
  check(await rpc(m.actor, "__FN_OPEN__", 1, "M_SINGLE") === false, "M_SINGLE_OPENS");
  pass("JWT_ONE_CONSENT_DENIED");

  check(await rpc(a.actor, "__FN_CONSENT__", 1, "A_CONSENT") === true, "A_CONSENT_FAILED");
  for (const [label, actor] of [["A", a.actor], ["B", b.actor], ["M", m.actor]]) {
    check(await rpc(actor, "__FN_OPEN__", 1, label + "_OPEN") === true, label + "_TWO_CONSENTS_DENIED");
  }
  check(await rpc(x.actor, "__FN_OPEN__", 1, "X_OPEN") === false, "X_OPEN_UNAUTHORIZED");
  pass("JWT_TWO_CONSENTS_ONLY_PARTICIPANTS");

  for (const caseId of [2, 3]) {
    check(await rpc(m.actor, "__FN_OPEN__", caseId, "M_CLOSED") === false, "CLOSED_OR_BLOCKED_OPEN");
    check(await rpc(a.actor, "__FN_CONSENT__", caseId, "A_CLOSED") === false, "CLOSED_OR_BLOCKED_CONSENT");
  }
  pass("JWT_CLOSED_BLOCKED_DENIED");

  const anonymous = client(anonKey);
  const denied = await anonymous.rpc(names.__FN_OPEN__, { p_case: 1 });
  check(Boolean(denied.error) &&
    (denied.status === 401 || denied.status === 403 || denied.error.code === "42501"),
    "ANON_RPC_NOT_VERIFIABLY_DENIED");
  pass("JWT_ANON_DENIED");

  // Once one parent withdraws, existing valid JWTs can no longer open.
  check(await rpc(a.actor, "__FN_WITHDRAW__", 1, "A_WITHDRAW") === true, "A_WITHDRAW_FAILED");
  for (const [label, actor] of [["A", a.actor], ["B", b.actor], ["M", m.actor]]) {
    check(await rpc(actor, "__FN_OPEN__", 1, label + "_AFTER") === false, label + "_OPEN_AFTER_WITHDRAW");
  }
  check(await rpc(b.actor, "__FN_CONSENT__", 1, "B_RETRY") === false, "RECONSENT_AFTER_WITHDRAW");
  pass("JWT_WITHDRAW_REVOKES_VALID_SESSIONS");

  // Caso indipendente: anche B puo' interrompere unilateralmente.
  // In questa seconda istanza nessun precedente consenso e' riutilizzato.
  check(await rpc(m.actor, "__FN_OPEN__", 4, "M_NEW_CASE") === false,
    "NEW_CASE_INHERITS_OLD_CONSENT");
  check(await rpc(a.actor, "__FN_CONSENT__", 4, "A_NEW_CASE_CONSENT") === true,
    "NEW_CASE_A_CONSENT_FAILED");
  check(await rpc(b.actor, "__FN_OPEN__", 4, "B_NEW_CASE_SINGLE") === false,
    "NEW_CASE_SINGLE_CONSENT_OPENS");
  check(await rpc(b.actor, "__FN_CONSENT__", 4, "B_NEW_CASE_CONSENT") === true,
    "NEW_CASE_B_CONSENT_FAILED");
  check(await rpc(m.actor, "__FN_OPEN__", 4, "M_NEW_CASE_OPEN") === true,
    "NEW_CASE_TWO_CONSENTS_DENIED");
  check(await rpc(m.actor, "__FN_WITHDRAW__", 4, "M_NEW_CASE_WITHDRAW") === false,
    "MEDIATOR_CAN_WITHDRAW");
  check(await rpc(x.actor, "__FN_WITHDRAW__", 4, "X_NEW_CASE_WITHDRAW") === false,
    "OUTSIDER_CAN_WITHDRAW");
  check(await rpc(b.actor, "__FN_WITHDRAW__", 4, "B_NEW_CASE_WITHDRAW") === true,
    "B_CANNOT_WITHDRAW");
  for (const [label, actor] of [["A", a.actor], ["B", b.actor], ["M", m.actor]]) {
    check(await rpc(actor, "__FN_OPEN__", 4, label + "_NEW_CASE_AFTER") === false,
      label + "_OPEN_AFTER_B_WITHDRAW");
  }
  check(await rpc(a.actor, "__FN_CONSENT__", 4, "A_NEW_CASE_RETRY") === false,
    "A_CAN_REOPEN_AFTER_B_WITHDRAW");
  check(await rpc(b.actor, "__FN_WITHDRAW__", 4, "B_NEW_CASE_REPEAT") === false,
    "B_WITHDRAW_REPEAT_NOT_IDEMPOTENT");
  pass("JWT_WITHDRAW_BY_EITHER_PARTICIPANT");
}

async function cleanup() {
  let ok = true;
  if (setupAttempted) {
    try {
      const sql = await sqlTemplate("gate21-jwt-ephemeral-cleanup.sql");
      sqlThroughDocker(sql, "GATE21_JWT_FIXTURE_CLEAN=PASS");
    } catch { ok = false; }
  }
  for (const id of createdIds) {
    try {
      const res = await admin.auth.admin.deleteUser(id);
      if (res.error) ok = false;
    } catch { ok = false; }
  }
  // No reading others' data. Check only IDs created by this process.
  if (createdIds.length) {
    try {
      const r = await admin.from("profili")
        .select("id", { count: "exact", head: true }).in("id", createdIds);
      if (r.error || r.count !== 0) ok = false;
    } catch { ok = false; }
  }
  return ok;
}

try {
  await run();
} catch (e) {
  const code = typeof e?.message === "string" && /^[A-Z0-9_]{1,80}$/.test(e.message)
    ? e.message : "UNEXPECTED";
  process.stderr.write("FAIL GATE21_JWT_PHASE=" + phase + "\n");
  process.stderr.write("GATE21_JWT_ERROR_CODE=" + code + "\n");
  process.exitCode = 1;
} finally {
  const cleaned = await cleanup();
  process.stdout.write("GATE21_JWT_CLEANUP=" + (cleaned ? "PASS" : "FAIL") + "\n");
  if (!cleaned) process.exitCode = 1;
  process.stdout.write("GATE21_JWT_E2E=" + (process.exitCode ? "FAIL" : "PASS") + "\n");
}
