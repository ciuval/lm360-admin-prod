import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const file = () => readFile(
  new URL("../scripts/local-only/check-gate21-readonly.ps1", import.meta.url),
  "utf8"
);

test("gate 2.1: preflight confinato al LAB e metadati soltanto", async () => {
  const src = await file();
  assert.match(src, /LM360_FASE2_LAB/);
  assert.match(src, /integration\/quality-gate-20261112/);
  assert.match(src, /LOCAL_DOCKER|GATE21_DOCKER_NOT_ISOLATED/);
  assert.match(src, /127\\\.0\\\.0\\\.1:54321/);
  assert.match(src, /docker inspect \$dbName/);
  assert.match(src, /com\.supabase\.cli\.project/);
  assert.match(src, /pg_trigger/);
  assert.match(src, /pg_policies/);
  assert.match(src, /has_table_privilege/);
  assert.match(src, /to_regprocedure/);
  assert.match(src, /GATE21_METADATA_READ_ONLY=COMPLETE/);
  assert.match(src, /GATE21_REVOCATION_E2E=NOT_TESTED/);
  assert.doesNotMatch(src, /supabase\.co|supabase\.com\/dashboard|service_role_key|SERVICE_ROLE_KEY/i);
});

test("gate 2.1: nessuna istruzione mutante nella query metadata-only", async () => {
  const src = await file();
  const match = src.match(/\$sql = @'\r?\n([\s\S]*?)\r?\n'@/);
  assert.ok(match, "SQL heredoc not found");
  const sql = match[1].replace(/--[^\n]*/g, " ");
  assert.match(sql, /select label \|\| '='/i);
  assert.doesNotMatch(sql, /\b(insert|update|delete|alter|drop|truncate|create|grant|revoke|execute|call)\b\s+(into\s+|table\s+|from\s+|on\s+|function\s+|policy\s+|role\s+|public\.)/i);
  for (const name of [
    "LIKES_RLS", "LIKES_DELETE_GRANT", "LIKES_DELETE_POLICY",
    "LIKES_DELETE_TRIGGER", "MATCH_RLS", "MATCH_DIRECT_WRITE_GRANT",
    "MESSAGGI_RLS", "MESSAGGI_READ_POLICY", "MESSAGGI_DIRECT_INSERT_GRANT",
    "CAN_OPEN_STANZA_RPC", "SEND_STANZA_MESSAGE_RPC"
  ]) {
    assert.match(sql, new RegExp("'"+name+"'"));
  }
});
