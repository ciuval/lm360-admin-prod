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

test("il sorriso fa una rotazione riconoscibile e mostra il testo anche al passaggio o al focus", async () => {
  const [jsx, css] = await Promise.all([
    read("src/components/alive/AlivePreview.jsx"),
    read("src/components/alive/AlivePreview.css"),
  ]);
  assert.match(jsx, /\[preview, setPreview\] = useState\(null\)/);
  assert.match(jsx, /preview \?\? selected/);
  assert.match(jsx, /onMouseEnter=\{\(\) => setPreview\(id\)\}/);
  assert.match(jsx, /onFocus=\{\(\) => setPreview\(id\)\}/);
  assert.match(jsx, /onMouseLeave=\{\(\) => setPreview\(null\)\}/);
  assert.match(jsx, /onBlur=\{\(\) => setPreview\(null\)\}/);
  assert.match(jsx, /data-active=\{Boolean\(current\)\}/);
  assert.match(jsx, /<strong>\{current.label\}:<\/strong>/);
  assert.match(jsx, /Un occhiolino gentile/);
  assert.match(css, /\.lm360-alive-card--smile\.is-selected/);
  assert.match(css, /\.lm360-alive-feedback\[data-active="true"\]/);
  assert.match(css, /rotate\(-23deg\)/);
  assert.match(css, /rotate\(21deg\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("la scintilla mostra un bagliore viola persistente al clic e visibile su focus", async () => {
  const [jsx, css] = await Promise.all([
    read("src/components/alive/AlivePreview.jsx"),
    read("src/components/alive/AlivePreview.css"),
  ]);
  assert.match(jsx, /id: "sparkle"/);
  assert.match(jsx, /previous === id \? null : id/);
  assert.match(css, /\.lm360-alive-card--sparkle\.is-selected\s*\{[^}]*border-color:\s*#d2aaff;/);
  assert.match(css, /\.lm360-alive-card--sparkle\s+\.lm360-alive-mark::before\s*\{[^}]*radial-gradient/);
  assert.match(css, /\.lm360-alive-card--sparkle:is\(:hover, :focus-visible, \.is-selected\)\s+\.lm360-alive-mark::before\s*\{[^}]*opacity:\s*1;/);
  assert.match(css, /\.lm360-alive-card--sparkle:is\(:hover, :focus-visible, \.is-selected\)\s+\.lm360-alive-mark svg\s*\{[^}]*drop-shadow/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /animation-iteration-count:\s*infinite/);
});

test("anche Cuore Sorriso e Messaggio hanno il bagliore colorato della Scintilla", async () => {
  const [css, jsx] = await Promise.all([
    read("src/components/alive/AlivePreview.css"),
    read("src/components/alive/AlivePreview.jsx"),
  ]);
  const hues = [
    ["heart", "255, 181, 215", "255, 129, 185", "#ffe0ef"],
    ["smile", "255, 231, 163", "255, 194, 71", "#fff6d2"],
    ["chat", "173, 235, 255", "65, 174, 255", "#e0f7ff"],
  ];
  for (const [id, light, strong, stroke] of hues) {
    const escaped = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(css, new RegExp(
      "\\.lm360-alive-card--" + id + "\\s*\\{[^}]*" +
      "--alive-glow-light:\\s*" + escaped(light) + ";" +
      "[^}]*--alive-glow-strong:\\s*" + escaped(strong) + ";" +
      "[^}]*--alive-glow-stroke:\\s*" + escaped(stroke) + ";"
    ));
  }
  assert.match(css, /\.lm360-alive-card:is\(\.lm360-alive-card--heart, \.lm360-alive-card--smile, \.lm360-alive-card--chat\) \.lm360-alive-mark::before/);
  assert.match(css, /rgba\(var\(--alive-glow-light\), \.5\)/);
  assert.match(css, /rgba\(var\(--alive-glow-strong\), \.28\)/);
  assert.match(css, /:is\(:hover, :focus-visible, \.is-selected\) \.lm360-alive-mark::before\s*\{\s*opacity:\s*1;/);
  assert.match(css, /drop-shadow\(0 0 15px rgba\(var\(--alive-glow-strong\), \.9\)\)/);
  assert.match(css, /\.lm360-alive-card--smile\.is-selected\s*\{/);
  assert.match(css, /\.lm360-alive-card--chat\.is-selected\s*\{/);
  assert.match(css, /\.lm360-alive-card--heart\.is-selected \.lm360-alive-mark svg\s*\{\s*fill: #ff81b9;/);
  assert.match(css, /\.lm360-alive-dots\s*\{[^}]*z-index:\s*2;/);
  assert.match(jsx, /aria-pressed=\{selected === id\}/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /animation-iteration-count:\s*infinite/);
});

test("Messaggio ha un rimbalzo e tre puntini più visibili ma non invadenti", async () => {
  const [css, jsx] = await Promise.all([
    read("src/components/alive/AlivePreview.css"),
    read("src/components/alive/AlivePreview.jsx"),
  ]);
  assert.match(css, /animation: lm360-alive-pop 660ms/);
  assert.match(css, /animation: lm360-alive-dots 560ms ease-in-out 2;/);
  assert.match(css, /@keyframes lm360-alive-pop\s*\{[^}]*translateY\(-8px\) scale\(1\.22\);/);
  assert.match(css, /@keyframes lm360-alive-dots\s*\{[^}]*translateY\(-6px\);/);
  assert.match(css, /\.lm360-alive-dots i\s*\{\s*width: 5px;\s*height: 5px;/);
  assert.match(css, /\.lm360-alive-card--chat\.is-selected/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none !important/);
  assert.match(jsx, /Non indicano che una persona stia scrivendo/);
  assert.doesNotMatch(css, /animation-iteration-count:\s*infinite/);
});
