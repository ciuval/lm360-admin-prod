// The former public catalog queried the live Stripe account with a secret key.
// Reopen only after a server-owned, reviewed price catalog is in place.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Metodo non consentito." });
  }
  return res.status(503).json({ error: "Prezzi temporaneamente non disponibili." });
}
