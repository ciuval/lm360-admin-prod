import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Scopri non scrive match_scores direttamente dal browser", async () => {
  const page = await read("src/pages/PublicProfilesPage.jsx");
  assert.doesNotMatch(page, /from\(["']match_scores["']\)\.upsert\s*\(/);
  assert.doesNotMatch(page, /from\(["']match_scores["']\)\.insert\s*\(/);
  assert.doesNotMatch(page, /match_scores["']\)\s*\.update\s*\(/);
  assert.match(page, /confirmedMatch/);
  assert.match(page, /\.eq\("score", 100\)/);
});

test("Scopri non garantisce visibilità o match senza conferma", async () => {
  const page = await read("src/pages/PublicProfilesPage.jsx");
  assert.doesNotMatch(page, /Il tuo profilo gratuito è completo e visibile/);
  assert.doesNotMatch(page, /è già visibile e pronto a ricevere/);
  assert.match(page, /Il tuo profilo soddisfa i requisiti/);
  assert.match(page, /Il match non è ancora confermato/);
});

test("MatchDashboard non richiede una colonna eta inesistente", async () => {
  const page = await read("src/pages/MatchDashboard.jsx");
  assert.match(page, /\.select\("id, nome, bio, interessi, foto_url"\)/);
  assert.doesNotMatch(page, /profilo\.eta|nome, eta, bio/);
  assert.match(page, /setLoadError\(true\)/);
  assert.match(page, /role="alert"/);
});

test("Chat legge solo i campi effettivi dei messaggi", async () => {
  const page = await read("src/pages/ChatBox.jsx");
  assert.match(page, /\.select\("id, mittente_id, destinatario_id, testo, letto, inviato_il"\)/);
  assert.match(page, /\.order\("inviato_il", \{ ascending: true \}\)/);
  assert.match(page, /msg\.testo/);
  assert.match(page, /msg\.inviato_il/);
  assert.doesNotMatch(page, /msg\.(timestamp|contenuto)/);
});

test("Chat fallisce chiusa se RPC e verifica del match falliscono", async () => {
  const page = await read("src/pages/ChatBox.jsx");
  assert.match(page, /if \(matchError \|\| roomError\)/);
  assert.match(page, /setChatAbilitata\(false\)/);
  assert.match(page, /La chat resta chiusa per sicurezza/);
  assert.match(page, /disabled=\{!chatAbilitata\}/);
});
