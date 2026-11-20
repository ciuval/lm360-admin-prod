import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const file = new URL("../src/pages/ChatBox.jsx", import.meta.url);
const readChat = async () =>
  (await readFile(file, "utf8")).replace(/\r\n/g, "\n");

test("Gate 2.1B: scarta risultati di invio non più validi", async () => {
  const chat = await readChat();
  const start = chat.indexOf("  const inviaMessaggio = async () => {");
  const end = chat.indexOf("  const messaggiPerData =", start);
  assert.ok(start >= 0 && end > start, "SEND_FUNCTION_MISSING");

  const send = chat.slice(start, end);
  assert.match(send, /const sendGeneration = readGenerationRef\.current/);

  const guards = [...send.matchAll(
    /if \(readGenerationRef\.current !== sendGeneration\) return;/g
  )];
  assert.equal(guards.length, 2, "STALE_RESULT_GUARDS_MISSING");

  const rpc = send.indexOf('await supabase.rpc("send_stanza_message"');
  const failure = send.indexOf("if (error || !sent)");
  const refresh = send.indexOf("const loaded = await refreshMessages");
  const refreshFailure = send.indexOf("if (!loaded)");

  const first = send.indexOf(guards[0][0]);
  const second = send.indexOf(guards[1][0], first + 1);

  assert.ok(rpc >= 0 && first > rpc && first < failure);
  assert.ok(refresh > failure && second > refresh && second < refreshFailure);

  assert.match(send,
    /catch\s*\{\s*if\s*\(readGenerationRef\.current === sendGeneration\)/);
  assert.match(send,
    /finally\s*\{\s*if\s*\(readGenerationRef\.current === sendGeneration\)\s*\{\s*setSending\(false\)/);
});

test("Gate 2.1B: logout, cambio chat e revoca sbloccano invio", async () => {
  const chat = await readChat();
  const sections = [
    ["const closeSignedOut = () => {", "  useEffect(() => {"],
    ["  useEffect(() => {\n    readGenerationRef.current += 1;",
      "  // Gate 2.1B: rivalidazione della chat aperta."],
    ["const closeRevoked = (unavailable = false) => {",
      "const checkRevocationAccess = async () => {"]
  ];

  for (const [begin, finish] of sections) {
    const start = chat.indexOf(begin);
    const end = chat.indexOf(finish, start + begin.length);
    assert.ok(start >= 0 && end > start, "CLOSE_SECTION_MISSING");

    const section = chat.slice(start, end);
    assert.match(section, /readGenerationRef\.current\s*\+=\s*1/);
    assert.match(section, /setSending\(false\)/);
  }
});