import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const file = () => readFile(
  new URL("../scripts/local-only/check-gate21-state-model-readonly.ps1", import.meta.url),
  "utf8"
);

test("gate 2.1 state audit runs only against isolated Docker LAB", async () => {
  const src = await file();
  assert.match(src, /LM360_FASE2_LAB/);
  assert.match(src, /integration\/quality-gate-20261112/);
  assert.match(src, /127\\\.0\\\.0\\\.1:54321/);
  assert.match(src, /docker inspect \$dbName/);
  assert.match(src, /com\.supabase\.cli\.project/);
  assert.match(src, /GATE21_DOCKER_NOT_ISOLATED/);
  assert.match(src, /GATE21_STATE_MODEL_METADATA_ONLY=COMPLETE/);
  assert.doesNotMatch(src, /supabase\.co|supabase\.com\/dashboard|SERVICE_ROLE_KEY|ANON_KEY/i);
});

test("gate 2.1 state audit queries catalog metadata only", async () => {
  const src = await file();
  const sqlMatch = src.match(/\$sql = @'\r?\n([\s\S]*?)\r?\n'@/);
  assert.ok(sqlMatch, "missing SQL here-string");
  const sql = sqlMatch[1];
  assert.match(sql, /pg_catalog\.pg_class/i);
  assert.match(sql, /pg_catalog\.pg_attribute/i);
  assert.match(sql, /pg_catalog\.pg_proc/i);
  assert.doesNotMatch(sql, /\b(insert|update|delete|alter|drop|truncate|create|grant|revoke|execute|call)\b\s+(into|from|table|on|function|policy|role|public\.)/i);
  assert.doesNotMatch(sql, /\bfrom\s+public\./i);
  for (const label of [
    "MATCH_PAIR_COLUMNS_COMPLETE", "LIKE_PAIR_COLUMNS_COMPLETE",
    "PAUSE_COLUMN_NAME_HINTS", "PAUSE_TABLE_NAME_HINTS",
    "CLOSURE_COLUMN_NAME_HINTS", "CLOSURE_TABLE_NAME_HINTS",
    "BLOCK_COLUMN_NAME_HINTS", "BLOCK_TABLE_NAME_HINTS",
    "REQUEST_COLUMN_NAME_HINTS", "REQUEST_TABLE_NAME_HINTS",
    "STATE_FUNCTION_NAME_HINTS"
  ]) assert.match(sql, new RegExp("'" + label + "'"));
});
