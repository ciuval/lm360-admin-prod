/**
 * Gate 2.1 concurrency probe: isolated SQL-only synthetic state, NO real app rows.
 * Run ONLY via scripts/local-only/run-gate21-race-local.ps1.
 * No cloud, Auth, messages, profiles, tokens, reset or deploy.
 */
import { randomBytes } from "node:crypto";
import { spawn, spawnSync } from "node:child_process";

if (process.env.LM360_GATE21_RACE_LOCAL_GUARD !== "YES") {
  throw new Error("GATE21_RACE_GUARD_REQUIRED");
}
const db = "supabase_db_LM360_FASE2_LAB";
const suffix = randomBytes(6).toString("hex");
const schema = "lm360_gate21_race_" + suffix;
const sessions = [];
let fixtureAttempted = false;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sqlName = /^[a-z_][a-z0-9_]*$/;
if (!sqlName.test(schema)) throw new Error("GATE21_RACE_BAD_IDENTIFIER");

function once(sql) {
  const result = spawnSync("docker", [
    "exec", "-i", db, "psql", "-X", "-q", "-A", "-t",
    "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1",
  ], { input: sql + "\n", encoding: "utf8", timeout: 15000, maxBuffer: 65536 });
  if (result.error || result.status !== 0) throw new Error("GATE21_RACE_SQL_FAILED");
  return (result.stdout || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}
function requireMarker(lines, marker) {
  if (!lines.includes(marker)) throw new Error("GATE21_RACE_" + marker + "_MISSING");
}
function session(role) {
  const process = spawn("docker", [
    "exec", "-i", db, "psql", "-X", "-q", "-A", "-t",
    "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1",
  ], { stdio: ["pipe", "pipe", "pipe"] });
  const seen = new Set();
  const listeners = new Map();
  let buffer = "";
  let closed = false;
  process.stderr.resume(); // No SQL/provider details printed.
  process.stdout.on("data", (chunk) => {
    buffer += chunk.toString("utf8");
    let boundary;
    while ((boundary = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 1);
      seen.add(line);
      if (listeners.has(line)) {
        for (const done of listeners.get(line)) done.resolve();
        listeners.delete(line);
      }
    }
  });
  const failPending = () => {
    closed = true;
    for (const waiters of listeners.values()) {
      for (const done of waiters) done.reject(new Error("GATE21_RACE_SESSION_CLOSED"));
    }
    listeners.clear();
  };
  process.on("error", failPending);
  process.on("close", failPending);
  const result = {
    send(sql) {
      if (closed || process.stdin.destroyed) throw new Error("GATE21_RACE_SESSION_UNAVAILABLE");
      process.stdin.write(sql + "\n");
    },
    wait(marker) {
      if (seen.has(marker)) return Promise.resolve();
      if (closed) return Promise.reject(new Error("GATE21_RACE_SESSION_CLOSED"));
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          const pending = listeners.get(marker) || [];
          listeners.set(marker, pending.filter((item) => item !== entry));
          reject(new Error("GATE21_RACE_TIMEOUT"));
        }, 12000);
        const entry = {
          resolve() { clearTimeout(timer); resolve(); },
          reject(error) { clearTimeout(timer); reject(error); },
        };
        if (!listeners.has(marker)) listeners.set(marker, []);
        listeners.get(marker).push(entry);
      });
    },
    async stop() {
      if (!closed) {
        process.stdin.end("ROLLBACK;\n\\q\n");
        await Promise.race([
          new Promise((resolve) => process.once("close", resolve)),
          sleep(1000),
        ]);
        if (!closed) process.kill();
      }
    },
  };
  sessions.push(result);
  result.send("SET application_name = 'lm360_race_" + suffix + "_" + role + "';\n" +
              "SET lock_timeout = '10s';\nSELECT '" + role + "_READY';");
  return result;
}
async function waitForBlocked(role) {
  const app = "lm360_race_" + suffix + "_" + role;
  for (let attempt = 0; attempt < 35; attempt++) {
    const lines = once("select case when exists (" +
      "select 1 from pg_catalog.pg_stat_activity " +
      "where application_name='" + app + "' and wait_event_type='Lock')" +
      "then 'LOCKED' else 'NOT_LOCKED' end;");
    if (lines.includes("LOCKED")) return;
    await sleep(80);
  }
  throw new Error("GATE21_RACE_NOT_CONTENDED");
}
function operation(caseId, allowed, denied) {
  return "with moved as (update " + schema + ".state " +
    "set completed=completed+1 where case_id=" + caseId +
    " and consent=true returning 1) select case when exists(select 1 from moved) " +
    "then '" + allowed + "' else '" + denied + "' end;";
}
function verify(caseId, consent, completed) {
  const sql = "select case when exists(select 1 from " + schema +
    ".state where case_id=" + caseId +
    " and consent=" + (consent ? "true" : "false") +
    " and completed=" + completed + ") then 'STATE_OK' else 'STATE_BAD' end;";
  requireMarker(once(sql), "STATE_OK");
}
async function main() {
  requireMarker(once(
    "select case when not exists(select 1 from pg_catalog.pg_namespace " +
    "where nspname like 'lm360_gate21_race_%') " +
    "then 'PREFLIGHT_OK' else 'PREFLIGHT_BAD' end;"
  ), "PREFLIGHT_OK");
  fixtureAttempted = true;
  requireMarker(once([
    "begin;",
    "create schema " + schema + ";",
    "revoke all on schema " + schema + " from public, anon, authenticated;",
    "create table " + schema + ".state (case_id integer primary key, consent boolean not null, completed integer not null);",
    "alter table " + schema + ".state enable row level security;",
    "revoke all on " + schema + ".state from public, anon, authenticated;",
    "insert into " + schema + ".state values (1,true,0),(2,true,0);",
    "commit;",
    "select 'FIXTURE_READY';",
  ].join("\n")), "FIXTURE_READY");

  // Ordering A: withdrawal holds the row lock before operation is attempted.
  const withdrawal = session("withdrawal");
  const operationSession = session("operation");
  await Promise.all([withdrawal.wait("withdrawal_READY"), operationSession.wait("operation_READY")]);
  withdrawal.send("begin;\nupdate " + schema + ".state set consent=false where case_id=1;\nselect 'A_WITHDRAW_LOCKED';");
  await withdrawal.wait("A_WITHDRAW_LOCKED");
  operationSession.send("begin;\n" + operation(1, "A_ALLOWED_BAD", "A_DENIED") );
  await waitForBlocked("operation");
  withdrawal.send("commit;\nselect 'A_WITHDRAW_COMMITTED';");
  await withdrawal.wait("A_WITHDRAW_COMMITTED");
  await operationSession.wait("A_DENIED");
  operationSession.send("commit;\nselect 'A_OPERATION_DONE';");
  await operationSession.wait("A_OPERATION_DONE");
  verify(1, false, 0);
  process.stdout.write("PASS RACE_WITHDRAWAL_FIRST_DENIES_OPERATION\n");

  // Ordering B: authorized operation holds the row lock; withdrawal waits.
  operationSession.send("begin;\n" + operation(2, "B_ALLOWED", "B_DENIED_BAD"));
  await operationSession.wait("B_ALLOWED");
  withdrawal.send("begin;\nupdate " + schema + ".state set consent=false where case_id=2;\nselect 'B_WITHDRAW_UNLOCKED';");
  await waitForBlocked("withdrawal");
  operationSession.send("commit;\nselect 'B_OPERATION_COMMITTED';");
  await operationSession.wait("B_OPERATION_COMMITTED");
  await withdrawal.wait("B_WITHDRAW_UNLOCKED");
  withdrawal.send("commit;\nselect 'B_WITHDRAW_COMMITTED';");
  await withdrawal.wait("B_WITHDRAW_COMMITTED");
  verify(2, false, 1);
  operationSession.send(operation(2, "B_REOPEN_BAD", "B_NEW_OPERATION_DENIED"));
  await operationSession.wait("B_NEW_OPERATION_DENIED");
  verify(2, false, 1);
  process.stdout.write("PASS RACE_OPERATION_FIRST_REVOKES_BEFORE_NEXT_OPERATION\n");
}
async function cleanup() {
  for (const s of sessions) {
    try { await s.stop(); } catch { /* Keep cleanup moving. */ }
  }
  if (!fixtureAttempted) return true;
  try {
    requireMarker(once([
      "begin;",
      "drop table if exists " + schema + ".state;",
      "drop schema if exists " + schema + ";",
      "commit;",
      "select case when to_regnamespace('" + schema +
        "') is null then 'CLEANUP_OK' else 'CLEANUP_BAD' end;",
    ].join("\n")), "CLEANUP_OK");
    return true;
  } catch { return false; }
}
try {
  await main();
} catch {
  process.stderr.write("FAIL GATE21_RACE_TEST\n");
  process.exitCode = 1;
} finally {
  const clean = await cleanup();
  process.stdout.write("GATE21_RACE_CLEANUP=" + (clean ? "PASS" : "FAIL") + "\n");
  if (!clean) process.exitCode = 1;
  process.stdout.write("GATE21_RACE_E2E=" + (process.exitCode ? "FAIL" : "PASS") + "\n");
}
