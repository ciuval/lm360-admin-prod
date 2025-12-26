// webhook/server.js — Stripe Webhook + Checkout (subscription) + Supabase + Email
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const app = express();
app.disable('x-powered-by');

const PORT = Number(process.env.PORT || 3000);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ---------- Stripe / Supabase ----------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY /*, { apiVersion: '2024-11-20.acacia' } */);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ---------- Email ----------
const smtpReady = !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS;
const transporter = smtpReady
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

async function sendMailSafe({ to, subject, html }) {
  if (!to) return;
  if (!transporter) {
    console.log('✉️  [MOCK EMAIL]', { to, subject });
    return;
  }
  await transporter.sendMail({
    from: `"LoveMatch360" <${process.env.SMTP_USER}>`,
    to, subject, html,
  });
}

// ---------- Rotte base ----------
app.get('/', (_req, res) =>
  res.type('text/plain').send('OK — LoveMatch360 webhook. POST /api/stripe-webhook • GET /health')
);
app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ---------- WEBHOOK (raw) ----------
let dedupWarned = false;
app.post('/api/stripe-webhook', express.raw({ type: '*/*' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('📥', event.id, event.type);
  } catch (err) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (await isDuplicateEvent(event.id)) {
    console.log('↪︎ Duplicate event, ack only:', event.id);
    return res.status(200).json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await onCheckoutCompleted(event);
        break;
      case 'customer.subscription.deleted':
        await onSubscriptionDeleted(event);
        break;
      case 'invoice.paid':
        await onInvoicePaid(event);
        break;
      case 'invoice.payment_failed':
        await onInvoicePaymentFailed(event);
        break;
      default:
        console.log('ℹ️  Event not handled:', event.type);
    }
  } catch (e) {
    console.error(`💥 Handler error for ${event.type}:`, e);
  }

  return res.status(200).json({ received: true });
});

// ---------- Body parser & CORS per API normali (dopo il webhook) ----------
app.use(cors({
  origin: [CLIENT_URL, 'http://127.0.0.1:5173'],
  methods: ['GET','POST','OPTIONS'],
}));
app.use(express.json());

// ---------- API: create-checkout-session (subscription con lookup_key) ----------
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { plan = 'monthly', user_id, email } = req.body ?? {};
    const lookup_key = plan === 'yearly' ? 'lm360_premium_yearly_eur'
                                         : 'lm360_premium_monthly_eur';

    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      active: true,
      limit: 1,
    });

    const price = prices.data?.[0];
    if (!price) return res.status(404).json({ error: `Price not found for ${lookup_key}` });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email || undefined,
      allow_promotion_codes: true,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${CLIENT_URL}/#/checkout-success`,
      cancel_url:  `${CLIENT_URL}/#/attiva-premium`,
      metadata: { user_id: user_id ?? '', price_lookup: lookup_key, plan },
    });

    return res.json({ url: session.url, id: session.id });
  } catch (e) {
    console.error('create-checkout-session error', e);
    return res.status(500).json({ error: 'create_session_failed' });
  }
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log(`✅ Webhook server on http://localhost:${PORT}`);
});

/* =========================
   HANDLER PER EVENTI
   ========================= */

