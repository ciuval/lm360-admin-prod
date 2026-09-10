export const MAX_PROFILE_PHOTO_BYTES = 5 * 1024 * 1024;

export function validateProfilePhoto(file) {
  if (!file || !String(file.type || "").toLowerCase().startsWith("image/")) {
    return { valid: false, reason: "type" };
  }

  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > MAX_PROFILE_PHOTO_BYTES) {
    return { valid: false, reason: "size" };
  }

  return { valid: true, reason: null };
}
