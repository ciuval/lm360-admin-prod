// ✅ File: /api/create-checkout-session.js

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Metodo non consentito");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // ID del piano mensile/annuale
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/attiva-premium`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Errore Stripe:", error);
    return res.status(500).json({ error: "Errore creazione sessione Stripe" });
  }
}
