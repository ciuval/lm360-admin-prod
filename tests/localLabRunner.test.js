import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("PowerShell runner isolates local two-account testing from production", async () => {
  const ps = await readFile(new URL("../scripts/local-only/run-fase2-local.ps1", import.meta.url), "utf8");
  for (const expected of [
    "LM360_FASE2_LAB",
    "integration/quality-gate-20261112",
    "supabase\\config.toml",
    "127\\.0\\.0\\.1:54321->",
    "supabase status -o env",
    "LM360_LOCAL_SUPABASE_URL",
    "LM360_LOCAL_SUPABASE_ANON_KEY",
    "LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY",
    "npm ci --no-audit --no-fund",
    "npm run test:e2e:local",
    "Remove-Item",
    "Pop-Location",
  ]) {
    assert.ok(ps.includes(expected), "Missing local safety contract: " + expected);
  }
  assert.doesNotMatch(ps, /https?:\/\/[^'"\s]*supabase\.co/i);
  assert.doesNotMatch(ps, /^\s*(?:npx\s+)?supabase\s+(?:link|db\s+push|db\s+reset|migration\s+up)/im);
  assert.doesNotMatch(ps, /Write-Host\s+\$raw|Write-Host\s+\$keys|Out-Host/);
});

test("API test validates RPC permissions with actual authenticated test users", async () => {
  const source = await readFile(new URL("../scripts/e2e-two-accounts-local.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(source, /admin\.rpc\("get_stanza_compatibility"/);
  assert.doesNotMatch(source, /admin\.rpc\("lm360_get_public_profiles"/);
  assert.match(source, /a\.client\.rpc\("get_stanza_compatibility"/);
  assert.match(source, /reader\.client\.rpc\("lm360_get_public_profiles"/);
});
