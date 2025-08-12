// ✅ File: /api/create-price.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  const { nickname, unit_amount, currency, product } = req.body;

  if (!unit_amount || !currency || !product) {
    return res.status(400).json({ error: "Dati incompleti" });
  }

  try {
    const price = await stripe.prices.create({
      unit_amount,
      currency,
      product,
      nickname,
      recurring: { interval: "month" } // puoi modificare in "year" se serve
    });

    return res.status(200).json(price);
  } catch (err) {
    console.error("Errore Stripe:", err);
    return res.status(500).json({ error: err.message });
  }
}
