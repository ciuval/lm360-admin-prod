import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { setProfileVisibility } from "../src/lib/profileVisibility.js";

const userId = "example-user-id";
const validProfile = {
  nome: "Sofia",
  bio: "Sono qui per conoscere persone con interessi autentici.",
  interessi: "arte",
  foto_url: "data:image/png;base64,dGVzdA==",
  status_account: "attivo",
};

function fakeClient({ profile = validProfile, photos = [], profileError = null, photoError = null, updateError = null, updateResponse = null } = {}) {
  const calls = [];
  const client = {
    from(table) {
      const context = { table, updated: false, payload: null };
      return {
        select(fields) { calls.push(["select",table,fields]); return this; },
        eq(field, value) { calls.push(["eq",table,field,value]); return this; },
        update(payload) { context.updated = true; context.payload = payload; calls.push(["update",table,payload]); return this; },
        async single() {
          if (context.updated) {
            return {
              data: updateResponse === null ? { id: userId, profilo_pubblico: context.payload.profilo_pubblico } : updateResponse,
              error: updateError,
            };
          }
          return { data: profile, error: profileError };
        },
        async limit(value) {
          calls.push(["limit",table,value]);
          return { data: photos, error: photoError };
        },
      };
    },
  };
  return { client, calls };
}

test("pubblicazione richiede utente autenticato", async () => {
  const { client, calls } = fakeClient();
  await assert.rejects(setProfileVisibility(client, { userId: null, makePublic: true }), /NOT_AUTHENTICATED/);
  assert.equal(calls.length, 0);
});

test("pubblicazione richiede dati realmente salvati e confermati", async () => {
  const { client, calls } = fakeClient({ profile: { ...validProfile, bio: "breve" } });
  await assert.rejects(setProfileVisibility(client, { userId, makePublic: true }), /PROFILE_INCOMPLETE/);
  assert.equal(calls.some(x => x[0] === "update"), false);
});

test("foto presente solo in galleria consente la richiesta esplicita di visibilita", async () => {
  const { client, calls } = fakeClient({
    profile: { ...validProfile, foto_url: "" },
    photos: [{ foto_url: "data:image/png;base64,dGVzdA==" }],
  });
  assert.equal(await setProfileVisibility(client, { userId, makePublic: true }), true);
  assert.deepEqual(calls.find(x => x[0] === "update")?.[2], { profilo_pubblico: true });
});

test("errore RLS o lettura foto blocca la pubblicazione senza scrivere", async () => {
  const { client, calls } = fakeClient({ photoError: { code: "42501" } });
  await assert.rejects(setProfileVisibility(client, { userId, makePublic: true }), /VISIBILITY_CHECK_FAILED/);
  assert.equal(calls.some(x => x[0] === "update"), false);
});

test("il proprietario puo sempre nascondere il profilo anche se incompleto", async () => {
  const { client, calls } = fakeClient({ profile: null });
  assert.equal(await setProfileVisibility(client, { userId, makePublic: false }), false);
  assert.deepEqual(calls.filter(x => x[0] === "update")[0][2], { profilo_pubblico: false });
  assert.equal(calls.some(x => x[0] === "limit"), false);
});

test("nessun falso successo su UPDATE fallito o non confermato", async () => {
  for (const option of [{ updateError: { code: "42501" } }, { updateResponse: { id: userId, profilo_pubblico: true } }]) {
    const { client } = fakeClient(option);
    await assert.rejects(setProfileVisibility(client, { userId, makePublic: false }), /VISIBILITY_SAVE_FAILED/);
  }
});

test("frontend prevede opt-in, filtri di visibilita e anteprima privata del proprietario", async () => {
  const read = async (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const profilePage = await read("src/pages/ProfilePage.jsx");
  const profileCard = await read("src/pages/ProfilePublicCard.jsx");
  const discovery = await read("src/pages/PublicProfilesPage.jsx");
  assert.match(profilePage, /Autorizza la visibilità del mio profilo/);
  assert.match(profilePage, /Nascondi il mio profilo/);
  assert.match(profilePage, /setProfileVisibility\(supabase/);
  assert.match(profilePage, /profilo_pubblico: false/);
  assert.match(profileCard, /\.rpc\(/);
  assert.match(profileCard, /"lm360_get_public_profiles"/);
  assert.match(discovery, /"lm360_get_public_profiles"/);
  assert.doesNotMatch(profileCard, /\.from\("profili"\)/);
  assert.doesNotMatch(profileCard, /\.from\("profili_foto"\)/);
  assert.doesNotMatch(discovery, /\.from\("profili"\)/);
  assert.doesNotMatch(discovery, /\.from\("profili_foto"\)/);
});
