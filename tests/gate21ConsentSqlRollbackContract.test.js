import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const sqlFile = new URL("../scripts/local-only/gate21-consent-rollback.sql", import.meta.url);
const psFile = new URL("../scripts/local-only/run-gate21-consent-rollback.ps1", import.meta.url);

test("Gate 2.1 consent SQL is isolated, transactional and strictly rollback-only", async () => {
  const sql = await readFile(sqlFile, "utf8");
  assert.match(sql, /^begin;\s*$/im);
  assert.match(sql, /^rollback;\s*$/im);
  assert.doesNotMatch(sql, /^\s*commit\s*;/im);
  assert.match(sql, /create schema lm360_gate21_consent_probe;/);
  assert.match(sql, /to_regnamespace\('lm360_gate21_consent_probe'\) is null/);
  assert.match(sql, /GATE21_CONSENT_SQL_SIMULATION=PASS/);
  assert.doesNotMatch(sql, /^(?:create|alter|drop|truncate|delete|update|insert)\s+(?:table|from|into|on)\s+public\./im);
  assert.doesNotMatch(sql, /supabase db push|supabase db reset|supabase\.co|service_role/i);
});

test("Gate 2.1 consent SQL covers two distinct decisions, revoked consent and no outsider access", async () => {
  const sql = await readFile(sqlFile, "utf8");
  for (const name of ["consent", "withdraw", "can_open"]) {
    assert.match(sql, new RegExp("create function lm360_gate21_consent_probe\\." + name + "\\("));
    assert.match(sql, new RegExp("revoke all on function lm360_gate21_consent_probe\\." + name + "\\(bigint\\) from public, anon, authenticated;"));
    assert.match(sql, new RegExp("grant execute on function lm360_gate21_consent_probe\\." + name + "\\(bigint\\) to authenticated;"));
  }
  assert.match(sql, /auth\.uid\(\)/);
  assert.match(sql, /s\.user_a = who or s\.user_b = who/);
  assert.match(sql, /s\.consent_a and s\.consent_b/);
  assert.match(sql, /not \(s\.ended or s\.closed or s\.blocked\)/);
  for (const marker of [
    "GATE21_MEDIATOR_PRECONSENT_FAILED", "GATE21_OUTSIDER_FAILED",
    "GATE21_ONE_CONSENT_FAILED", "GATE21_TWO_CONSENTS_FAILED",
    "GATE21_MEDIATOR_AFTER_FAILED", "GATE21_REVOKE_FAILED",
    "GATE21_B_AFTER_REVOKE_FAILED", "GATE21_MEDIATOR_REVOKE_FAILED",
  ]) assert.ok(sql.includes(marker));
  // Simulated claims must never print even synthetic UUIDs.
  assert.equal((sql.match(/as claim_value \\gset/g) || []).length, 8);
});

test("Gate 2.1 PowerShell runner is restricted to its own LAB and verifies rollback", async () => {
  const ps = await readFile(psFile, "utf8");
  assert.match(ps, /integration\/quality-gate-20261112/);
  assert.match(ps, /127\\\.0\\\.0\\\.1:54321/);
  assert.match(ps, /com\.supabase\.cli\.project/);
  assert.match(ps, /docker inspect \$db/);
  assert.match(ps, /git -C \$lab status --porcelain/);
  assert.match(ps, /docker exec -i \$db psql/);
  assert.match(ps, /ON_ERROR_STOP=1/);
  assert.match(ps, /GATE21_LOCAL_SCHEMA_CLEAN=PASS/);
  assert.match(ps, /GATE21_CONSENT_AUTH_JWT_E2E=NOT_TESTED/);
  assert.doesNotMatch(ps, /supabase (?:db push|db reset|link)|VITE_SUPABASE_|SERVICE_ROLE_KEY/i);
});
