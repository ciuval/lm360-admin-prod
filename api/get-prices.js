import Stripe from "stripe";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.setHeader("Allow", "GET, HEAD");
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    if (req.method === "HEAD") {
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
      return res.status(200).end();
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: "Missing STRIPE_SECRET_KEY" });
    }

    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

    const idsRaw = (req.query?.ids || "").toString().trim();
    const ids = idsRaw ? idsRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ["data.product"]
    });

    const data = ids.length
      ? prices.data.filter(p => ids.includes(p.id))
      : prices.data;

    const out = data.map(p => ({
      id: p.id,
      currency: p.currency,
      unit_amount: p.unit_amount,
      recurring: p.recurring ? { interval: p.recurring.interval, interval_count: p.recurring.interval_count } : null,
      product: p.product && typeof p.product === "object"
        ? { id: p.product.id, name: p.product.name }
        : { id: String(p.product), name: null }
    }));

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ prices: out });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
}