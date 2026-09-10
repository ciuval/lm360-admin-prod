import test from "node:test";
import assert from "node:assert/strict";
import { buildDiscoverableProfiles } from "../src/lib/publicProfiles.js";

const completeProfile = {
  id: "profile-2",
  nome: "Vale",
  bio: "Una bio abbastanza lunga per essere riconoscibile.",
  interessi: "design",
};

test("a gallery-only photo keeps a complete profile discoverable", () => {
  const result = buildDiscoverableProfiles(
    [completeProfile],
    [{ profilo_id: "profile-2", foto_url: "gallery-photo", ordine: 0, is_primary: true }],
    "profile-1"
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].foto_url, "gallery-photo");
});

test("discovery excludes the current user and incomplete profiles", () => {
  const result = buildDiscoverableProfiles(
    [completeProfile, { ...completeProfile, id: "profile-3", bio: "breve" }],
    [
      { profilo_id: "profile-2", foto_url: "own-photo", ordine: 0 },
      { profilo_id: "profile-3", foto_url: "other-photo", ordine: 0 },
    ],
    "profile-2"
  );

  assert.deepEqual(result, []);
});
