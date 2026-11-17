import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const file = async () => readFile(
  new URL("../scripts/local-only/apply-gate21-unlike-guard-lab.ps1", import.meta.url),
  "utf8"
);

test("gate 2.1 local patch: confined to Docker LAB and guarded before SQL", async () => {
  const s = await file();
  assert.match(s, /LM360_FASE2_LAB/);
  assert.match(s, /integration\/quality-gate-20261112/);
  assert.match(s, /127\\\.0\\\.0\\\.1:54321/);
  assert.match(s, /docker inspect \$dbName/);
  assert.match(s, /GATE21_DOCKER_NOT_ISOLATED/);
  assert.match(s, /GATE21_DB_IDENTITY_MISMATCH/);
  assert.match(s, /GATE21_RLS_PRECONDITION/);
  assert.match(s, /GATE21_GRANT_PRECONDITION/);
  assert.match(s, /GATE21_RPC_PRECONDITION/);
  assert.doesNotMatch(s, /supabase\.co|supabase\.com\/dashboard/i);
  const commands = s.split("\n").filter(line => !line.trimStart().startsWith("#")).join("\n");
  assert.doesNotMatch(commands, /\bsupabase\s+(?:link|db\s+(?:reset|push))\b/i);
});

test("gate 2.1 local patch: revoke atomically, hide history via RLS, rollback available", async () => {
  const s = await file();
  assert.match(s, /create function public\.lm360_lab_revoke_match_after_unlike/);
  assert.match(s, /after delete on public\.likes/i);
  assert.match(s, /update public\.match_scores[\s\S]*set score = 0/i);
  assert.match(s, /revoke all on function public\.lm360_lab_revoke_match_after_unlike\(\)/i);
  assert.match(s, /security definer[\s\S]*set search_path = ''/i);
  assert.match(s, /alter policy messaggi_read_participants on public\.messaggi/);
  assert.match(s, /and exists \([\s\S]*from public\.match_scores ms[\s\S]*ms\.score = 100/);
  assert.match(s, /param\(\[switch\]\$Rollback\)/);
  assert.match(s, /drop trigger lm360_lab_revoke_after_unlike on public\.likes/);
  assert.doesNotMatch(s, /delete\s+from\s+public\.messaggi|truncate\s+public\.messaggi/i);
});
