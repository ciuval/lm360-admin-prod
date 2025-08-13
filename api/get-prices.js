// ✅ File: /api/get-prices.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end("Metodo non consentito");
  }

  try {
    const prices = await stripe.prices.list({ limit: 100 });
    const filtered = prices.data.map((price) => ({
      id: price.id,
      nickname: price.nickname,
      currency: price.currency,
      unit_amount: price.unit_amount,
      product: price.product,
    }));
    res.status(200).json(filtered);
  } catch (err) {
    console.error("Errore get-prices:", err.message);
    res.status(500).json({ error: "Errore durante il recupero dei prezzi Stripe." });
  }
}
