// server.js — LoveMatch360 • Stripe Webhook + Checkout (subscription) + Portal + Supabase + Email (ESM)
// -----------------------------------------------------------------------------------------------------
// Requisiti:
//   package.json -> "type": "module"
//   npm i express stripe @supabase/supabase-js nodemailer cors dotenv
// Avvio: npm run dev   (consigliato con nodemon)

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const app = express();
app.disable('x-powered-by');

const PORT = Number(process.env.PORT || 3000);
const SITE = process.env.SITE_URL || 'http://localhost:5173';

// ----- CORS (prima delle route JSON; non tocca il body del webhook) -----
const ORIGINS = [
  'http://localhost:5173',
  'https://www.lovematch360.com',
];
app.use(cors({ origin: ORIGINS, credentials: false }));

// ----- Stripe / Supabase -----
if (!process.env.STRIPE_SECRET_KEY) console.warn('⚠️  STRIPE_SECRET_KEY mancante in .env');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY /* , { apiVersion: '2024-11-20.acacia' } */);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY mancanti in .env');
}
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ----- Email (mock se ENV mancano) -----
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
  await transporter.sendMail({ from: `"LoveMatch360" <${process.env.SMTP_USER}>`, to, subject, html });
}

// ----- Rotte di cortesia -----
app.get('/', (_req, res) =>
  res.type('text/plain').send('OK — LoveMatch360 webhook. Use POST /api/stripe-webhook • GET /health')
);
app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// ======================================================================
//  WEBHOOK — deve ricevere il body RAW (nessun bodyParser PRIMA di questa)
// ======================================================================
let dedupWarned = false;

