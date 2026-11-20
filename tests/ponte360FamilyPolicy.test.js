import test from "node:test";
import assert from "node:assert/strict";
import {
  newFamilyScenario,
  actOnFamilyScenario as action,
  canOpenMediation,
  mayReadPrivateChat,
  agreementReached,
} from "./helpers/ponte360FamilyPolicy.mjs";

// Simulazioni pure di requisiti F01-F12. NON sono test di RPC/RLS reali.
function invited() {
  return action(newFamilyScenario(), "mamma", "invite");
}
function bothAccepted() {
  return action(action(invited(), "mamma", "accept"), "papa", "accept");
}

test("F01: un consenso non apre la mediazione, e non provoca nuovi inviti", () => {
  const state = action(invited(), "mamma", "accept");
  assert.equal(canOpenMediation(state), false);
  assert.equal(action(state, "mamma", "invite").invitations, 1);
});

test("F02: due consensi separati aprono solo la nuova stanza", () => {
  const state = bothAccepted();
  assert.equal(canOpenMediation(state), true);
  assert.equal(mayReadPrivateChat("ponte360", state), false);
});

test("F03: rifiuto e ritiro sono terminali, senza solleciti", () => {
  for (const kind of ["decline", "withdraw", "end"]) {
    const initial = bothAccepted();
    const state = action(initial, "papa", kind);
    assert.equal(canOpenMediation(state), false);
    assert.equal(action(state, "mamma", "invite").invitations, 1);
    assert.equal(action(state, "mamma", "accept"), state);
  }
});

test("F04: la pausa blocca la sessione mediata", () => {
  const state = action(bothAccepted(), "mamma", "pause");
  assert.equal(state.paused, true);
  assert.equal(canOpenMediation(state), false);
  assert.equal(action(state, "papa", "accept"), state);
});

test("F05: paura o coercizione segnalata interrompono il percorso congiunto", () => {
  const state = action(bothAccepted(), "papa", "stop-for-safety");
  assert.equal(state.safetyStop, true);
  assert.equal(canOpenMediation(state), false);
});

test("F06: il mediatore non legge la precedente chat, neppure con due sì", () => {
  assert.equal(mayReadPrivateChat("ponte360", bothAccepted()), false);
  assert.equal(mayReadPrivateChat("ponte360", invited()), false);
});

test("F07: blocco o chiusura prevalgono sui consensi", () => {
  for (const kind of ["block", "close"]) {
    const state = action(bothAccepted(), "mamma", kind);
    assert.equal(canOpenMediation(state), false);
    assert.equal(action(state, "papa", "invite"), state);
  }
});

test("F08: un minore o terzo non può proporre, accettare o mediare per i genitori", () => {
  const base = invited();
  for (const third of ["figlio", "ponte360", "anon"]) {
    for (const kind of ["accept", "invite", "end", "close"]) {
      assert.equal(action(base, third, kind), base);
    }
  }
  assert.equal(canOpenMediation(base), false);
});

test("F09: non serve un match dating o il ripristino di vecchi like", () => {
  const state = bothAccepted();
  assert.equal(canOpenMediation(state), true);
  assert.equal(Object.hasOwn(state, "datingMatch"), false);
  assert.equal(Object.hasOwn(state, "likes"), false);
});

test("F10: un impegno esiste solo quando entrambi approvano la stessa proposta", () => {
  let state = action(bothAccepted(), "mamma", "propose-agreement", "turni di organizzazione");
  state = action(state, "mamma", "accept-agreement", "turni di organizzazione");
  assert.equal(agreementReached(state), false);
  const wrong = action(state, "papa", "accept-agreement", "altro argomento");
  assert.equal(agreementReached(wrong), false);
  const both = action(wrong, "papa", "accept-agreement", "turni di organizzazione");
  assert.equal(agreementReached(both), true);
});

test("F11: il terzo non può confermare il consenso altrui", () => {
  const state = action(invited(), "mamma", "accept");
  assert.equal(action(state, "ponte360", "accept"), state);
  assert.equal(canOpenMediation(state), false);
});

test("F12: la fine senza riconciliazione non produce un punteggio", () => {
  const state = action(bothAccepted(), "mamma", "end");
  assert.equal(canOpenMediation(state), false);
  assert.equal(Object.hasOwn(state, "score"), false);
  assert.equal(Object.hasOwn(state, "penalty"), false);
});
