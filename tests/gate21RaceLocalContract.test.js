import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const nodePath = new URL("../scripts/e2e-gate21-race-local.mjs", import.meta.url);
const runnerPath = new URL("../scripts/local-only/run-gate21-race-local.ps1", import.meta.url);
const read = (url) => readFile(url, "utf8");

test("Gate 2.1 race runner is restricted to existing isolated Docker LAB", async () => {
  const runner = await read(runnerPath);
  assert.match(runner, /LM360_FASE2_LAB/);
  assert.match(runner, /integration\/quality-gate-20261112/);
  assert.match(runner, /127\\\.0\\\.0\\\.1:54321/);
  assert.match(runner, /docker inspect \$db/);
  assert.match(runner, /com\.supabase\.cli\.project/);
  assert.match(runner, /read committed/);
  assert.match(runner, /GATE21_RACE_NO_STALE_FIXTURE=PASS/);
  assert.match(runner, /LM360_GATE21_RACE_LOCAL_GUARD/);
  assert.doesNotMatch(runner, /db reset|docker (?:system )?prune|supabase\.co|SERVICE_ROLE_KEY/i);
});

test("Gate 2.1 race probe is syntactically valid and cannot run in npm test", async () => {
  const src = await read(nodePath);
  const syntax = spawnSync(process.execPath, ["--check", fileURLToPath(nodePath)], {
    encoding: "utf8", timeout: 10000,
  });
  assert.equal(syntax.status, 0, "race script syntax");
  assert.match(src, /LM360_GATE21_RACE_LOCAL_GUARD/);
  assert.match(src, /lm360_gate21_race_/);
  assert.match(src, /create schema/);
  assert.match(src, /enable row level security/);
  assert.match(src, /revoke all/);
  assert.match(src, /drop schema if exists/);
  assert.match(src, /GATE21_RACE_CLEANUP=/);
  assert.doesNotMatch(src, /service_role|auth\.admin|https?:\/\/|supabase\.co|public\.(?:profili|messaggi|likes|match_scores)/i);
});

test("Gate 2.1 race scenarios require real contention and atomic state checks", async () => {
  const src = await read(nodePath);
  assert.match(src, /and consent=true returning 1/);
  assert.match(src, /waitForBlocked\("operation"\)/);
  assert.match(src, /waitForBlocked\("withdrawal"\)/);
  assert.match(src, /RACE_WITHDRAWAL_FIRST_DENIES_OPERATION/);
  assert.match(src, /RACE_OPERATION_FIRST_REVOKES_BEFORE_NEXT_OPERATION/);
  assert.match(src, /verify\(1, false, 0\)/);
  assert.match(src, /verify\(2, false, 1\)/);
  assert.match(src, /B_NEW_OPERATION_DENIED/);
  assert.match(src, /ROLLBACK;/);
});
