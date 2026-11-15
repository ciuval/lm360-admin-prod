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


test("date e orari della conversazione sono coerenti in italiano su Chrome ed Edge", async () => {
  const chat = await readChat();
  assert.match(chat, /toLocaleDateString\("it-IT"\)/);
  assert.match(chat, /toLocaleTimeString\("it-IT"/);
  assert.doesNotMatch(chat, /\.toLocaleDateString\(\)/);
  assert.doesNotMatch(chat, /\.toLocaleTimeString\(\)/);
});


test("lo stato Realtime è leggibile nella chat senza token o payload in log", async () => {
  const chat = await readChat();
  assert.match(chat, /\.subscribe\(\(status\) => \{/);
  assert.match(chat, /status === "SUBSCRIBED"/);
  assert.match(chat, /status === "CHANNEL_ERROR" \|\| status === "TIMED_OUT" \|\| status === "CLOSED"/);
  assert.match(chat, /setRealtimeStatus\("COLLEGATO"\)/);
  assert.match(chat, /setRealtimeStatus\("NON_DISPONIBILE"\)/);
  assert.match(chat, /role="status" aria-live="polite"/);
  assert.match(chat, /Realtime: canale collegato \(consegna da verificare\)/);
  assert.match(chat, /La cronologia resta consultabile/);
  assert.doesNotMatch(chat, /console\.(?:log|warn|error)/);
});


test("ignora callback di canali gia smontati in React StrictMode", async () => {
  const chat = await readChat();
  assert.match(chat, /let active = true/);
  assert.match(chat, /if \(!active\) return;/);
  assert.match(chat, /active = false;\s*authListener\.subscription\.unsubscribe\(\)/);
  assert.match(chat, /if \(messaggiChannel\) supabase\.removeChannel\(messaggiChannel\)/);
  assert.match(chat, /\.subscribe\(\(status\) => \{[\s\S]*?if \(!active\) return;/);
  assert.match(chat, /setRealtimeFailure\(status\)/);
  assert.match(chat, /setRealtimeFailure\(null\)/);
  assert.match(chat, /realtimeFailure \|\| "ERRORE"/);
  assert.doesNotMatch(chat, /console\.(?:log|warn|error)/);
});


test("prima della subscription Realtime è applicato il JWT della sessione corrente", async () => {
  const chat = await readChat();
  assert.match(chat, /const \{ data, error \} = await supabase\.auth\.getSession\(\)/);
  assert.match(chat, /data\.session\.user\?\.id !== myId/);
  assert.match(chat, /!data\?\.session\?\.access_token/);
  assert.match(chat, /await supabase\.realtime\.setAuth\(data\.session\.access_token\)/);
  const jwt = chat.indexOf("await supabase.realtime.setAuth(data.session.access_token)");
  const subscribe = chat.indexOf('.channel("chat-messaggi")');
  assert.ok(jwt >= 0 && subscribe > jwt, "Realtime deve autenticarsi prima di sottoscrivere");
  assert.match(chat, /if \(!active\) return;\s*messaggiChannel = supabase/);
  assert.match(chat, /setRealtimeFailure\("SESSIONE_NON_VALIDA"\)/);
});

test("Realtime aggiorna il token alla scadenza e chiude i canali al logout", async () => {
  const chat = await readChat();
  assert.match(chat, /supabase\.auth\.onAuthStateChange\(\(event, nextSession\) => \{/);
  assert.match(chat, /event === "TOKEN_REFRESHED"/);
  assert.match(chat, /supabase\.realtime\.setAuth\(nextSession\.access_token\)/);
  assert.match(chat, /event === "SIGNED_OUT"/);
  assert.match(chat, /setRealtimeFailure\("SESSIONE_TERMINATA"\)/);
  assert.match(chat, /authListener\.subscription\.unsubscribe\(\)/);
  assert.doesNotMatch(chat, /console\.(?:log|warn|error)/);
});

test("notifiche audio bloccate non impediscono la conferma di lettura", async () => {
  const chat = await readChat();
  assert.match(chat, /new Audio\("\/notify\.mp3"\)\.play\(\)\.catch\(\(\) => \{\}\)/);
  assert.match(chat, /await supabase\.from\("messaggi"\)\.update\(\{ letto: true \}\)/);
});
