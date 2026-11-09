import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Sicurezza offre un canale pubblico di segnalazione senza login", async () => {
  const page = await read("src/pages/Sicurezza.jsx");
  assert.match(page, /Segnala un problema/);
  assert.match(page, /mailto:servizioclienti@lovematch360\.com/);
  assert.match(page, /Molestie, truffe o profili sospetti/);
  assert.match(page, /non promettiamo il monitoraggio automatico/);
});

test("Sicurezza distingue 18+ autodichiarato da identita verificata", async () => {
  const page = await read("src/pages/Sicurezza.jsx");
  assert.match(page, /Età dichiarata, non identità verificata/);
  assert.match(page, /non equivalgono a una verifica documentale/);
  assert.match(page, /Nuovi acquisti Premium sospesi/);
});

test("Contatti spiega come segnalare senza condividere credenziali", async () => {
  const page = await read("src/pages/Contatti.jsx");
  assert.match(page, /mailto:servizioclienti@lovematch360\.com/);
  assert.match(page, /non viene promessa un'assistenza continuativa 24 ore su 24/);
  assert.match(page, /non inviare password|Non inviare password/i);
  assert.match(page, /Non inoltrare materiale illecito/);
});

test("FAQ chiarisce regole, limiti, segnalazioni e pagamenti sospesi", async () => {
  const page = await read("src/pages/FAQ.jsx");
  for (const item of [
    "autodichiarazione",
    "nessuna verifica",
    "segnal",
    "nuovi acquisti Premium",
    "cancellazione automatica immediata",
  ]) {
    assert.match(page.toLowerCase(), new RegExp(item.toLowerCase().replace("nessuna verifica", "verifica documentale")));
  }
  assert.match(page, /mailto:servizioclienti@lovematch360\.com/);
});

test("Footer usa dichiarazioni verificabili e non certificazioni inesistenti", async () => {
  const footer = await read("src/components/SiteFooter.jsx");
  assert.match(footer, /18\+ con autodichiarazione/);
  assert.match(footer, /Segnalazioni via email/);
  assert.match(footer, /Nuovi acquisti Premium sospesi/);
  assert.doesNotMatch(footer, /"Privacy rispettata"/);
  assert.doesNotMatch(footer, /"Contatti puliti"/);
});

test("Le pagine esistono nel router senza aggiungere nuove route", async () => {
  const app = await read("src/App.jsx");
  for (const route of ["/sicurezza", "/contatti", "/faq", "/uso-accettabile", "/premium", "/profilo"]) {
    assert.ok(app.includes(`path="${route}"`), `Route mancante: ${route}`);
  }
});
