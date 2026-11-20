/**
 * Blocco di sicurezza per il collaudo con due account sintetici.
 * Non accetta endpoint cloud, LAN, IPv6, tunnel, credenziali in URL
 * o porte diverse da quella locale predefinita di Supabase.
 */
export function assertLocalE2eUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("LOCAL_SUPABASE_URL_REQUIRED");
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("LOCAL_SUPABASE_URL_INVALID");
  }

  const host = url.hostname.toLowerCase();
  const safeHost = host === "localhost" || host === "127.0.0.1";
  if (
    url.protocol !== "http:" ||
    !safeHost ||
    url.port !== "54321" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error("LOCAL_SUPABASE_ONLY");
  }

  return url.origin;
}