app.post('/api/stripe-webhook', express.raw({ type: '*/*' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  // Debug “a vista”: tienili finché non è tutto verde
  console.log('🧪 isBuffer:', Buffer.isBuffer(req.body), 'Sig:', !!sig, 'whsec:', !!process.env.STRIPE_WEBHOOK_SECRET);

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log('📥', event.id, event.type);
  } catch (err) {
    console.error('❌ Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Dedup opzionale via tabella 'stripe_events'
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
    // Evita retry loop: logga ma rispondi 200
    console.error(`💥 Handler error for ${event.type}:`, e);
  }
  return res.status(200).json({ received: true });
});

// ======================================================================
//  ALTRE API (dopo il webhook possiamo usare JSON parser)
// ======================================================================
app.use(express.json());

// Catalogo piani → lookup_key di Stripe (no Price ID hardcodati)
const PLAN_TO_LOOKUP = {
  premium_monthly: 'lm360_premium_monthly_eur',
  premium_yearly:  'lm360_premium_yearly_eur',
};

// Crea Checkout Session (subscription) usando lookup_key
app.post('/api/checkout/session', async (req, res) => {
  try {
    const { plan, user_id, email } = req.body || {};
    if (!PLAN_TO_LOOKUP[plan]) return res.status(400).json({ error: 'Piano non valido' });
    if (!user_id && !email)   return res.status(400).json({ error: 'Serve user_id o email' });

    // 1) Risolvi Price dal lookup_key
    const prices = await stripe.prices.list({
      lookup_keys: [PLAN_TO_LOOKUP[plan]],
      active: true,
      limit: 10,
      expand: ['data.product'],
    });
    const price = prices.data.find(p => p.currency === 'eur' && p.active);
    if (!price) return res.status(404).json({ error: `Price non trovato per ${PLAN_TO_LOOKUP[plan]}` });

    // 2) Customer unico per utente
    const customerId = await ensureCustomerForUser({ userId: user_id, email });

    // 3) Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId || undefined,
      customer_email: customerId ? undefined : email || undefined,
      line_items: [{ price: price.id, quantity: 1 }],
      allow_promotion_codes: true,
      client_reference_id: user_id || undefined,
      metadata: { user_id: user_id || '', plan },
      success_url: `${SITE}/#/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE}/#/premium?canceled=1`,
      automatic_tax: { enabled: false },
      consent_collection: { terms_of_service: 'required' },
      customer_update: { name: 'auto', address: 'auto' },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return res.status(500).json({ error: 'Errore creazione sessione' });
  }
});

// Customer Portal (gestione rinnovi/carta/cancel)
app.post('/api/customer-portal', async (req, res) => {
  try {
    const { user_id, return_url } = req.body || {};
    if (!user_id) return res.status(400).json({ error: 'user_id richiesto' });

    const { data: row } = await supabase
      .from('abbonamenti')
      .select('stripe_customer_id')
      .eq('user_id', user_id)
      .not('stripe_customer_id', 'is', null)
      .limit(1)
      .maybeSingle();

    if (!row?.stripe_customer_id) return res.status(404).json({ error: 'Nessun customer collegato' });

    const portal = await stripe.billingPortal.sessions.create({
      customer: row.stripe_customer_id,
      return_url: return_url || `${SITE}/#/premium`,
    });
    res.json({ url: portal.url });
  } catch (e) {
    console.error('customer-portal error:', e);
    res.status(500).json({ error: 'Errore apertura portal' });
  }
});

// ----- START -----
app.listen(PORT, () => {
  console.log(`✅ Webhook server on http://localhost:${PORT}`);
});

// ======================================================================
// Handlers
// ======================================================================
async function onCheckoutCompleted(event) {
  const session = event.data.object;

  // Email da sessione o da customer
  let email =
    session?.customer_details?.email ||
    session?.customer_email ||
    session?.metadata?.email ||
    null;

  const customerId     = session.customer || null;
  const subscriptionId = session.subscription || null;
  const metaUserId     = session?.metadata?.user_id || null;

  if (!email && customerId) {
    try { const cust = await stripe.customers.retrieve(customerId); email = cust?.email || null; } catch {}
  }

  // Price ID (best effort)
  let stripe_price_id = null;
  try {
    const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
    stripe_price_id = li?.data?.[0]?.price?.id || null;
  } catch {}

  // Mappa utente: metadata.user_id > email > TEST_USER_ID (per trigger CLI)
  const userId = await resolveUserId({ metaUserId, email });
  if (!userId) {
    console.warn('⚠️  checkout.completed senza userId/email. Usa TEST_USER_ID o metadata.user_id.');
    return;
  }

  // Upsert idempotente
  await supabase.from('abbonamenti').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id,
      status: 'attivo',
      inizio: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' }
  );

  // Ruolo premium
  await supabase.from('profili').update({ ruolo: 'premium' }).eq('id', userId);

  // Notifica
  await supabase.from('notifiche').insert({
    user_id: userId,
    titolo: 'Premium attivato',
    messaggio: 'Grazie! Il tuo account è ora Premium.',
    tipo: 'success',
  });

  // Email
  if (email) {
    await sendMailSafe({
      to: email,
      subject: 'Benvenutə in LoveMatch360 Premium 💎',
      html: `<h1>Grazie per il tuo abbonamento!</h1>
             <p>Account Premium attivo. Scopri match compatibili al 100%.</p>
             <p><a href="${SITE}/#/profile">Vai al tuo profilo</a></p>`,
    });
  }

  console.log(`✅ Premium attivato — user:${userId} sub:${subscriptionId}`);
}

