import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const chatFile = new URL("../src/pages/ChatBox.jsx", import.meta.url);
const readChat = () => readFile(chatFile, "utf8");

test("Gate 2.1: rivalida il match mentre la chat resta aperta", async () => {
  const chat = await readChat();

  assert.ok(/setInterval\s*\(/.test(chat), "REVOKE_PERIODIC_CHECK_MISSING");
  assert.ok(/addEventListener\s*\(\s*["']focus["']/.test(chat), "REVOKE_FOCUS_CHECK_MISSING");
  assert.ok(/clearInterval\s*\(/.test(chat), "REVOKE_TIMER_CLEANUP_MISSING");
});

test("Gate 2.1: revoca nasconde la cronologia e blocca l'interfaccia", async () => {
  const chat = await readChat();

  assert.ok(/setChatAbilitata\(false\)/.test(chat), "CHAT_CLOSE_MISSING");
  assert.ok(/setMessaggi\(\[\]\)/.test(chat), "MESSAGE_STATE_CLEAR_MISSING");
  assert.ok(/setInput\(""\)/.test(chat), "INPUT_CLEAR_MISSING");

  assert.ok(
    /\{chatAbilitata\s*&&\s*\(\s*<div\s+ref=\{chatBoxRef\}/.test(chat),
    "MESSAGE_RENDER_GUARD_MISSING"
  );

  assert.ok(
    /if \(messaggiChannel\) supabase\.removeChannel\(messaggiChannel\)/.test(chat),
    "REALTIME_CLEANUP_MISSING"
  );
});