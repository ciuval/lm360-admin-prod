// /api/stripe-webhook.js — robusto per DEV: sempre JSON, gestisce sub + checkout
export default async function handler(req, res) {
  try {
    // Leggi RAW body (serve anche a Stripe)
    const raw = await new Promise(r => { let b=""; req.on("data", c=>b+=c); req.on("end",()=>r(b)); });

    // Env obbligatorie
    const supaUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!supaUrl || !supaKey || !stripeKey) {
      return res.status(200).json({ ok:false, step:"env", error:"missing_env" });
    }
    const { createClient } = await import("@supabase/supabase-js");
    const { default: Stripe } = await import("stripe");
    const sb = createClient(supaUrl, supaKey);
    const stripe = new Stripe(stripeKey);

    // Prova a verificare la firma se presente (dev-friendly: fallback parse)
    let event = null;
    const sig = req.headers["stripe-signature"];
    const whsec = process.env.STRIPE_WEBHOOK_SECRET;
    if (sig && whsec) {
      try { event = stripe.webhooks.constructEvent(raw, sig, whsec); } catch (e) {
        // In DEV: se la verifica fallisce, non blocchiamo: usiamo parse diretto
        try { event = JSON.parse(raw || "{}"); event._noVerify=true; } catch { return res.status(200).json({ ok:false, step:"parse", error:"invalid_json" }); }
      }
    } else {
      // Nessuna firma (curl locale): parse diretto
      try { event = JSON.parse(raw || "{}"); event._noVerify=true; } catch { return res.status(200).json({ ok:false, step:"parse", error:"invalid_json" }); }
    }

    const type = event?.type || "unknown";
    const obj  = event?.data?.object || {};

    // Helper: converte epoch sec -> ISO
    const toIso = (s) => (s ? new Date(s * 1000).toISOString() : null);

    // Funzione: salva/aggiorna in tabella "abbonamenti"
    async function upsertFromSub(sub, hint) {
      const priceId = sub?.items?.data?.[0]?.price?.id || null;
      const rec = {
        subscription_id: sub.id || null,
        status: sub.status || null,
        inizio: toIso(sub.current_period_start) || null,
        scadenza: toIso(sub.current_period_end) || null,
        price_id: priceId,
        ultima_modifica: new Date().toISOString(),
        source: "stripe"
      };
      const { error } = await sb.from("abbonamenti").upsert(rec, { onConflict: "subscription_id" });
      if (error) return { ok:false, step:"upsert", error:error.message, hint, rec };
      return { ok:true, step:"upsert", rec, hint };
    }

    // Router eventi
    let result = null;

    if (type.startsWith("customer.subscription.")) {
      // qui l'oggetto è già la subscription completa
      result = await upsertFromSub(obj, "sub_event");
    }
    else if (type === "checkout.session.completed") {
      // recupera la subscription legata alla sessione
      const subId = obj?.subscription;
      if (!subId) return res.status(200).json({ ok:false, step:"no_subscription_in_session" });
      const sub = await stripe.subscriptions.retrieve(subId);
      result = await upsertFromSub(sub, "from_session");
    }
    else if (type === "invoice.payment_succeeded") {
      // spesso contiene subscription id; prova a risalire
      const subId = (obj?.subscription && typeof obj.subscription === "string") ? obj.subscription : null;
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        result = await upsertFromSub(sub, "from_invoice");
      } else {
        result = { ok:true, step:"ignored_invoice_no_sub" };
      }
    }
    else {
      // altri tipi: non bloccare, ma conferma ricezione
      result = { ok:true, step:"ignored", type };
    }

    return res.status(200).json({ received:true, type, ...result });
  } catch (e) {
    return res.status(200).json({ ok:false, step:"fatal", error:String(e?.message || e) });
  }
}
