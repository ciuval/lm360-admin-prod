import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function rawBody(req){ return new Promise((resolve)=>{ let data=''; req.on('data',c=>data+=c); req.on('end',()=>resolve(data)); }); }

async function upsertSub(row){
  // TODO: sostituisci 'abbonamenti' se la tua tabella ha un altro nome
  const { data, error } = await supabase
    .from('abbonamenti')
    .upsert(row, { onConflict: 'subscription_id' })
    .select().single();
  return { data, error };
}

export default async function handler(req, res){
  if(req.method !== 'POST'){ res.setHeader('Allow','POST'); return res.status(405).json({ok:false,error:'method_not_allowed'}); }
  try{
    const buf = await rawBody(req);
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);

    const type = event.type;
    const obj = event.data.object;

    // user_id propagation
    let user_id = obj?.metadata?.user_id || null;
    let customer_id = obj?.customer || null;

    // prova a leggere dalla subscription collegata
    if(!user_id && obj?.subscription){
      try {
        const sub = await stripe.subscriptions.retrieve(obj.subscription);
        user_id = sub?.metadata?.user_id || user_id;
        customer_id = sub?.customer || customer_id;
      } catch {}
    }

    // prova a leggere dal customer
    if(!user_id && customer_id){
      try {
        const cust = await stripe.customers.retrieve(customer_id);
        user_id = cust?.metadata?.user_id || user_id;
      } catch {}
    }

    if(type.startsWith('customer.subscription.')){
      const sub = obj; // subscription object
      const row = {
        subscription_id: sub.id,
        status: sub.status,
        inizio: new Date(sub.current_period_start*1000).toISOString(),
        scadenza: new Date(sub.current_period_end*1000).toISOString(),
        price_id: sub.items?.data?.[0]?.price?.id || null,
        ultima_modifica: new Date((sub.updated||Date.now()/1000)*1000).toISOString(),
        customer_id,
        utente_id: user_id,
        source: 'stripe',
      };
      const { error } = await upsertSub(row);
      if(error) return res.status(500).json({ok:false, step:'upsert', error: error.message});
      return res.status(200).json({ok:true, type, row});
    }

    if(type === 'checkout.session.completed'){
      const s = obj;
      const subId = s.subscription;
      if(subId){
        const sub = await stripe.subscriptions.retrieve(subId);
        const row = {
          subscription_id: sub.id,
          status: sub.status,
          inizio: new Date(sub.current_period_start*1000).toISOString(),
          scadenza: new Date(sub.current_period_end*1000).toISOString(),
          price_id: sub.items?.data?.[0]?.price?.id || null,
          ultima_modifica: new Date((sub.updated||Date.now()/1000)*1000).toISOString(),
          customer_id: sub.customer,
          utente_id: user_id || sub.metadata?.user_id || null,
          source: 'stripe',
        };
        const { error } = await upsertSub(row);
        if(error) return res.status(500).json({ok:false, step:'upsert_from_session', error: error.message});
      }
      return res.status(200).json({ok:true, type, hint:'session_complete'});
    }

    return res.status(200).json({ok:true, type});
  }catch(e){
    return res.status(400).json({ok:false,error:String(e?.message||e)});
  }
}
