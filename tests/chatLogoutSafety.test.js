import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const chatFile = new URL("../src/pages/ChatBox.jsx", import.meta.url);

test("Gate 2.1B: logout pulisce la chat indipendentemente da Realtime", async () => {
  const source = (await readFile(chatFile, "utf8")).replace(/\r\n/g, "\n");

  const helperStart = source.indexOf("  const closeSignedOut = () => {");
  const helperEnd = source.indexOf("\n  };", helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart, "LOGOUT_CLEANUP_MISSING");

  const cleanup = source.slice(helperStart, helperEnd);
  const required = [
    /readGenerationRef\.current\s*\+=\s*1/,
    /setSession\(null\)/,
    /setChatAbilitata\(false\)/,
    /setMessaggi\(\[\]\)/,
    /setInput\(""\)/,
    /setDestinatarioNome\("questa persona"\)/,
    /setVerificaAccesso\(false\)/,
  ];

  for (const pattern of required) {
    assert.match(cleanup, pattern, "PRIVATE_STATE_NOT_CLEARED");
  }

  const matchEffect = source.indexOf(
    "  useEffect(() => {\n    readGenerationRef.current += 1;"
  );
  assert.ok(matchEffect > helperEnd, "MATCH_EFFECT_MISSING");

  const bootstrap = source.slice(helperEnd, matchEffect);
  assert.match(bootstrap, /supabase\.auth\.onAuthStateChange/);
  assert.match(bootstrap, /event === "SIGNED_OUT"[\s\S]*closeSignedOut\(\)/);
  assert.match(bootstrap, /authState\.subscription\.unsubscribe\(\)/);
  assert.match(bootstrap, /authEventGeneration !== initialGeneration/);

  const realtimeStart = source.indexOf(
    'const { data: authListener } = supabase.auth.onAuthStateChange'
  );
  assert.ok(realtimeStart > matchEffect, "REALTIME_AUTH_LISTENER_MISSING");

  const realtime = source.slice(realtimeStart);
  assert.match(realtime, /if \(event === "SIGNED_OUT"\)/);
  assert.match(realtime, /supabase\.removeChannel\(messaggiChannel\)/);
  assert.match(realtime, /authListener\.subscription\.unsubscribe\(\)/);
});