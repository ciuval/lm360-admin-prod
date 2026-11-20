import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const scriptFile = new URL("../scripts/local-only/enable-fase2-realtime.ps1", import.meta.url);
const scriptText = async () => readFile(scriptFile, "utf8");

test("Realtime locale richiede LAB, branch, DB corretto e porte isolate", async () => {
  const script = await scriptText();
  for (const literal of [
    "I:\\lm360-clean\\LM360_FASE2_LAB",
    "integration/quality-gate-20261112",
    "LAB_CONFIG_NOT_FOUND",
    "LAB_BRANCH_MISMATCH",
    "LOCAL_DOCKER_PORTS_NOT_ISOLATED",
    "LOCAL_DB_CONTAINER_IDENTITY_MISMATCH",
    "127\\.0\\.0\\.1:54321->",
    "com.supabase.cli.project",
    "LM360_FASE2_LAB",
  ]) assert.ok(script.includes(literal), "Missing isolation guard: " + literal);
});

test("il database deve essere gia protetto prima di pubblicare eventi", async () => {
  const script = await scriptText();
  const sql = script.match(/\$sql = @'([\s\S]*?)'@/);
  assert.ok(sql, "embedded transactional SQL");
  for (const expression of [
    "c.relrowsecurity",
    "has_table_privilege('authenticated','public.messaggi','SELECT')",
    "has_table_privilege('anon','public.messaggi','SELECT')",
    "policyname='messaggi_read_participants'",
    "roles = array['authenticated']::name[]",
    "qual like '%auth.uid()%'",
    "qual like '%mittente_id%'",
    "qual like '%destinatario_id%'",
    "pubname='supabase_realtime' and not puballtables",
  ]) assert.ok(sql[1].includes(expression), "Missing RLS guard: " + expression);
});

test("consente solo ALTER PUBLICATION della tabella messaggi; rollback idempotente", async () => {
  const script = await scriptText();
  assert.match(script, /param\(\[switch\]\$Rollback\)/);
  assert.match(script, /if \(\$Rollback\) \{ 'DROP' \} else \{ 'ADD' \}/);
  assert.match(script, /if 'LM360_ACTION' = 'ADD' and not is_published then/);
  assert.match(script, /elsif 'LM360_ACTION' = 'DROP' and is_published then/);
  assert.match(script, /alter publication supabase_realtime add table public\.messaggi/);
  assert.match(script, /alter publication supabase_realtime drop table public\.messaggi/);
  assert.match(script, /LOCAL_REALTIME_PUBLICATION_POSTCHECK_FAILED/);
  assert.doesNotMatch(script, /\b(?:supabase\s+(?:link|db\s+(?:reset|push))|revoke\s+select|grant\s+select|alter\s+table\s+public\.messaggi)\b/i);
  const sql = script.match(/\$sql = @\'([\s\S]*?)\'@/);
  assert.ok(sql);
  assert.doesNotMatch(sql[1], /\b(?:testo|message_content|email|password|service_role_key)\b/i);
});
