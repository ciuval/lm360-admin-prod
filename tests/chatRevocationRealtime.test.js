import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const chatFile = new URL("../src/pages/ChatBox.jsx", import.meta.url);
const readChat = async () =>
  (await readFile(chatFile, "utf8")).replace(/\r\n/g, "\n");

const guard = /if\s*\(!active\s*\|\|\s*readGenerationRef\.current\s*!==\s*channelGeneration\)\s*return;/;

test("Gate 2.1B: callback Realtime scarta eventi dopo revoca", async () => {
  const chat = await readChat();
  const anchor = '.on("postgres_changes", { event: "INSERT", schema: "public", table: "messaggi" }, async (payload) => {';
  const start = chat.indexOf(anchor);
  const end = chat.indexOf('.subscribe((status) => {', start);

  assert.ok(start >= 0 && end > start, "REALTIME_HANDLER_MISSING");

  const handler = chat.slice(start, end);
  assert.match(handler, guard, "STALE_REALTIME_EVENT_GUARD_MISSING");
});

test("Gate 2.1B: callback subscription ignora stati tardivi", async () => {
  const chat = await readChat();
  const start = chat.indexOf('.subscribe((status) => {');
  const end = chat.indexOf('    };', start);

  assert.ok(start >= 0 && end > start, "SUBSCRIPTION_HANDLER_MISSING");

  const section = chat.slice(start, end);
  const guarded = section.search(guard);
  const subscribed = section.indexOf('status === "SUBSCRIBED"');

  assert.ok(
    guarded >= 0 && subscribed > guarded,
    "STALE_SUBSCRIPTION_STATUS_GUARD_MISSING"
  );
});