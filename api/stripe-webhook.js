import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const config = { api: { bodyParser: false } };

function buffer(readable) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readable.on("data", (chunk) => chunks.push(chunk));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });
}

function safeLog(code, extra = {}) {
  // no PII
  try { console.log(code, extra); } catch {}
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecret || !webhookSecret || !supabaseUrl || !supabaseService) {
    safeLog("stripe_webhook_missing_env");
    return res.status(500).send("Server misconfigured");
  }

  const stripe = new Stripe(stripeSecret);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    const buf = await buffer(req);
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch {
    safeLog("stripe_webhook_invalid_signature");
    return res.status(400).send("Webhook Error");
  }

  const supabase = createClient(supabaseUrl, supabaseService);

  // idempotenza: logga duplicato ma NON uscire
  let isDuplicate = false;
  try {
    const { error } = await supabase.from("stripe_webhook_events").insert({ id: event.id, type: event.type });
    if (error) isDuplicate = true;
  } catch {}

  async function userIdFromEmail(email) {
    if (!email) return null;
    try {
      const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error || !data?.users) return null;
      const e = email.toLowerCase();
      const u = data.users.find((x) => (x.email || "").toLowerCase() === e);
      return u?.id || null;
    } catch {
      return null;
    }
  }

  async function emailFromCustomerId(customerId) {
    if (!customerId) return null;
    try {
      const cust = await stripe.customers.retrieve(customerId);
      if (cust && typeof cust === "object") return cust.email || null;
    } catch {}
    return null;
  }

  async function premiumUntilFromSubscriptionId(subscriptionId) {
    if (!subscriptionId) return null;
    try {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      return sub?.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;
    } catch {
      return null;
    }
  }

  async function upsertProfilePremium({ userId, customerId, subscriptionId, premiumUntilISO }) {
    if (!userId) return;
    await supabase.from("profiles").upsert(
      {
        id: userId,
        is_premium: true,
        stripe_customer_id: customerId || null,
        stripe_subscription_id: subscriptionId || null,
        premium_until: premiumUntilISO || null,
      },
      { onConflict: "id" }
    );
  }

  async function upsertProfileOff({ userId, customerId, subscriptionId, premiumUntilISO }) {
    if (!userId) return;
    // Se premium_until è nel futuro puoi decidere di lasciarlo true; qui spegniamo duro.
    await supabase.from("profiles").upsert(
      {
        id: userId,
        is_premium: false,
        stripe_customer_id: customerId || null,
        stripe_subscription_id: subscriptionId || null,
        premium_until: premiumUntilISO || null,
      },
      { onConflict: "id" }
    );
  }

  async function logBillingEvent(payload) {
    // Unique stripe_event_id evita duplicati reali
    try {
      await supabase.from("billing_events").insert(payload);
    } catch {}
  }

  async function maybeCreateRefundRequestAuto({ userId, email, paymentIntentId, chargeId, invoiceId, subscriptionId, amount, currency, reason, raw }) {
    if (!userId || (!paymentIntentId && !chargeId)) return;
    // crea una richiesta "auto" pending; cron la processa
    await supabase.from("refund_requests").insert({
      user_id: userId,
      email: email || null,
      mode: "auto",
      status: "pending",
      reason: reason || "premium_not_activated",
      stripe_payment_intent_id: paymentIntentId || null,
      stripe_charge_id: chargeId || null,
      stripe_invoice_id: invoiceId || null,
      stripe_subscription_id: subscriptionId || null,
      amount: amount || null,
      currency: currency || null,
      raw: raw || null
    });
  }

  async function markRefundSynced({ paymentIntentId, chargeId, status, raw }) {
    // aggiorna tutte le richieste collegate
    const q = supabase.from("refund_requests").update({
      status,
      raw: raw || null
    });
    if (paymentIntentId) await q.eq("stripe_payment_intent_id", paymentIntentId);
    else if (chargeId) await q.eq("stripe_charge_id", chargeId);
  }

  try {
    // A) checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const email =
        session?.customer_details?.email ||
        session?.customer_email ||
        session?.receipt_email ||
        null;

      const customerId = typeof session?.customer === "string" ? session.customer : null;
      const subscriptionId = typeof session?.subscription === "string" ? session.subscription : null;
      const paymentIntentId = typeof session?.payment_intent === "string" ? session.payment_intent : null;

      const userId = session?.metadata?.user_id || (await userIdFromEmail(email));
      const premiumUntilISO = await premiumUntilFromSubscriptionId(subscriptionId);

      await logBillingEvent({
        user_id: userId,
        email: email,
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_payment_intent_id: paymentIntentId,
        amount: session?.amount_total ?? null,
        currency: session?.currency ?? null,
        status: session?.payment_status ?? null,
        raw: session
      });

      await upsertProfilePremium({ userId, customerId, subscriptionId, premiumUntilISO });

      safeLog("stripe_webhook_ok", { type: event.type, duplicate: isDuplicate });
      return res.status(200).json({ received: true, duplicate: isDuplicate });
    }

    // B) invoice.paid
    if (event.type === "invoice.paid") {
      const invoice = event.data.object;

      const customerId = typeof invoice?.customer === "string" ? invoice.customer : null;
      const subscriptionId = typeof invoice?.subscription === "string" ? invoice.subscription : null;
      const invoiceId = invoice?.id || null;
      const paymentIntentId = typeof invoice?.payment_intent === "string" ? invoice.payment_intent : null;
      const chargeId = typeof invoice?.charge === "string" ? invoice.charge : null;

      let email = invoice?.customer_email || null;
      if (!email) email = await emailFromCustomerId(customerId);

      const userId = await userIdFromEmail(email);
      const premiumUntilISO = await premiumUntilFromSubscriptionId(subscriptionId);

      await logBillingEvent({
        user_id: userId,
        email,
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_invoice_id: invoiceId,
        stripe_payment_intent_id: paymentIntentId,
        stripe_charge_id: chargeId,
        amount: invoice?.amount_paid ?? null,
        currency: invoice?.currency ?? null,
        status: invoice?.status ?? null,
        raw: invoice
      });

      await upsertProfilePremium({ userId, customerId, subscriptionId, premiumUntilISO });

      safeLog("stripe_webhook_ok", { type: event.type, duplicate: isDuplicate });
      return res.status(200).json({ received: true, duplicate: isDuplicate });
    }

    // C) customer.subscription.created
    if (event.type === "customer.subscription.created") {
      const sub = event.data.object;

      const customerId = typeof sub?.customer === "string" ? sub.customer : null;
      const subscriptionId = sub?.id || null;

      const email = await emailFromCustomerId(customerId);
      const userId = await userIdFromEmail(email);

      const premiumUntilISO =
        sub?.items?.data?.[0]?.current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
          : (sub?.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null);

      await logBillingEvent({
        user_id: userId,
        email,
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: sub?.status ?? null,
        raw: sub
      });

      await upsertProfilePremium({ userId, customerId, subscriptionId, premiumUntilISO });

      safeLog("stripe_webhook_ok", { type: event.type, duplicate: isDuplicate });
      return res.status(200).json({ received: true, duplicate: isDuplicate });
    }

    // D) customer.subscription.deleted (spegnimento)
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;

      const customerId = typeof sub?.customer === "string" ? sub.customer : null;
      const subscriptionId = sub?.id || null;

      const email = await emailFromCustomerId(customerId);
      const userId = await userIdFromEmail(email);

      const premiumUntilISO =
        sub?.items?.data?.[0]?.current_period_end
          ? new Date(sub.items.data[0].current_period_end * 1000).toISOString()
          : (sub?.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null);

      await logBillingEvent({
        user_id: userId,
        email,
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: sub?.status ?? "deleted",
        raw: sub
      });

      await upsertProfileOff({ userId, customerId, subscriptionId, premiumUntilISO });

      safeLog("stripe_webhook_ok", { type: event.type, duplicate: isDuplicate });
      return res.status(200).json({ received: true, duplicate: isDuplicate });
    }

    // E) charge.refunded / refund.updated → sync stato richieste
    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const chargeId = charge?.id || null;
      const paymentIntentId = typeof charge?.payment_intent === "string" ? charge.payment_intent : null;

      await logBillingEvent({
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        stripe_charge_id: chargeId,
        stripe_payment_intent_id: paymentIntentId,
        amount: charge?.amount_refunded ?? null,
        currency: charge?.currency ?? null,
        status: "refunded",
        raw: charge
      });

      await markRefundSynced({ paymentIntentId, chargeId, status: "refunded", raw: charge });
      safeLog("stripe_webhook_ok", { type: event.type, duplicate: isDuplicate });
      return res.status(200).json({ received: true, duplicate: isDuplicate });
    }

    if (event.type === "refund.updated") {
      const refund = event.data.object;
      const chargeId = typeof refund?.charge === "string" ? refund.charge : null;
      const paymentIntentId = typeof refund?.payment_intent === "string" ? refund.payment_intent : null;
      const st = refund?.status === "succeeded" ? "refunded" : (refund?.status || "pending");

      await logBillingEvent({
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        stripe_charge_id: chargeId,
        stripe_payment_intent_id: paymentIntentId,
        amount: refund?.amount ?? null,
        currency: refund?.currency ?? null,
        status: st,
        raw: refund
      });

      await markRefundSynced({ paymentIntentId, chargeId, status: st, raw: refund });
      safeLog("stripe_webhook_ok", { type: event.type, duplicate: isDuplicate });
      return res.status(200).json({ received: true, duplicate: isDuplicate });
    }

    // F) invoice.payment_failed → (opzionale) spegni premium e crea richiesta manual review
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;
      const customerId = typeof invoice?.customer === "string" ? invoice.customer : null;
      const subscriptionId = typeof invoice?.subscription === "string" ? invoice.subscription : null;
      const invoiceId = invoice?.id || null;
      const paymentIntentId = typeof invoice?.payment_intent === "string" ? invoice.payment_intent : null;

      let email = invoice?.customer_email || null;
      if (!email) email = await emailFromCustomerId(customerId);

      const userId = await userIdFromEmail(email);

      await logBillingEvent({
        user_id: userId,
        email,
        stripe_event_id: event.id,
        stripe_event_type: event.type,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_invoice_id: invoiceId,
        stripe_payment_intent_id: paymentIntentId,
        amount: invoice?.amount_due ?? null,
        currency: invoice?.currency ?? null,
        status: "payment_failed",
        raw: invoice
      });

      // non spegniamo duro: lasciamo che premium_until governi (UI smart). Qui lasciamo invariato.
      safeLog("stripe_webhook_ok", { type: event.type, duplicate: isDuplicate });
      return res.status(200).json({ received: true, duplicate: isDuplicate });
    }

    safeLog("stripe_webhook_ignored", { type: event.type, duplicate: isDuplicate });
    return res.status(200).json({ received: true, ignored: true, duplicate: isDuplicate });
  } catch {
    safeLog("stripe_webhook_processing_error", { type: event.type });
    return res.status(200).json({ received: true, duplicate: isDuplicate });
  }
}