async function onCheckoutCompleted(event) {
  const session = event.data.object;
  let email =
    session?.customer_details?.email ||
    session?.customer_email ||
    session?.metadata?.email || null;

  const customerId = session.customer || null;
  const subscriptionId = session.subscription || null;
  const metaUserId = session?.metadata?.user_id || null;

  if (!email && customerId) {
    try { const cust = await stripe.customers.retrieve(customerId); email = cust?.email || null; }
    catch {}
  }

  // Price ID best-effort
  let stripe_price_id = null;
  try {
    const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    stripe_price_id = li?.data?.[0]?.price?.id || null;
  } catch {}

  const userId = await resolveUserId({ metaUserId, email });
  if (!userId) {
    console.warn('⚠️  checkout.completed senza userId/email. Usa TEST_USER_ID o metadata.user_id.');
    return;
  }

let current_period_end = null;
try {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  current_period_end = sub?.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;
} catch (e) {
  console.warn('⚠️ Impossibile recuperare subscription.current_period_end', e.message);
}

await supabase.from('abbonamenti').upsert(
  {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_price_id,
    current_period_end,
    status: 'attivo',
    inizio: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { onConflict: 'stripe_subscription_id' }
);
🧩 5. Salva il file
📁 Premi CTRL + S per salvare server.js.

// Recupera current_period_end se possibile da Stripe
let current_period_end = null;
try {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  current_period_end = sub?.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;
} catch (e) {
  console.warn('⚠️ Impossibile recuperare subscription.current_period_end', e.message);
}

await supabase.from('abbonamenti').upsert(
  {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_price_id,
    current_period_end,
    status: 'attivo',
    inizio: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  { onConflict: 'stripe_subscription_id' }
);

  await supabase.from('profili').update({ ruolo: 'premium' }).eq('id', userId);

  await supabase.from('notifiche').insert({
    user_id: userId,
    titolo: 'Premium attivato',
    messaggio: 'Grazie! Il tuo account è ora Premium.',
    tipo: 'success',
  });

  if (email) {
    await sendMailSafe({
      to: email,
      subject: 'Benvenutə in LoveMatch360 Premium 💎',
      html: `
        <h1>Grazie per il tuo abbonamento!</h1>
        <p>Account Premium attivo. Scopri match compatibili al 100%.</p>
        <p><a href="${CLIENT_URL}/#/profile">Vai al tuo profilo</a></p>
      `,
    });
  }

  console.log(`✅ Premium attivato — user:${userId} sub:${subscriptionId}`);
}

async function onSubscriptionDeleted(event) {
  const subscription = event.data.object;
  const subscriptionId = subscription?.id || null;
  const customerId = subscription?.customer || null;

  let userId = null;

  const { data: rowBySub } = await supabase
    .from('abbonamenti').select('user_id')
    .eq('stripe_subscription_id', subscriptionId).maybeSingle();

  if (rowBySub?.user_id) {
    userId = rowBySub.user_id;
  } else {
    const { data: rowByCust } = await supabase
      .from('abbonamenti').select('user_id')
      .eq('stripe_customer_id', customerId).limit(1).maybeSingle();
    userId = rowByCust?.user_id || null;
  }

  await supabase
    .from('abbonamenti')
    .update({
      status: 'annullato',
      fine: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .or(`stripe_subscription_id.eq.${subscriptionId},stripe_customer_id.eq.${customerId}`);

  if (userId) {
    await supabase.from('profili').update({ ruolo: 'user' }).eq('id', userId);
    await supabase.from('notifiche').insert({
      user_id: userId,
      titolo: 'Abbonamento annullato',
      messaggio: 'Il tuo abbonamento è stato annullato.',
      tipo: 'warning',
    });

    const { data: prof } = await supabase
      .from('profili').select('email').eq('id', userId).maybeSingle();
    if (prof?.email) {
      await sendMailSafe({
        to: prof.email,
        subject: 'Abbonamento Premium annullato',
        html: `
          <h1>Abbonamento annullato</h1>
          <p>Il tuo account è tornato alla versione gratuita.</p>
          <p><a href="${CLIENT_URL}">Torna su LoveMatch360</a></p>
        `,
      });
    }
  }

  console.log(`🪓 Subscription deleted — sub:${subscriptionId} user:${userId}`);
}

async function onInvoicePaid(event) {
  const inv = event.data.object;
  const customerId = inv.customer || null;
  const subscriptionId = inv.subscription || null;

  const { data: row } = await supabase
    .from('abbonamenti').select('user_id')
    .or(`stripe_subscription_id.eq.${subscriptionId},stripe_customer_id.eq.${customerId}`)
    .limit(1).maybeSingle();

  if (!row?.user_id) return;

  await supabase
    .from('abbonamenti')
    .update({ status: 'attivo', updated_at: new Date().toISOString() })
    .or(`stripe_subscription_id.eq.${subscriptionId},stripe_customer_id.eq.${customerId}`);

  await supabase.from('profili').update({ ruolo: 'premium' }).eq('id', row.user_id);
  await supabase.from('notifiche').insert({
    user_id: row.user_id,
    titolo: 'Pagamento ricevuto',
    messaggio: 'Rinnovo Premium riuscito. Grazie! 🙌',
    tipo: 'success',
  });

  console.log(`💚 invoice.paid — sub:${subscriptionId} user:${row.user_id}`);
}

async function onInvoicePaymentFailed(event) {
  const inv = event.data.object;
  const customerId = inv.customer || null;
  const subscriptionId = inv.subscription || null;

  const { data: row } = await supabase
    .from('abbonamenti').select('user_id')
    .or(`stripe_subscription_id.eq.${subscriptionId},stripe_customer_id.eq.${customerId}`)
    .limit(1).maybeSingle();

  if (!row?.user_id) return;

  await supabase
    .from('abbonamenti')
    .update({ status: 'in_attesa', updated_at: new Date().toISOString() })
    .or(`stripe_subscription_id.eq.${subscriptionId},stripe_customer_id.eq.${customerId}`);

  await supabase.from('notifiche').insert({
    user_id: row.user_id,
    titolo: 'Pagamento non riuscito',
    messaggio: 'Aggiorna il metodo di pagamento per non perdere Premium.',
    tipo: 'error',
  });

  const { data: prof } = await supabase
    .from('profili').select('email').eq('id', row.user_id).maybeSingle();

  if (prof?.email) {
    await sendMailSafe({
      to: prof.email,
      subject: 'Problema con il pagamento di LoveMatch360',
      html: `
        <h1>Pagamento non riuscito</h1>
        <p>Non siamo riusciti a completare il rinnovo. Aggiorna il metodo di pagamento.</p>
        <p><a href="https://billing.stripe.com/p/login">Aggiorna carta</a></p>
      `,
    });
  }

  console.log(`💔 invoice.payment_failed — sub:${subscriptionId} user:${row.user_id}`);
}

// ---------- Helpers ----------
async function resolveUserId({ metaUserId, email }) {
  if (metaUserId) return metaUserId;
  if (!email) return process.env.TEST_USER_ID || null;
  const { data: userByEmail } = await supabase
    .from('profili').select('id').ilike('email', email).maybeSingle();
  return userByEmail?.id || process.env.TEST_USER_ID || null;
}

async function isDuplicateEvent(eventId) {
  if (!eventId) return false;
  try {
    const { error } = await supabase.from('stripe_events').insert({
      event_id: eventId, received_at: new Date().toISOString(),
    });
    if (error && error.code === '23505') return true;     // unique_violation
    if (error && error.code === '42P01' && !dedupWarned) {
      dedupWarned = true;
      console.warn('ℹ️  Tabella stripe_events assente: dedup disabilitato (opzionale).');
    }
  } catch {}
  return false;
}
