// Fail closed until a signed, durable and idempotent subscription sync is deployed.
// A non-2xx response tells Stripe that this event has not been processed.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metodo non consentito." });
  }
  res.setHeader("Retry-After", "3600");
  return res.status(503).json({ error: "Sincronizzazione abbonamenti in manutenzione." });
}
