import test from "node:test";
import assert from "node:assert/strict";
import { loadVisibleMatchedProfiles } from "../src/lib/matchProfiles.js";

const a = "00000000-0000-4000-8000-0000000000a1";
const b = "00000000-0000-4000-8000-0000000000b2";
const c = "00000000-0000-4000-8000-0000000000c3";
const mutual = { user_a: a, user_b: b, score: 100 };
const visibleBianca = {
  id: b,
  nome: "Bianca Test",
  bio: "Una descrizione sintetica per i nostri test locali.",
  interessi: "lettura, arte",
  foto_url: "data:image/png;base64,dGVzdA==",
  premium: false,
  email: "non-deve-comparire@example.test",
  stripe_customer_id: "non-deve-comparire",
};

function fakeClient({
  matches = [mutual], matchError = null,
  profileResults = { [b]: [visibleBianca] }, rpcErrors = {},
} = {}) {
  const calls = [];
  const client = {
    from(table) {
      calls.push({ method: "from", table });
      assert.equal(table, "match_scores", "Mai leggere profili direttamente");
      return {
        select(fields) { calls.push({ method: "select", fields }); return this; },
        or(filter) { calls.push({ method: "or", filter }); return this; },
        async eq(field, value) {
          calls.push({ method: "eq", field, value });
          return { data: matches, error: matchError };
        },
      };
    },
    async rpc(name, args) {
      calls.push({ method: "rpc", name, args });
      assert.equal(name, "lm360_get_public_profiles");
      return { data: profileResults[args.p_profile_id] || [], error: rpcErrors[args.p_profile_id] || null };
    },
  };
  return { client, calls };
}

test("match 100 visibile: espone esclusivamente la proiezione pubblica autorizzata", async () => {
  const { client, calls } = fakeClient();
  const result = await loadVisibleMatchedProfiles(client, a);
  assert.equal(result.hasReciprocalMatch, true);
  assert.equal(result.profiles.length, 1);
  assert.deepEqual(Object.keys(result.profiles[0]).sort(),
    ["bio", "foto_url", "id", "interessi", "nome", "premium"]);
  assert.equal(result.profiles[0].nome, "Bianca Test");
  assert.equal(calls.filter(x => x.method === "rpc").length, 1);
  assert.deepEqual(calls.find(x => x.method === "rpc").args, { p_profile_id: b });
  assert.deepEqual(calls.filter(x => x.method === "from").map(x => x.table), ["match_scores"]);
  assert.equal(calls.find(x => x.method === "eq").value, 100);
});

test("solo un like: nessuna scheda e nessuna query al profilo partner", async () => {
  const { client, calls } = fakeClient({ matches: [] });
  assert.deepEqual(await loadVisibleMatchedProfiles(client, a), {
    profiles: [], hasReciprocalMatch: false,
  });
  assert.equal(calls.some(x => x.method === "rpc"), false);
});

test("revoca visibilita: match conservato senza accesso a profili privati", async () => {
  const { client, calls } = fakeClient({ profileResults: { [b]: [] } });
  const result = await loadVisibleMatchedProfiles(client, a);
  assert.equal(result.hasReciprocalMatch, true);
  assert.deepEqual(result.profiles, []);
  assert.equal(calls.filter(x => x.method === "rpc").length, 1);
});

test("una RPC non puo far comparire un profilo diverso dal partner richiesto", async () => {
  const { client } = fakeClient({
    profileResults: { [b]: [{ ...visibleBianca, id: c }] },
  });
  const result = await loadVisibleMatchedProfiles(client, a);
  assert.deepEqual(result.profiles, []);
});

test("errore SQL/RLS della lista match o della RPC interrompe la lettura in modo sicuro", async () => {
  const denied = fakeClient({ matchError: { code: "42501" } });
  await assert.rejects(loadVisibleMatchedProfiles(denied.client, a), /MATCH_READ_FAILED/);
  assert.equal(denied.calls.some(x => x.method === "rpc"), false);

  const rpcDenied = fakeClient({ rpcErrors: { [b]: { code: "42501" } } });
  await assert.rejects(loadVisibleMatchedProfiles(rpcDenied.client, a),
    /MATCH_PUBLIC_PROFILE_READ_FAILED/);
});

test("ignora righe non appartenenti alla coppia, score errati e duplicati", async () => {
  const { client, calls } = fakeClient({
    matches: [
      mutual,
      mutual,
      { user_a: c, user_b: b, score: 100 },
      { user_a: a, user_b: c, score: 0 },
    ],
  });
  const result = await loadVisibleMatchedProfiles(client, a);
  assert.equal(result.profiles.length, 1);
  assert.equal(calls.filter(x => x.method === "rpc").length, 1);
});

test("senza sessione non tenta alcuna lettura", async () => {
  const { client, calls } = fakeClient();
  assert.deepEqual(await loadVisibleMatchedProfiles(client, null),
    { profiles: [], hasReciprocalMatch: false });
  assert.equal(calls.length, 0);
});
