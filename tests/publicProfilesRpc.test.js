import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { normalizePublicProfileProjection } from "../src/lib/publicProfiles.js";

const publicRow = {
  id: "user-visible",
  nome: "Bianca",
  bio: "Un profilo sintetico per verificare la scoperta.",
  interessi: "arte, lettura",
  foto_url: "data:image/png;base64,dGVzdA==",
  premium: true,
};

test("RPC V2: il frontend conserva esattamente i sei campi pubblici", () => {
  const rows = normalizePublicProfileProjection([
    {
      ...publicRow,
      email: "fake@example.invalid",
      stripe_customer_id: "not-public",
      ruolo: "super",
      status_account: "attivo",
      profilo_pubblico: true,
    },
  ]);
  assert.deepEqual(rows, [publicRow]);
});

test("RPC V2: nessuna duplicazione del profilo corrente e nessun dato malformato", () => {
  const rows = normalizePublicProfileProjection([
    publicRow,
    { ...publicRow, id: "me" },
    { ...publicRow, id: "missing-photo", foto_url: "" },
    { ...publicRow, id: "missing-bio", bio: "breve" },
    { ...publicRow, id: null },
  ], "me");
  assert.deepEqual(rows, [publicRow]);
});

test("RPC V2: array assente non produce profili", () => {
  assert.deepEqual(normalizePublicProfileProjection(null), []);
  assert.deepEqual(normalizePublicProfileProjection({ data: [publicRow] }), []);
});

test("RPC V2: non inventare il badge Premium quando la risposta non lo conferma", () => {
  const [row] = normalizePublicProfileProjection([{ ...publicRow, premium: null }]);
  assert.equal(row.premium, false);
});

test("RPC V2: nessun fallback a profili o foto altrui e gestione errore chiusa", async () => {
  const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
  for (const path of ["src/pages/PublicProfilesPage.jsx", "src/pages/ProfilePublicCard.jsx"]) {
    const source = await read(path);
    assert.match(source, /"lm360_get_public_profiles"/);
    assert.match(source, /normalizePublicProfileProjection/);
    assert.doesNotMatch(source, /\.from\(["']profili["']\)/);
    assert.doesNotMatch(source, /\.from\(["']profili_foto["']\)/);
  }
  const discovery = await read("src/pages/PublicProfilesPage.jsx");
  const card = await read("src/pages/ProfilePublicCard.jsx");
  assert.match(discovery, /if \(rpcError \|\| !Array\.isArray\(rpcProfiles\)\)/);
  assert.match(discovery, /role="alert"/);
  assert.match(card, /if \(error \|\| !Array\.isArray\(data\)\)/);
  assert.match(card, /if \(!profilo\)/);
  assert.doesNotMatch(card, /profilo\.ruolo/);
});
