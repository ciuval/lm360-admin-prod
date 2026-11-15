import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = path => readFile(new URL("../" + path, import.meta.url), "utf8");

test("the local-only profile fixture satisfies the auth tier select contract", async () => {
  const fixture = await read("scripts/local-only/20260910_lm360_core_lab.sql");
  const tier = await read("src/lib/accountTier.js");
  const select = tier.match(/\.from\("profili"\)\s*\.select\("([^"]+)"\)/s);
  assert.ok(select, "Account tier profile projection not found");
  for (const column of select[1].split(",").map(s=>s.trim())) {
    assert.match(fixture, new RegExp("\\b" + column + "\\b\\s+(?:uuid|text|boolean|timestamptz)\\b"),
      "Local profile fixture missing auth field " + column);
  }
});

test("local-only profile repair verifies isolation, exact fixture and schema reload", async () => {
  const file = await read("scripts/local-only/fix-fase2-profile-session.ps1");
  for (const needle of [
    "LM360_FASE2_LAB",
    "LAB_BRANCH_MISMATCH",
    "LOCAL_DOCKER_PORTS_NOT_ISOLATED",
    "LOCAL_DB_CONTAINER_IDENTITY_MISMATCH",
    "LAB_MIGRATION_MODIFIED_STOP",
    "ADD COLUMN IF NOT EXISTS stripe_customer_id text",
    "NOTIFY pgrst, 'reload schema'",
    "PASS_PROFILE_TIER_COLUMN",
  ]) assert.ok(file.includes(needle), "Missing safety gate: " + needle);
  assert.doesNotMatch(file, /https?:\/\/[^'"\s]*supabase\.co/i);
  assert.doesNotMatch(file, /^\s*(?:npx\s+)?supabase\s+(?:link|db\s+push|db\s+reset|migration\s+up)/im);
  assert.doesNotMatch(file, /Write-Host.*(?:password|secret|token|key)/i);
});
