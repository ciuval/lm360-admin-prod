import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const token = (req.query?.token || "").toString();
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return res.status(401).send("Unauthorized");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // Regola: auto-refund se
  // - refund_request pending mode=auto
  // - creato da > 10 min
  // - utente NON premium (is_premium false) e premium_until non futuro
  const cutoff = new Date(Date.now() - 10 * 60 * 1000).toISOString();

  // prendi richieste pending
  const { data: reqs, error } = await supabase
    .from("refund_requests")
    .select("id,user_id,stripe_payment_intent_id,stripe_charge_id,amount,currency,created_at")
    .eq("status", "pending")
    .eq("mode", "auto")
    .lt("created_at", cutoff)
    .limit(25);

  if (error) return res.status(200).json({ ok: false });

  let processed = 0;

  for (const r of reqs || []) {
    // check stato profilo
    const { data: prof } = await supabase
      .from("profiles")
      .select("is_premium,premium_until")
      .eq("id", r.user_id)
      .single();

    const isPremium = !!prof?.is_premium;
    const until = prof?.premium_until ? new Date(prof.premium_until).getTime() : 0;
    const stillValid = until && until > Date.now();

    if (isPremium || stillValid) {
      // non rimborsare se premium si è attivato
      await supabase.from("refund_requests").update({ status: "rejected", failure_code: "premium_active" }).eq("id", r.id);
      continue;
    }

    try {
      // crea refund (preferisci payment_intent se disponibile)
      let refund;
      if (r.stripe_payment_intent_id) {
        refund = await stripe.refunds.create({
          payment_intent: r.stripe_payment_intent_id,
          // amount opzionale: lasciamo full
        });
      } else if (r.stripe_charge_id) {
        refund = await stripe.refunds.create({
          charge: r.stripe_charge_id,
        });
      } else {
        await supabase.from("refund_requests").update({ status: "failed", failure_code: "missing_pi_charge" }).eq("id", r.id);
        continue;
      }

      await supabase
        .from("refund_requests")
        .update({ status: "refunded", raw: refund })
        .eq("id", r.id);

      processed += 1;
    } catch (e) {
      await supabase
        .from("refund_requests")
        .update({ status: "failed", failure_code: "stripe_refund_failed", failure_message: "refund_failed" })
        .eq("id", r.id);
    }
  }

  return res.status(200).json({ ok: true, processed });
}
