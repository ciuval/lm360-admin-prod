import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  newConflict, act, roomAllowed, statusFor,
  mediatorCanReadOldChat, mediatorCanReadMatchingProfile,
} from "../lab/ponte360-couple/policy.mjs";

const paused = () => act(newConflict(), "andrea", "pause-chat");
const offered = () => act(paused(), "bianca", "propose");
const both = () => act(act(offered(), "bianca", "accept"), "andrea", "accept");

test("C01: il conflitto non viene rilevato leggendo messaggi", () => {
  const state = newConflict();
  assert.equal(state.privateChatPaused, false);
  assert.equal(roomAllowed(state), false);
  assert.equal(act(state, "ponte360", "next-prompt"), state);
  assert.equal(mediatorCanReadOldChat(), false);
  assert.equal(mediatorCanReadMatchingProfile(), false);
});

test("C02: un partecipante può mettere in pausa la chat privata", () => {
  const s = paused();
  assert.equal(s.privateChatPaused, true);
  assert.equal(s.pausedBy, "andrea");
  assert.equal(roomAllowed(s), false);
  assert.equal(act(s, "bianca", "pause-chat"), s);
});

test("C03: chi non ha chiesto la pausa può proporre un unico invito Ponte360", () => {
  const s = paused();
  assert.equal(act(s, "andrea", "propose"), s);
  const sent = act(s, "bianca", "propose");
  assert.equal(sent.outreachUsed, true);
  assert.equal(sent.proposedBy, "bianca");
  assert.deepEqual(act(sent, "bianca", "propose"), sent);
  assert.equal(roomAllowed(sent), false);
});

test("C04: l'invito NON equivale ad accettazione", () => {
  const s = offered();
  assert.deepEqual(s.consent, { andrea: false, bianca: false });
  assert.equal(roomAllowed(s), false);
  assert.equal(statusFor(s, "ponte360").startsWith("Nessun accesso"), true);
});

test("C05: un solo consenso non permette al terzo di partecipare", () => {
  const s = act(offered(), "andrea", "accept");
  assert.deepEqual(s.consent, { andrea: true, bianca: false });
  assert.equal(roomAllowed(s), false);
  assert.equal(act(s, "ponte360", "next-prompt"), s);
});

test("C06: due consensi indipendenti aprono la nuova stanza", () => {
  const s = both();
  assert.deepEqual(s.consent, { andrea: true, bianca: true });
  assert.equal(roomAllowed(s), true);
  assert.equal(s.privateChatPaused, true);
  assert.equal(mediatorCanReadOldChat(), false);
  assert.equal(mediatorCanReadMatchingProfile(), false);
});

test("C07: il terzo propone domande neutrali solo dopo due consensi", () => {
  const s = both();
  const next = act(s, "ponte360", "next-prompt");
  assert.equal(next.promptIndex, 1);
  assert.equal(act(next, "ponte360", "next-prompt").promptIndex, 2);
  assert.equal(act(act(next, "ponte360", "next-prompt"), "ponte360", "next-prompt").promptIndex, 2);
  assert.equal(act(s, "ponte360", "accept"), s);
  assert.equal(act(s, "ponte360", "block"), s);
});

test("C08: rifiuto di Andrea o Bianca ferma nuovi accessi e solleciti", () => {
  for (const actor of ["andrea", "bianca"]) {
    const s = act(offered(), actor, "decline");
    assert.equal(s.stopped, true);
    assert.equal(roomAllowed(s), false);
    assert.equal(act(s, "bianca", "propose"), s);
    assert.equal(act(s, "andrea", "accept"), s);
  }
});

test("C09: anche dopo doppio consenso ciascuno può ritirarsi da solo", () => {
  for (const actor of ["andrea", "bianca"]) {
    const s = act(both(), actor, "withdraw");
    assert.equal(s.stopped, true);
    assert.equal(roomAllowed(s), false);
    assert.equal(act(s, "ponte360", "next-prompt"), s);
  }
});

