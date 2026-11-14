import test from "node:test";
import assert from "node:assert/strict";
import { loadHomeProfileStatus } from "../src/lib/homeProfileStatus.js";

const complete = {
  nome: "Mario",
  bio: "Mi piace conoscere persone con calma e autenticità.",
  interessi: "lettura",
};
const account = { isAuthed: true, tier: "free", user: { id: "user-test" }, profile: complete };

function fakeClient(rows = [], error = null) {
  const calls = [];
  const client = {
    from(table) {
      calls.push(["from", table]);
      return {
        select(cols) {
          calls.push(["select", cols]);
          return this;
        },
        eq(col, value) {
          calls.push(["eq", col, value]);
          return this;
        },
        async limit(count) {
          calls.push(["limit", count]);
          return { data: rows, error };
        },
      };
    },
  };
  return { client, calls };
}

test("home ospite non consulta foto e non presume un profilo completo", async () => {
  const { client, calls } = fakeClient();
  const status = await loadHomeProfileStatus(client, { isAuthed: false });
  assert.deepEqual(status, { ready: false, verificationFailed: false });
  assert.equal(calls.length, 0);
});

test("home considera completa anche la foto presente soltanto in galleria", async () => {
  const { client, calls } = fakeClient([{ foto_url: "data:image/png;base64,dGVzdA==" }]);
  const status = await loadHomeProfileStatus(client, account);
  assert.deepEqual(status, { ready: true, verificationFailed: false });
  assert.deepEqual(calls, [
    ["from", "profili_foto"],
    ["select", "foto_url"],
    ["eq", "profilo_id", "user-test"],
    ["limit", 1],
  ]);
});

test("home non dichiara pronto un nome di un solo carattere", async () => {
  const { client } = fakeClient([{ foto_url: "data:image/png;base64,dGVzdA==" }]);
  const status = await loadHomeProfileStatus(client, {
    ...account,
    profile: { ...complete, nome: "M" },
  });
  assert.equal(status.ready, false);
  assert.equal(status.verificationFailed, false);
});

test("home non dichiara completo un profilo senza foto", async () => {
  const { client } = fakeClient();
  const status = await loadHomeProfileStatus(client, account);
  assert.equal(status.ready, false);
});

test("home rispetta la foto principale anche se la galleria è vuota", async () => {
  const { client } = fakeClient();
  const status = await loadHomeProfileStatus(client, {
    ...account,
    profile: { ...complete, foto_url: "data:image/png;base64,dGVzdA==" },
  });
  assert.equal(status.ready, true);
});

test("un errore nel controllo foto non viene scambiato per un profilo pronto", async () => {
  const { client } = fakeClient([], { code: "42501" });
  const status = await loadHomeProfileStatus(client, {
    ...account,
    profile: { ...complete, foto_url: "data:image/png;base64,dGVzdA==" },
  });
  assert.deepEqual(status, { ready: false, verificationFailed: true });
});
