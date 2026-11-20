import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { loadConsentedPartnerName } from "../src/lib/partnerDisplayName.js";

const a = "00000000-0000-4000-8000-0000000000a1";
const b = "00000000-0000-4000-8000-0000000000b2";
const c = "00000000-0000-4000-8000-0000000000c3";

const allowed = {
  id: b, nome: "Bianca Test",
  bio: "Profilo sintetico completo per eseguire controlli.",
  interessi: "arte, lettura",
  foto_url: "data:image/png;base64,dGVzdA==",
  premium: false, email: "privata@example.test",
};

test("Stanza e chat mostrano soltanto il nome con consenso verificato", async () => {
  const calls = [];
  const client = {
    rpc: async (name, args) => {
      calls.push([name, args]);
      return { data: [allowed], error: null };
    },
    from() { throw new Error("Non leggere mai profili direttamente"); },
  };
  assert.equal(await loadConsentedPartnerName(client, a, b), "Bianca Test");
  assert.deepEqual(calls, [["lm360_get_public_profiles", { p_profile_id: b }]]);
});

test("assenza consenso o profilo non disponibile non rivelano nome", async () => {
  for (const data of [[], null, [{ ...allowed, id: c }], [{ ...allowed, nome: "  " }]]) {
    const client = { rpc: async () => ({ data, error: null }) };
    assert.equal(await loadConsentedPartnerName(client, a, b), "questa persona");
  }
});

test("accesso negato, RPC fallita o sessione assente mantengono fallback", async () => {
  const denied = { rpc: async () => ({ data: null, error: { code: "42501" } }) };
  const failing = { rpc: async () => { throw new Error("unavailable"); } };
  assert.equal(await loadConsentedPartnerName(denied, a, b), "questa persona");
  assert.equal(await loadConsentedPartnerName(failing, a, b), "questa persona");
  const noCalls = { rpc: () => { throw new Error("should not be called"); } };
  assert.equal(await loadConsentedPartnerName(noCalls, null, b), "questa persona");
  assert.equal(await loadConsentedPartnerName(noCalls, a, a), "questa persona");
});

test("le route Stanza e Chat mantengono i gate di match e compatibilità", async () => {
  const stanza = await readFile(new URL("../src/pages/Stanza360Page.jsx", import.meta.url), "utf8");
  const chat = await readFile(new URL("../src/pages/ChatBox.jsx", import.meta.url), "utf8");
  for (const page of [stanza, chat]) {
    assert.match(page, /loadConsentedPartnerName\(supabase,/);
    assert.match(page, /"match_scores"/);
    assert.match(page, /"get_stanza_compatibility"/);
    assert.doesNotMatch(page, /\.from\(["']profili["']\)/);
    assert.match(page, /Boolean\(.*opens\)/);
  }
  assert.match(stanza, /allowed = !roomResult\.error && !match\.error && Boolean\(match\.data\)/);
  assert.match(stanza, /<Link to={`\/chat\/\$\{id\}`}/);
  assert.match(chat, /if \(matchError \|\| roomError\)/);
  assert.match(chat, /disabled=\{!chatAbilitata \|\| sending\}/);
  assert.match(chat, /\.rpc\("send_stanza_message"/);
});
