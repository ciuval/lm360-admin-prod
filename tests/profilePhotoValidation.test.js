import test from "node:test";
import assert from "node:assert/strict";
import {
  MAX_PROFILE_PHOTO_BYTES,
  validateProfilePhoto,
} from "../src/lib/profilePhotoValidation.js";

test("profile photo validation accepts a supported image within the limit", () => {
  assert.deepEqual(validateProfilePhoto({ type: "image/jpeg", size: 1_000_000 }), {
    valid: true,
    reason: null,
  });
});

test("profile photo validation rejects non-images and oversized files", () => {
  assert.equal(validateProfilePhoto({ type: "application/pdf", size: 100 }).reason, "type");
  assert.equal(
    validateProfilePhoto({ type: "image/png", size: MAX_PROFILE_PHOTO_BYTES + 1 }).reason,
    "size"
  );
});