async function onSubscriptionDeleted(event) {
  const subscription   = event.data.object;
  const subscriptionId = subscription?.id || null;
  const customerId     = subscription?.customer || null;

  // Trova user_id (preferisci subscription_id, fallback customer_id)
  let userId = null;
  const { data: rowBySub } = await supabase
    .from('abbonamenti').select('user_id')
    .eq('stripe_subscription_id', subscriptionId).maybeSingle();
  if (rowBySub?.user_id) userId = rowBySub.user_id;
  else {
    const { data: rowByCust } = await supabase
      .from('abbonamenti').select('user_id')
      .eq('stripe_customer_id', customerId)
      .limit(1).maybeSingle();
    userId = rowByCust?.user_id || null;
  }

  // Update abbonamento
  await supabase
    .from('abbonamenti')
    .update({ status: 'annullato', fine: new Date().toISOString(), updated_at: new Date().toISOString() })
    .or(`stripe_subscription_id.eq.${subscriptionId},stripe_customer_id.eq.${customerId}`);

  if (userId) {
    await supabase.from('profili').update({ ruolo: 'user' }).eq('id', userId);
    await supabase.from('notifiche').insert({
      user_id: userId, titolo: 'Abbonamento annullato', messaggio: 'Il tuo abbonamento è stato annullato.', tipo: 'warning'
    });

    const { data: prof } = await supabase.from('profili').select('email').eq('id', userId).maybeSingle();
    if (prof?.email) {
      await sendMailSafe({
        to: prof.email,
        subject: 'Abbonamento Premium annullato',
        html: `<h1>Abbonamento annullato</h1>
               <p>Il tuo account è tornato alla versione gratuita. Puoi riattivare Premium quando vuoi.</p>
               <p><a href="${SITE}">Torna su LoveMatch360</a></p>`,
      });
    }
  }

  console.log(`🪓 Subscription deleted — sub:${subscriptionId} user:${userId}`);
}

async function onInvoicePaid(event) {
  const inv            = event.data.object;
  const customerId     = inv.customer || null;
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
    user_id: row.user_id, titolo: 'Pagamento ricevuto', messaggio: 'Rinnovo Premium riuscito. Grazie! 🙌', tipo: 'success'
  });

  console.log(`💚 invoice.paid — sub:${subscriptionId} user:${row.user_id}`);
}

async function onInvoicePaymentFailed(event) {
  const inv            = event.data.object;
  const customerId     = inv.customer || null;
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
    user_id: row.user_id, titolo: 'Pagamento non riuscito', messaggio: 'Aggiorna il metodo di pagamento per non perdere Premium.', tipo: 'error'
  });

  const { data: prof } = await supabase.from('profili').select('email').eq('id', row.user_id).maybeSingle();
  if (prof?.email) {
    await sendMailSafe({
      to: prof.email,
      subject: 'Problema con il pagamento di LoveMatch360',
      html: `<h1>Pagamento non riuscito</h1>
             <p>Non siamo riusciti a completare il rinnovo. Aggiorna il metodo di pagamento.</p>
             <p><a href="https://billing.stripe.com/p/login">Aggiorna carta</a></p>`,
    });
  }

  console.log(`💔 invoice.payment_failed — sub:${subscriptionId} user:${row.user_id}`);
}

// ======================================================================
// Helpers
// ======================================================================
async function resolveUserId({ metaUserId, email }) {
  if (metaUserId) return metaUserId;
  if (!email)     return process.env.TEST_USER_ID || null; // fallback per trigger CLI

  const { data: userByEmail } = await supabase
    .from('profili').select('id')
    .ilike('email', email).maybeSingle();

  return userByEmail?.id || process.env.TEST_USER_ID || null;
}

async function ensureCustomerForUser({ userId, email }) {
  if (userId) {
    const { data: row } = await supabase
      .from('abbonamenti').select('stripe_customer_id')
      .eq('user_id', userId)
      .not('stripe_customer_id', 'is', null)
      .limit(1).maybeSingle();
    if (row?.stripe_customer_id) return row.stripe_customer_id;
  }
  if (email) {
    const cust = await stripe.customers.create({ email, metadata: { user_id: userId || '' } });
    return cust.id;
  }
  return null;
}

// Dedup semplice: richiede tabella opzionale 'stripe_events(event_id text unique, received_at timestamptz)'
async function isDuplicateEvent(eventId) {
  if (!eventId) return false;
  try {
    const { error } = await supabase.from('stripe_events').insert({
      event_id: eventId, received_at: new Date().toISOString(),
    });
    if (error && error.code === '23505') return true; // unique_violation
    if (error && error.code === '42P01' && !dedupWarned) {
      dedupWarned = true;
      console.warn('ℹ️  Tabella stripe_events assente: dedup disabilitato (opzionale).');
    }
  } catch {}
  return false;
}
