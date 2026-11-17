import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = "../scripts/";
const read = async (p) => readFile(new URL(root + p, import.meta.url), "utf8");
const code = "e2e-gate21-jwt-consent-local.mjs";
const setupFile = "local-only/gate21-jwt-ephemeral-setup.sql";
const cleanFile = "local-only/gate21-jwt-ephemeral-cleanup.sql";
const runner = "local-only/run-gate21-jwt-consent-local.ps1";

test("JWT consent probe has valid Node syntax and is never auto-run by npm scripts", async () => {
  const result = spawnSync(process.execPath, [
    "--check", fileURLToPath(new URL(root + code, import.meta.url)),
  ], { encoding: "utf8" });
  assert.equal(result.status, 0, "Invalid Node syntax");
  const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(Object.values(pkg.scripts).some((cmd) => cmd.includes(code)), false);
});

test("JWT probe is local-only, uses 4 fresh auth identities and no user data", async () => {
  const src = await read(code);
  for (const marker of [
    "assertLocalE2eUrl", "LM360_GATE21_JWT_LOCAL_GUARD",
    "supabase_db_LM360_FASE2_LAB", "admin.auth.admin.createUser",
    "auth.signInWithPassword", "actor.auth.getUser",
    "@example.test", "admin.auth.admin.deleteUser",
    "createdIds", "finally", "GATE21_JWT_CLEANUP=",
  ]) assert.ok(src.includes(marker), "Missing marker " + marker);
  assert.doesNotMatch(src, /VITE_SUPABASE_|console\.(log|error|warn)|supabase\.co|db reset/i);
  assert.doesNotMatch(src, /admin\.from\("messaggi"\)|\.from\("likes"\)|\.from\("match_scores"\)/);
  assert.doesNotMatch(src, /\bexecSync\s*\(|shell:\s*true/);
});

test("ephemeral fixture has unique namespace, explicit grants, identity checks and cleanup", async () => {
  const setup = await read(setupFile);
  const clean = await read(cleanFile);
  for (const token of [
    "__SCHEMA__", "__FN_CONSENT__", "__FN_OPEN__", "__FN_WITHDRAW__",
  ]) {
    assert.ok(setup.includes(token));
    assert.ok(clean.includes(token));
  }
  assert.match(setup, /create schema __SCHEMA__;/);
  assert.match(setup, /alter table __SCHEMA__\.consents enable row level security;/);
  assert.match(setup, /revoke all on __SCHEMA__\.consents from public, anon, authenticated;/);
  assert.match(setup, /auth\.uid\(\)/);
  assert.match(setup, /s\.user_a = caller or s\.user_b = caller/);
  assert.match(setup, /s\.accepted_a and s\.accepted_b/);
  assert.match(setup, /not \(s\.ended or s\.closed or s\.blocked\)/);
  assert.match(setup, /revoke all on function public\.__FN_CONSENT__\(bigint\) from public, anon, authenticated;/);
  assert.match(setup, /grant execute on function public\.__FN_CONSENT__\(bigint\) to authenticated;/);
  assert.match(setup, /notify pgrst, 'reload schema';/);
  assert.match(clean, /drop function if exists public\.__FN_CONSENT__\(bigint\);/);
  assert.match(clean, /execute 'drop schema __SCHEMA__';/);
  assert.doesNotMatch(clean, /\bcascade\b/i);
  assert.doesNotMatch(setup, /(?:create|alter|drop)\s+table\s+public\./i);
  assert.doesNotMatch(setup + clean, /(?:grant|revoke)\s+(?:all|select|update|insert)\s+on\s+public\.messaggi/i);
});

test("real JWT probe verifies one consent, two consents, outsider, anon, blocked, revocation", async () => {
  const src = await read(code);
  for (const code of [
    "JWT_THIRD_PARTY_NO_CONSENT", "JWT_ONE_CONSENT_DENIED",
    "JWT_TWO_CONSENTS_ONLY_PARTICIPANTS", "JWT_CLOSED_BLOCKED_DENIED",
    "JWT_ANON_DENIED", "JWT_WITHDRAW_REVOKES_VALID_SESSIONS",
    "GATE21_JWT_E2E=", "RPC_SCHEMA_CACHE_UNAVAILABLE",
  ]) assert.ok(src.includes(code), "Missing check " + code);
  assert.match(src, /dataOf\(await actor\.auth\.getUser/);
  assert.match(src, /await rpc\(m\.actor, "__FN_CONSENT__"/);
  assert.match(src, /await rpc\(b\.actor, "__FN_OPEN__"/);
  assert.match(src, /await rpc\(a\.actor, "__FN_WITHDRAW__"/);
});

test("Windows runner verifies Docker identity, checks for leftovers, protects local env", async () => {
  const ps = await read(runner);
  for (const marker of [
    "I:\\lm360-clean\\LM360_FASE2_LAB", "integration/quality-gate-20261112",
    "LM360_FASE2_LAB", "com.supabase.cli.project",
    "127\\.0\\.0\\.1:54321->", "docker inspect $db",
    "GATE21_JWT_NO_PREEXISTING_FIXTURE=PASS",
    "supabase status -o env", "Remove-Item -Path",
  ]) assert.ok(ps.includes(marker), "Missing guard " + marker);
  assert.doesNotMatch(ps, /supabase (?:link|db push|db reset)|docker system prune|docker volume rm/i);
});
