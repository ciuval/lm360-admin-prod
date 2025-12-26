import Stripe from 'stripe';

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

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return res.status(500).json({ ok:false, error:'missing_STRIPE_SECRET_KEY' });

    const stripe = new Stripe(secret);

    // Bearer -> user_id (facoltativo)
    const auth = req.headers.authorization || '';
    const tok  = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const jwt  = tok ? decodeJwt(tok) : null;
    const user_id = jwt?.sub || null;

    // body JSON
    const raw = (typeof req.body === 'object') ? req.body : JSON.parse(req.body || '{}');
    const price_id = raw?.price_id;
    if (!price_id) return res.status(400).json({ ok:false, error:'missing_price_id' });

    const proto  = req.headers['x-forwarded-proto'] || 'http';
    const host   = req.headers.host;
    const origin = `${proto}://${host}`;

    // Solo campi validi per mode:'subscription'
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${origin}/#/premium?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/#/premium?status=cancel`,
      customer_creation: 'always',
      metadata: { user_id: user_id || '' },
      subscription_data: { metadata: { user_id: user_id || '' } },
      allow_promotion_codes: true
    });

    return res.status(200).json({ ok:true, url: session.url });
  } catch (e) {
    const err = { message: e?.message || String(e), code: e?.code || null, type: e?.type || null, raw: e?.raw?.message || null };
    console.error('[checkout-create] fail:', err);
    return res.status(500).json({ ok:false, error: err });
  }
}
