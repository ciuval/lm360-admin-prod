import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const chatFile = new URL("../src/pages/ChatBox.jsx", import.meta.url);

const readChat = async () =>
  (await readFile(chatFile, "utf8")).replace(/\r\n/g, "\n");

const getEffect = (source, anchor, nextAnchor) => {
  const start = source.indexOf(anchor);
  const end = source.indexOf(nextAnchor, start + anchor.length);

  assert.ok(start >= 0 && end > start, "EFFECT_BOUNDARIES_MISSING");
  return source.slice(start, end);
};

test("Gate 2.1B: bootstrap sessione ignora risposte dopo unmount", async () => {
  const chat = await readChat();

  const section = getEffect(
    chat,
    '  useEffect(() => {\n    let active = true;',
    '  useEffect(() => {\n    readGenerationRef.current += 1;'
  );

  const hasLifecycleFlag = /let\s+(active|cancelled)\s*=/.test(section);
  const hasCleanup = /return\s*\(\)\s*=>\s*\{\s*active\s*=\s*false;\s*authState\.subscription\.unsubscribe\(\);/.test(section);

  assert.ok(
    hasLifecycleFlag && hasCleanup,
    "SESSION_BOOTSTRAP_CLEANUP_MISSING"
  );
});

test("Gate 2.1B: verifica iniziale ignora risultati obsoleti", async () => {
  const chat = await readChat();

  const section = getEffect(
    chat,
    '  useEffect(() => {\n    readGenerationRef.current += 1;',
    '  // Gate 2.1B: rivalidazione della chat aperta.'
  );

  const hasLifecycleFlag = /let\s+active\s*=\s*true/.test(section);
  const checksLifecycle = /if\s*\(!active\)\s*return/.test(section);
  const hasCleanup =
    /return\s*\(\)\s*=>\s*\{[\s\S]*active\s*=\s*false/.test(section);

  assert.ok(
    hasLifecycleFlag && checksLifecycle && hasCleanup,
    "STALE_MATCH_CHECK_PROTECTION_MISSING"
  );
});