test("C10: blocco, sicurezza e chiusura prevalgono sul consenso", () => {
  for (const action of ["block", "unsafe", "close"]) {
    for (const person of ["andrea", "bianca"]) {
      const s = act(both(), person, action);
      assert.equal(roomAllowed(s), false);
      assert.equal(s.stopped, true);
      assert.equal(act(s, "ponte360", "next-prompt"), s);
      assert.equal(act(s, "andrea", "propose"), s);
    }
  }
});

test("C11: estranei non possono gestire inviti o consenso", () => {
  const s = offered();
  for (const actor of ["estraneo", "anonimo", "figlio", "mediatore"]) {
    for (const action of ["accept", "propose", "pause-chat", "withdraw", "block", "reset"]) {
      assert.equal(act(s, actor, action), s);
    }
  }
});

test("C12: Andrea e Bianca hanno stessi diritti nella pausa invertita", () => {
  const s = act(newConflict(), "bianca", "pause-chat");
  assert.equal(act(s, "bianca", "propose"), s);
  const invited = act(s, "andrea", "propose");
  const one = act(invited, "andrea", "accept");
  assert.equal(roomAllowed(one), false);
  assert.equal(roomAllowed(act(one, "bianca", "accept")), true);
});

test("C13: nessuna modifica alle chat, al match o agli account reali", () => {
  const s = both();
  for (const key of ["messages", "messaggi", "likes", "match_scores", "tokens", "email", "accountId"]) {
    assert.equal(Object.hasOwn(s, key), false);
  }
  assert.notEqual(act(s, "demo", "reset"), s);
  assert.deepEqual(act(s, "demo", "reset"), newConflict());
  assert.equal(statusFor(s, "ponte360").includes("vecchia chat"), false);
});

test("C14: schermata senza fetch/storage né inject HTML", async () => {
  const root = new URL("../lab/ponte360-couple/", import.meta.url);
  const html = await readFile(new URL("index.html", root), "utf8");
  const app = await readFile(new URL("app.mjs", root), "utf8");
  const policy = await readFile(new URL("policy.mjs", root), "utf8");
  for (const [name, code] of [["app.mjs", app], ["policy.mjs", policy]]) {
    const file = new URL(name, root);
    const syntax = spawnSync(process.execPath, ["--check", fileURLToPath(file)], { encoding: "utf8" });
    assert.equal(syntax.status, 0, name + " must parse");
    assert.doesNotMatch(code, /\b(fetch|XMLHttpRequest|localStorage|sessionStorage|WebSocket|createClient)\s*\(/);
    assert.doesNotMatch(code, /\b(innerHTML|outerHTML|insertAdjacentHTML)\b/);
  }
  assert.match(html, /lang="it"/);
  assert.match(html, /name="robots" content="noindex/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /data-role="andrea"/);
  assert.match(html, /data-role="bianca"/);
  assert.match(html, /data-role="ponte360"/);
  assert.doesNotMatch(html + app + policy, /https?:\/\/(?!127\.0\.0\.1)/i);
});

test("C15: il server esistente espone il prototipo solo sul loopback", async () => {
  const path = new URL("../scripts/local-only/serve-ponte360-family-lab.mjs", import.meta.url);
  const src = await readFile(path, "utf8");
  assert.match(src, /const HOST = "127\.0\.0\.1"/);
  assert.match(src, /"\/andrea-bianca\/"/);
  assert.match(src, /"\/andrea-bianca\/app\.mjs"/);
  assert.match(src, /"\/andrea-bianca\/policy\.mjs"/);
  assert.match(src, /connect-src 'none'/);
  assert.doesNotMatch(src, /createClient|service_role|\.env/);
});


test("C16: dopo rifiuto, revoca, blocco o chiusura il mediatore vede uno stop definitivo", () => {
  const scenarios = [
    act(offered(), "andrea", "decline"),
    act(both(), "andrea", "withdraw"),
    act(both(), "andrea", "block"),
    act(both(), "bianca", "unsafe"),
    act(both(), "bianca", "close"),
  ];
  for (const state of scenarios) {
    assert.equal(roomAllowed(state), false);
    assert.equal(statusFor(state, "ponte360"),
      "Mediazione terminata. Nessun accesso o nuovo invito.");
    assert.equal(act(state, "ponte360", "next-prompt"), state);
  }
  assert.match(statusFor(offered(), "ponte360"), /^Nessun accesso:/);
});
