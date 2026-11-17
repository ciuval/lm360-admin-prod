import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  ROLES, newFamilyLab, isRoomOpen, isSharedAgreement,
  mayReadParentPrivateConversation, summaryFor, transition as act,
} from "../lab/ponte360-family/policy.mjs";

const invite = () => act(newFamilyLab(), "figlio-adulto", "suggest");
const open = () => act(act(invite(), "mamma", "accept"), "papa", "accept");
const file = (name) => readFile(new URL("../lab/ponte360-family/" + name, import.meta.url), "utf8");

test("SON01: un figlio maggiorenne propone una volta senza aprire la stanza", () => {
  const state = invite();
  assert.equal(state.suggested, true);
  assert.equal(state.invitations, 1);
  assert.equal(isRoomOpen(state), false);
  assert.deepEqual(act(state, "figlio-adulto", "suggest"), state);
  assert.equal(act(newFamilyLab(), "mamma", "accept").suggested, false);
});

test("SON02: due sì distinti aprono il solo scenario sintetico", () => {
  const once = act(invite(), "mamma", "accept");
  assert.equal(isRoomOpen(once), false);
  assert.equal(isRoomOpen(open()), true);
  assert.equal(mayReadParentPrivateConversation("figlio-adulto", open()), false);
  assert.equal(mayReadParentPrivateConversation("ponte360", open()), false);
});

test("SON03: il figlio non apprende scelte, rifiuti o motivi di sicurezza", () => {
  const before = invite();
  const afterOne = act(before, "mamma", "accept");
  const declined = act(afterOne, "papa", "decline");
  const safety = act(afterOne, "papa", "safety-stop");
  const blocked = act(afterOne, "mamma", "block");
  const sonStatus = summaryFor(before, "figlio-adulto");
  for (const state of [afterOne, declined, safety, blocked, open()]) {
    assert.equal(summaryFor(state, "figlio-adulto"), sonStatus);
  }
});

test("SON04: un rifiuto termina il percorso senza notifiche ripetute", () => {
  const state = act(invite(), "papa", "decline");
  assert.equal(state.ended, true);
  assert.equal(isRoomOpen(state), false);
  assert.equal(act(state, "mamma", "accept"), state);
  assert.equal(act(state, "figlio-adulto", "suggest"), state);
});

test("SON05: paura o blocco impediscono qualunque mediazione", () => {
  for (const kind of ["safety-stop", "block"]) {
    const state = act(open(), "papa", kind);
    assert.equal(state.ended, true);
    assert.equal(isRoomOpen(state), false);
    assert.equal(act(state, "mamma", "agree-small-step"), state);
    assert.equal(act(state, "figlio-adulto", "suggest"), state);
  }
});

test("SON06: ognuno dei due genitori può ritirarsi unilateralmente", () => {
  for (const parent of ["mamma", "papa"]) {
    const state = act(open(), parent, "withdraw");
    assert.equal(state.ended, true);
    assert.equal(isRoomOpen(state), false);
  }
});

test("SON07: un terzo, Ponte360 e un minorenne non decidono per i genitori", () => {
  const state = invite();
  for (const actor of ["figlio", "figlio-minore", "ponte360", "estraneo"]) {
    for (const kind of ["suggest", "accept", "decline", "withdraw", "block", "safety-stop", "reset"]) {
      assert.equal(act(state, actor, kind), state);
    }
  }
  assert.equal(ROLES.some((role) => role.id === "figlio-minore"), false);
});

test("SON08: la pausa impedisce nuovi passi senza riapertura automatica", () => {
  const paused = act(open(), "mamma", "pause");
  assert.equal(paused.paused, true);
  assert.equal(isRoomOpen(paused), false);
  assert.equal(act(paused, "papa", "accept"), paused);
  assert.equal(act(paused, "papa", "agree-small-step"), paused);
});

test("SON09: il piccolo impegno è condiviso soltanto dopo due approvazioni", () => {
  let state = act(open(), "mamma", "agree-small-step");
  assert.equal(isSharedAgreement(state), false);
  assert.equal(summaryFor(state, "figlio-adulto"), summaryFor(invite(), "figlio-adulto"));
  state = act(state, "papa", "agree-small-step");
  assert.equal(isSharedAgreement(state), true);
  assert.equal(isSharedAgreement(act(state, "mamma", "end")), false);
});

test("SON10: nessun like, match dating o profilo reale è necessario", () => {
  const state = open();
  for (const key of ["likes", "score", "match", "email", "token", "messages"]) {
    assert.equal(Object.hasOwn(state, key), false);
  }
});

test("SON11: l'azzeramento è soltanto un comando esplicito della demo", () => {
  const closed = act(open(), "mamma", "block");
  assert.equal(act(closed, "papa", "reset"), closed);
  assert.equal(act(closed, "figlio-adulto", "reset"), closed);
  assert.deepEqual(act(closed, "demo", "reset"), newFamilyLab());
});

test("SON12: interfaccia accessibile, senza fetch, storage o API reali", async () => {
  const html = await file("index.html");
  const app = await file("app.mjs");
  const policy = await file("policy.mjs");
  assert.match(html, /lang="it"/);
  assert.match(html, /name="robots" content="noindex/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /prefers-reduced-motion/);
  assert.match(app, /status\.textContent/);
  assert.match(app, /document\.createElement/);
  assert.doesNotMatch(app, /innerHTML|outerHTML|insertAdjacentHTML/);
  assert.doesNotMatch(html + app + policy, /\b(fetch|XMLHttpRequest|localStorage|sessionStorage|WebSocket|service_role|createClient)\s*\(/i);
  assert.doesNotMatch(html + app + policy, /https?:\/\/(?!127\.0\.0\.1)/i);
});

test("SON13: server serve solo file espliciti su loopback e ha CSP senza connessioni", async () => {
  const serverFile = new URL("../scripts/local-only/serve-ponte360-family-lab.mjs", import.meta.url);
  const src = await readFile(serverFile, "utf8");
  const check = spawnSync(process.execPath, ["--check", fileURLToPath(serverFile)], { encoding: "utf8" });
  assert.equal(check.status, 0);
  assert.match(src, /const HOST = "127\.0\.0\.1"/);
  assert.match(src, /const assets = new Map\(\[/);
  assert.match(src, /"connect-src 'none'"/);
  assert.match(src, /"Cache-Control": "no-store"/);
  assert.match(src, /assets\.get\(pathname\)/);
  assert.doesNotMatch(src, /createClient|service_role|\.env|localhost\.supabase/);
});
