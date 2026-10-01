// Billing is paused. Never create a live Checkout Session from an unauthenticated request.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo non consentito." });
  }
  return res.status(503).json({ error: "Abbonamenti temporaneamente non disponibili." });
}
