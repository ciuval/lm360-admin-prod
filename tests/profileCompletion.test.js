import test from "node:test";
import assert from "node:assert/strict";
import { calculateProfileCompletion } from "../src/lib/profileCompletion.js";

test("a complete profile requires name, bio, interests and a photo", () => {
  const completion = calculateProfileCompletion({
    profile: {
      nome: "Vale",
      bio: "Una bio abbastanza lunga per essere riconoscibile.",
      interessi: "design, tecnologia",
      foto_url: "data:image/jpeg;base64,abc",
    },
  });

  assert.equal(completion.isComplete, true);
  assert.equal(completion.score, 100);
  assert.deepEqual(completion.missingKeys, []);
});

test("an account without a meaningful bio is not discovery-ready", () => {
  const completion = calculateProfileCompletion({
    profile: {
      nome: "Vale",
      bio: "Troppo breve",
      interessi: "design",
      avatar_url: "https://example.test/avatar.jpg",
    },
  });

  assert.equal(completion.isComplete, false);
  assert.equal(completion.score, 75);
  assert.deepEqual(completion.missingKeys, ["bio"]);
});

test("a gallery photo satisfies the photo requirement", () => {
  const completion = calculateProfileCompletion({
    profile: {
      nome: "Vale",
      bio: "Una bio abbastanza lunga per superare la soglia.",
      interessi: ["design"],
    },
    photos: [{ url: "data:image/png;base64,abc" }],
  });

  assert.equal(completion.isComplete, true);
});
