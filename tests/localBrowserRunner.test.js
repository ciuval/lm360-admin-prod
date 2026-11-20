import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Vite browser preview can only use local Supabase and local web host", async () => {
  const ps = await readFile(new URL("../scripts/local-only/start-fase2-browser.ps1", import.meta.url), "utf8");
  for (const expected of [
    "LM360_FASE2_LAB", "integration/quality-gate-20261112",
    "supabase\\config.toml", "SUPABASE_LOCAL_ONLY_CHECK_FAILED",
    "127\\.0\\.0\\.1:54321->", "supabase status -o env 2>$null",
    "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY",
    "http://127.0.0.1:54321", "npm run dev -- --host 127.0.0.1 --port 5174 --strictPort",
    "Remove-Item Env:\\VITE_SUPABASE_URL", "Remove-Item Env:\\VITE_SUPABASE_ANON_KEY"
  ]) {
    assert.ok(ps.includes(expected), "Missing local-only browser contract: " + expected);
  }
  assert.doesNotMatch(ps, /\$env:VITE_SUPABASE_SERVICE_ROLE/);
  assert.doesNotMatch(ps, /^\s*(?:Write-Host|Write-Output)\s+\$anonKey/im);
  assert.doesNotMatch(ps, /https?:\/\/[^'"\s]*supabase\.co/i);
  assert.doesNotMatch(ps, /^\s*(?:npx\s+)?supabase\s+(?:link|db\s+push|db\s+reset|migration\s+up)/im);
});
