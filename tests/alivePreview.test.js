import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL("../" + path, import.meta.url), "utf8");

test("LoveMatch360 Alive resta nascosto nelle build di produzione", async () => {
  const home = await read("src/pages/Home.jsx");
  assert.match(home, /import AlivePreview from "\.\.\/components\/alive\/AlivePreview\.jsx"/);
  assert.match(home, /const ALIVE_PREVIEW_ENABLED = import\.meta\.env\.DEV && import\.meta\.env\.VITE_LM360_ALIVE_PREVIEW === "true"/);
  assert.match(home, /\{ALIVE_PREVIEW_ENABLED \? <AlivePreview \/> : null\}/);
});

test("quattro icone, senza fingere stati umani o inviare like e messaggi", async () => {
  const jsx = await read("src/components/alive/AlivePreview.jsx");
  for (const id of ["heart", "smile", "chat", "sparkle"]) {
    assert.match(jsx, new RegExp('id: "' + id + '"'));
  }
  assert.match(jsx, /Heart, Smile, MessageCircleHeart, Sparkles/);
  assert.match(jsx, /Non indicano che una persona stia scrivendo/);
  assert.match(jsx, /Nessun like è stato inviato/);
  assert.doesNotMatch(jsx, /from\(["'](?:@supabase|supabase)|supabase\.|fetch\(|track\(|localStorage|send_stanza_message|match_scores/);
});

test("i pulsanti Alive sono accessibili e mostrano feedback su azione", async () => {
  const jsx = await read("src/components/alive/AlivePreview.jsx");
  assert.match(jsx, /<section className="lm360-alive-preview" aria-labelledby="lm360-alive-title">/);
  assert.match(jsx, /<button\s+key=\{id\}\s+type="button"/);
  assert.match(jsx, /aria-pressed=\{selected === id\}/);
  assert.match(jsx, /onClick=\{\(\) => setSelected/);
  assert.match(jsx, /<Icon focusable="false"/);
  assert.match(jsx, /aria-hidden="true"/);
  assert.match(jsx, /aria-live="polite" aria-atomic="true"/);
  assert.doesNotMatch(jsx, /setTimeout|setInterval|new Audio|speechSynthesis/);
});

test("le quattro animazioni sono limitate alla preview e rispettano reduced motion", async () => {
  const css = await read("src/components/alive/AlivePreview.css");
  for (const name of ["heartbeat", "wink", "pop", "twinkle"]) {
    assert.match(css, new RegExp("@keyframes lm360-alive-" + name));
  }
  assert.match(css, /lm360-alive-card:focus-visible/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none !important/);
  assert.match(css, /transition: none !important/);
  assert.doesNotMatch(css, /animation-iteration-count:\s*infinite/);
});

test("il cuore selezionato si riempie visibilmente di rosa, senza perdere il focus accessibile", async () => {
  const css = await read("src/components/alive/AlivePreview.css");
  const jsx = await read("src/components/alive/AlivePreview.jsx");
  assert.match(css, /\.lm360-alive-card--heart\.is-selected\s*\{[^}]*border-color:\s*#ff8cbd;/);
  assert.match(css, /\.lm360-alive-card--heart\.is-selected\s+\.lm360-alive-mark svg\s*\{[^}]*fill:\s*#ff81b9;/);
  assert.match(css, /\.lm360-alive-card:focus-visible\s*\{/);
  assert.match(jsx, /aria-pressed=\{selected === id\}/);
  assert.match(jsx, /previous === id \? null : id/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
