import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = async (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("baseline Supabase sintetica è isolata dalle migrazioni distribuibili", async () => {
  const baseline = await read("scripts/local-only/20260910_lm360_core_lab.sql");
  const prepare = await read("scripts/local-only/prepare-fase2-lab.ps1");
  assert.match(baseline, /NON È una migrazione da pubblicare/);
  assert.match(prepare, /LM360_FASE2_LAB/);
  assert.match(prepare, /integration\/quality-gate-20261112/);
  assert.match(prepare, /LOCAL_BASELINE_EXISTS_WITH_DIFFERENT_CONTENT/);
  assert.match(prepare, /\.git\\info\\exclude/);
  assert.match(prepare, /20260910_lm360_core_lab.sql/);
  assert.doesNotMatch(prepare, /^\s*(?:npx\s+(?:--yes\s+)?|&\s*)?supabase\s+(start|link|db\s+push|db\s+dump|migration\s+up)/im);
  assert.doesNotMatch(baseline, /create\s+schema\s+auth|create\s+role\s+(authenticated|anon)|create\s+table\s+auth\.users/i);
});

test("baseline conserva i contratti minimi del frontend e di Stanza 360", async () => {
  const baseline = await read("scripts/local-only/20260910_lm360_core_lab.sql");
  const stanza = await read("supabase/migrations/20260911_stanza_360.sql");
  for (const name of ["profili", "profili_foto", "likes", "match_scores", "messaggi"]) {
    assert.match(baseline, new RegExp("create table public\\." + name + "\\b"));
    assert.match(baseline, new RegExp("alter table public\\." + name + " enable row level security"));
  }
  for (const column of ["profilo_pubblico", "status_account", "user_from", "user_to", "testo", "letto", "inviato_il"]) {
    assert.ok(baseline.includes(column), "Missing baseline column: " + column);
  }
  assert.match(baseline, /lm360_get_public_profiles\(p_profile_id uuid default null\)/);
  assert.match(baseline, /lm360_lab_match_after_like/);
  assert.match(stanza, /insert into public\.messaggi \(mittente_id, destinatario_id, testo, letto\)/);
});

test("nessun browser può inserire match o messaggi direttamente tramite baseline", async () => {
  const baseline = await read("scripts/local-only/20260910_lm360_core_lab.sql");
  const stanza = await read("supabase/migrations/20260911_stanza_360.sql");
  assert.match(baseline, /grant select on public\.match_scores to authenticated/);
  assert.doesNotMatch(baseline, /grant (?:all|insert|update|delete)[^;]* on public\.match_scores to authenticated/i);
  assert.match(baseline, /grant select on public\.messaggi to authenticated/);
  assert.doesNotMatch(baseline, /grant insert on public\.messaggi to authenticated/i);
  assert.match(stanza, /revoke insert on public\.messaggi from authenticated/);
  assert.match(baseline, /user_id = \(select auth\.uid\(\)\)/);
});
