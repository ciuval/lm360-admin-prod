// Creating recurring prices is an administrative Stripe operation.
// This legacy public endpoint remains disabled while billing is reconciled.
export default function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(410).json({ error: "Endpoint non disponibile." });
}
