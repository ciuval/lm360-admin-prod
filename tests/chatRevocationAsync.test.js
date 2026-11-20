import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const chatFile = new URL("../src/pages/ChatBox.jsx", import.meta.url);
const readChat = () => readFile(chatFile, "utf8");

test("Gate 2.1B: ignora letture completate dopo la revoca", async () => {
  const chat = await readChat();

  const start = chat.indexOf("  const refreshMessages = async (myId, partnerId) => {");
  const end = chat.indexOf("  const scrollConversationToEnd =", start);

  assert.ok(start >= 0 && end > start, "REFRESH_SECTION_MISSING");

  const section = chat.slice(start, end);

  assert.match(
    section,
    /const requestGeneration = readGenerationRef\.current/,
    "READ_GENERATION_CAPTURE_MISSING"
  );

  const guard = section.indexOf(
    "readGenerationRef.current !== requestGeneration"
  );
  const update = section.indexOf("setMessaggi(validRows)");

  assert.ok(
    guard >= 0 && update > guard,
    "STALE_READ_GUARD_MISSING"
  );
});

test("Gate 2.1B: la chiusura invalida le letture pendenti", async () => {
  const chat = await readChat();

  const start = chat.indexOf("    const closeRevoked = (unavailable = false) => {");
  const end = chat.indexOf("    const checkRevocationAccess = async () => {", start);

  assert.ok(start >= 0 && end > start, "CLOSE_SECTION_MISSING");

  const section = chat.slice(start, end);

  assert.match(
    section,
    /readGenerationRef\.current\s*\+=\s*1/,
    "PENDING_READ_INVALIDATION_MISSING"
  );
});