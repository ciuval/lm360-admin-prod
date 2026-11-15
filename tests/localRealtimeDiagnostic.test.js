import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const diagnosticFile = new URL("../scripts/local-only/check-fase2-realtime.ps1", import.meta.url);
const fixtureFile = new URL("../scripts/local-only/20260910_lm360_core_lab.sql", import.meta.url);
const read = async file => readFile(file, "utf8");

test("la diagnosi Realtime verifica identità Docker, isolamento e solo metadata", async () => {
  const script = await read(diagnosticFile);
  for (const required of [
    "LAB_BRANCH_MISMATCH",
    "LOCAL_DOCKER_PORTS_NOT_ISOLATED",
    "LOCAL_DB_CONTAINER_IDENTITY_MISMATCH",
    "supabase_db_LM360_FASE2_LAB",
    "pg_publication_tables",
    "PUBLICATION=",
    "MESSAGGI_PUBLISHED=",
    "MESSAGGI_RLS=",
    "MESSAGGI_SELECT_GRANT=",
    "MESSAGGI_SELECT_POLICY=",
    "REALTIME_CONTAINER=",
    "READ_ONLY_DIAGNOSTIC_COMPLETED",
  ]) assert.ok(script.includes(required), "Missing safety diagnostic " + required);
});

test("diagnostica Realtime read-only, nessuna scrittura o lettura PII", async () => {
  const script = await read(diagnosticFile);
  const sql = script.match(/\$sql = @'([\s\S]*?)'@/);
  assert.ok(sql, "read-only SQL block");
  assert.match(sql[1].trim(), /^select\s/i);
  assert.doesNotMatch(sql[1], /\b(?:alter|update|delete|insert|drop|truncate|grant|revoke|create|pg_notify)\b/i);
  assert.doesNotMatch(sql[1], /\b(?:testo|email|password|token|jwt|secret|user_id|mittente_id|destinatario_id)\b/i);
  assert.doesNotMatch(script, /\b(?:supabase\s+(?:db\s+push|link|db\s+reset)|docker\s+exec.*(?:bash|sh)\s+-c)\b/i);
});

test("la baseline del LAB non abilita Realtime implicitamente", async () => {
  const fixture = await read(fixtureFile);
  assert.match(fixture, /Realtime e typing non sono ancora coperti/);
  assert.doesNotMatch(fixture, /alter\s+publication\s+supabase_realtime\s+add\s+table\s+public\.messaggi/i);
});
