import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assertLocalE2eUrl } from "../src/lib/localE2eSafety.js";

test("Supabase E2E autorizza soltanto API loopback sulla porta locale standard", () => {
  assert.equal(assertLocalE2eUrl("http://127.0.0.1:54321"), "http://127.0.0.1:54321");
  assert.equal(assertLocalE2eUrl("http://localhost:54321"), "http://localhost:54321");
});

test("Supabase E2E rifiuta produzione, LAN, host esterni, credenziali in URL, TLS, porte diverse", () => {
  const unsafe = [
    "https://feyjnhczcwmwxwrlybfj.supabase.co",
    "https://example.supabase.co",
    "http://192.168.1.3:54321",
    "http://localhost:54322",
    "https://localhost:54321",
    "http://localhost:54321@remote.example.test:54321",
    "http://foo:bar@localhost:54321",
    "http://127.0.0.1:54321/path",
    "http://127.0.0.1:54321?token=x",
    "http://127.0.0.1:54321/#/login",
    "http://[::1]:54321",
    "",
  ];
  for (const url of unsafe) assert.throws(() => assertLocalE2eUrl(url));
});

test("Collaudo V2 locale non parte dai test CI e contiene l'intero percorso a due attori", async () => {
  const script = await readFile(new URL("../scripts/e2e-two-accounts-local.mjs", import.meta.url), "utf8");
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.scripts["test:e2e:local"], "node scripts/e2e-two-accounts-local.mjs");
  for (const contract of [
    "assertLocalE2eUrl", "auth.signUp", "auth.getUser",
    "persistProfile(", "profili_foto", "syncPrimaryProfilePhoto(",
    "setProfileVisibility(", "lm360_get_public_profiles",
    "likes", "match_scores", "get_stanza_compatibility",
    "stanze_360", "send_stanza_message", "messaggi",
    "auth.admin.deleteUser", "cleanLocalTestRows", "finally",
  ]) assert.ok(script.includes(contract), "Manca il controllo: " + contract);
  assert.doesNotMatch(script, /(?:process\.env\.)?VITE_SUPABASE_/);
  assert.doesNotMatch(script, /console\.(?:log|error|warn)/);
  assert.doesNotMatch(script, /supabase\.co|service_role_key\s*=/i);
});

test("Lo script E2E locale supera il controllo sintattico senza eseguire richieste", () => {
  const file = fileURLToPath(new URL("../scripts/e2e-two-accounts-local.mjs", import.meta.url));
  const checked = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
  assert.equal(checked.status, 0, "Lo script E2E non è sintatticamente valido");
});
