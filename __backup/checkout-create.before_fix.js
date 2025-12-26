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
    if(req.method !== 'POST'){ res.setHeader('Allow','POST'); return res.status(405).json({ok:false,error:'method_not_allowed'}); }

    // user_id dal Bearer token
    const tok = (req.headers.authorization || '').replace(/^Bearer\s+/,'');
    const jwt = tok ? decodeJwt(tok) : null;
    const user_id = jwt?.sub || null;

    // body
    const body = typeof req.body === 'object' ? req.body : JSON.parse(req.body||'{}');
    const { price_id } = body;
    if(!price_id) return res.status(400).json({ok:false,error:'missing_price_id'});

    const origin = \\://\\;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: \\/#/premium?status=success&session_id={CHECKOUT_SESSION_ID}\,
      cancel_url: \\/#/premium?status=cancel\,
      customer_creation: 'always',
      // <<<< chiave dell'associazione
      metadata: { user_id: user_id || '' },
      subscription_data: { metadata: { user_id: user_id || '' } },
      payment_intent_data: { metadata: { user_id: user_id || '' } },
    });

    return res.status(200).json({ok:true,url:session.url});
  }catch(e){
    return res.status(500).json({ok:false,error:String(e?.message||e)});
  }
}
