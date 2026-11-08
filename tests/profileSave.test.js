import test from "node:test";
import assert from "node:assert/strict";
import { persistProfile, syncPrimaryProfilePhoto } from "../src/lib/persistProfile.js";

function fakeClient(result = { data: { id: "test-id" }, error: null }) {
  const calls = [];
  const query = {
    eq(...args) {
      calls.push(["eq", ...args]);
      return this;
    },
    select(...args) {
      calls.push(["select", ...args]);
      return this;
    },
    async single() {
      calls.push(["single"]);
      return result;
    },
  };
  const client = {
    from(table) {
      calls.push(["from", table]);
      return {
        update(payload) {
          calls.push(["update", payload]);
          return query;
        },
        insert(payload) {
          calls.push(["insert", payload]);
          return query;
        },
      };
    },
  };
  return { client, calls };
}

const form = {
  userId: "test-id",
  email: "test@example.invalid",
  name: "  Test  ",
  bio: "  Una breve presentazione  ",
  interests: "  musica, lettura  ",
  photoUrl: null,
};

test("un profilo esistente usa UPDATE senza id, email o privilegi commerciali", async () => {
  const { client, calls } = fakeClient();
  const saved = await persistProfile(client, { ...form, profileExists: true });
  assert.equal(saved.id, "test-id");
  assert.deepEqual(calls[0], ["from", "profili"]);
  assert.deepEqual(calls[2], ["eq", "id", "test-id"]);
  const [, payload] = calls[1];
  assert.equal(calls[1][0], "update");
  assert.deepEqual(Object.keys(payload).sort(), ["nome", "bio", "interessi", "foto_url", "updated_at"].sort());
  assert.equal(payload.nome, "Test");
  assert.equal(payload.bio, "Una breve presentazione");
  assert.equal(payload.interessi, "musica, lettura");
  assert.equal(calls.at(-1)[0], "single");
});

test("un profilo mancante usa INSERT con id e email soltanto alla creazione", async () => {
  const { client, calls } = fakeClient();
  await persistProfile(client, { ...form, profileExists: false });
  assert.equal(calls[1][0], "insert");
  assert.equal(calls[1][1].id, "test-id");
  assert.equal(calls[1][1].email, "test@example.invalid");
  assert.equal(calls.some((call) => call[0] === "eq"), false);
});

test("un errore RLS non viene trattato come salvataggio riuscito", async () => {
  const { client } = fakeClient({
    data: null,
    error: { code: "42501", message: "permission denied" },
  });
  await assert.rejects(
    persistProfile(client, { ...form, profileExists: true }),
    (error) => error.code === "42501"
  );
});

test("nessuna riga restituita genera un errore, non un falso successo", async () => {
  const { client } = fakeClient({ data: null, error: null });
  await assert.rejects(
    persistProfile(client, { ...form, profileExists: true }),
    /non confermato/
  );
});


test("sincronizzazione foto aggiorna solo il riferimento sul profilo", async () => {
  const { client, calls } = fakeClient({ data: { id: "test-id", foto_url: "data:image/png;base64,dGVzdA==" }, error: null });
  const data = await syncPrimaryProfilePhoto(client, {
    userId: "test-id",
    photoUrl: "data:image/png;base64,dGVzdA==",
  });
  assert.equal(data.id, "test-id");
  assert.equal(calls[1][0], "update");
  assert.deepEqual(Object.keys(calls[1][1]).sort(), ["foto_url", "updated_at"].sort());
  assert.deepEqual(calls[2], ["eq", "id", "test-id"]);
});

test("rimozione dell'ultima foto azzera il riferimento principale", async () => {
  const { client, calls } = fakeClient({ data: { id: "test-id", foto_url: null }, error: null });
  await syncPrimaryProfilePhoto(client, { userId: "test-id", photoUrl: null });
  assert.equal(calls[1][1].foto_url, null);
});

test("sincronizzazione foto segnala errori RLS, senza falso successo", async () => {
  const { client } = fakeClient({ data: null, error: { code: "42501" } });
  await assert.rejects(
    syncPrimaryProfilePhoto(client, { userId: "test-id", photoUrl: null }),
    (error) => error.code === "42501"
  );
});
