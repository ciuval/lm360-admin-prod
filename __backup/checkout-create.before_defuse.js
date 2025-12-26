import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function decodeJwt(token){
  try { return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()); }
  catch { return null; }
}

export default async function handler(req, res){
  try{
    if (req.method !== 'POST') {
      res.setHeader('Allow','POST');
      return res.status(405).json({ ok:false, error:'method_not_allowed' });
    }

    // Bearer -> user_id (facoltativo, ma utile per il webhook)
    const auth = req.headers.authorization || '';
    const tok  = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const jwt  = tok ? decodeJwt(tok) : null;
    const user_id = jwt?.sub || null;

    // body JSON
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    const { price_id } = body || {};
    if (!price_id) return res.status(400).json({ ok:false, error:'missing_price_id' });

    const origin = \\://\\;

    // ⚠️ SOLO campi permessi per mode:'subscription'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: \\/#/premium?status=success&session_id={CHECKOUT_SESSION_ID}\,
      cancel_url:  \\/#/premium?status=cancel\,
      customer_creation: 'always',
      // metadata propagate
      metadata: { user_id: user_id || '' },
      subscription_data: { metadata: { user_id: user_id || '' } },
      // niente payment_intent_data qui (NON valido per subscription)
      allow_promotion_codes: true
    });

    return res.status(200).json({ ok:true, url: session.url });
  } catch (e) {
    // Stripe error pretty print
    const err = {
      message: e?.message || String(e),
      code: e?.code || null,
      type: e?.type || null,
      raw: e?.raw?.message || null
    };
    console.error('[checkout-create] error:', err);
    return res.status(500).json({ ok:false, error: err });
  }
}
