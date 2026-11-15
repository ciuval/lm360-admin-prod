import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const chatFile = new URL("../src/pages/ChatBox.jsx", import.meta.url);
const readChat = async () => readFile(chatFile, "utf8");

test("dopo conferma RPC rileggiamo la coppia: il messaggio appare anche senza realtime", async () => {
  const chat = await readChat();
  assert.match(chat, /const loaded = await refreshMessages\(session\.user\.id, destinatarioId\)/);
  assert.match(chat, /if \(!loaded\)/);
  assert.match(chat, /Messaggio inviato, ma la cronologia non si aggiorna/);
  assert.match(chat, /"send_stanza_message"/);
  assert.match(chat, /setMessaggi\(validRows\)/);
  assert.match(chat, /if \(error\) \{\s*setMessagesLoadError\(true\)/);
  assert.match(chat, /\.select\("id, mittente_id, destinatario_id, testo, letto, inviato_il"\)/);
  assert.match(chat, /\.or\(`and\(mittente_id\.eq\.\$\{myId\},destinatario_id\.eq\.\$\{partnerId\}\),and\(mittente_id\.eq\.\$\{partnerId\},destinatario_id\.eq\.\$\{myId\}\)`\)/);
});

test("la chat scorre soltanto nel contenitore messaggi e non nasconde il modulo dietro l'header", async () => {
  const chat = await readChat();
  assert.match(chat, /ref=\{chatBoxRef\}/);
  assert.match(chat, /container\.scrollTop = container\.scrollHeight/);
  assert.doesNotMatch(chat, /scrollIntoView\(/);
  assert.match(chat, /requestAnimationFrame\(scrollConversationToEnd\)/);
});

test("l'invio non viene ripetuto mentre la richiesta e in corso", async () => {
  const chat = await readChat();
  assert.match(chat, /\|\| sending\) return/);
  assert.match(chat, /setSending\(true\)/);
  assert.match(chat, /finally \{\s*setSending\(false\)/);
  assert.match(chat, /disabled=\{!chatAbilitata \|\| sending \|\| !input\.trim\(\)\}/);
  assert.match(chat, /disabled=\{!chatAbilitata \|\| sending\}/);
});

test("nessun duplicato quando arrivano eventi realtime insieme al refresh", async () => {
  const chat = await readChat();
  assert.match(chat, /prev\.some\(\(msg\) => msg\.id === nuovo\.id\)/);
  assert.match(chat, /\.on\("postgres_changes", \{ event: "INSERT", schema: "public", table: "messaggi" \}/);
  assert.match(chat, /if \(matchError \|\| roomError\)/);
  assert.doesNotMatch(chat, /console\.(?:log|warn|error)/);
});
