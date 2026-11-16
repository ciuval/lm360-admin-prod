import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const jsFile = new URL("../scripts/e2e-third-account-privacy-local.mjs", import.meta.url);
const psFile = new URL("../scripts/local-only/check-third-account-privacy.ps1", import.meta.url);

test("terzo account: script è sintatticamente valido e non parte nella CI", async () => {
  const checked = spawnSync(process.execPath, ["--check", fileURLToPath(jsFile)], { encoding: "utf8" });
  assert.equal(checked.status, 0, "Node syntax invalid");
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.ok(!Object.values(packageJson.scripts).some((command) =>
    command.includes("e2e-third-account-privacy-local.mjs")));
});

test("test privacy accetta solo endpoint locale e coppia sintetica verificata", async () => {
  const js = await readFile(jsFile, "utf8");
  const ps = await readFile(psFile, "utf8");
  for (const word of [
    "assertLocalE2eUrl", "SYNTHETIC_PAIR_NOT_UNIQUE", "SYNTHETIC_PAIR_NOT_FOUND",
    "NON_SYNTHETIC_PAIR_BLOCKED", "@example.test", "Andrea Test", "Bianca Test",
    "SYNTHETIC_CONVERSATION_NOT_FOUND", "auth.admin.createUser",
    "auth.getUser", "auth.admin.deleteUser", "finally",
  ]) assert.ok(js.includes(word), "Missing identity guard " + word);
  for (const word of [
    "integration/quality-gate-20261112", "LM360_FASE2_LAB", "127\\.0\\.0\\.1:54321->",
    "com.supabase.cli.project", "LOCAL_DATABASE_IDENTITY_MISMATCH",
    "LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY", "supabase status -o env",
    "Remove-Item -Path", "LOCAL_THIRD_ACCOUNT_TEST_FAILED",
  ]) assert.ok(ps.includes(word), "Missing local-only guard " + word);
  assert.doesNotMatch(js, /(?:process\.env\.)?VITE_SUPABASE_/);
  assert.doesNotMatch(ps, /\bsupabase\s+(?:link|db\s+(?:push|reset))\b/i);
});

test("test non legge testo chat e non stampa PII o errori provider", async () => {
  const js = await readFile(jsFile, "utf8");
  assert.match(js, /select\("id", \{ count: "exact", head: true \}\)/);
  assert.doesNotMatch(js, /\.select\(".*\btesto\b/);
  assert.doesNotMatch(js, /console\.(?:log|error|warn)/);
  assert.doesNotMatch(js, /JSON\.stringify\((?:error|result)\)/);
  assert.match(js, /dataOf\(result, "CLEANUP_SYNTHETIC_C_FAILED"\)/);
  assert.match(js, /process\.stdout\.write\("CLEANUP solo account C locale: PASS/);
});

test("terzo utente non deve leggere messaggi, match, stanze e non deve inviare senza match", async () => {
  const js = await readFile(jsFile, "utf8");
  for (const check of [
    "ANON_READ_ALLOWED", "OUTSIDER_GLOBAL_CHAT_LEAK",
    "OUTSIDER_TARGETED_CHAT_LEAK", "OUTSIDER_CONVERSATION_LEAK",
    "OUTSIDER_MATCH_LEAK", "OUTSIDER_STANZA_LEAK",
    "OUTSIDER_PRIVATE_PROFILE_LEAK", "OUTSIDER_ROOM_ACCESS_ALLOWED",
    "OUTSIDER_MESSAGE_SEND_ALLOWED", "OUTSIDER_MESSAGE_WRITTEN",
    "ORIGINAL_CONVERSATION_CHANGED",
  ]) assert.ok(js.includes(check), "Missing privacy regression " + check);
  assert.match(js, /countAllPairs\(ids\)/);
  assert.match(js, /const canOpen = dataOf\(await outsider\.rpc\("can_open_stanza"/);
  assert.match(js, /const sent = dataOf\(await outsider\.rpc\("send_stanza_message"/);
  assert.doesNotMatch(js, /admin\.from\("messaggi"\)\.delete/);
  assert.doesNotMatch(js, /admin\.auth\.admin\.deleteUser\(a\.id\)/);
  assert.doesNotMatch(js, /admin\.auth\.admin\.deleteUser\(b\.id\)/);
});
