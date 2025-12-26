// /api/checkout-create2.js — stabile: crea la sessione Stripe + errori chiari
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok:false, error:"method_not_allowed" });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const supaUrl   = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supaKey   = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const site      = process.env.SITE_URL || "http://localhost:3010";
    if (!stripeKey || !supaUrl || !supaKey) {
      return res.status(200).json({ ok:false, step:"env", error:"missing_env" });
    }

    const { default: Stripe } = await import("stripe");
    const { createClient } = await import("@supabase/supabase-js");
    const stripe = new Stripe(stripeKey);
    const sb = createClient(supaUrl, supaKey);

    // Auth dal token Bearer
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(200).json({ ok:false, step:"auth", error:"missing_auth_token" });

    const { data: userData, error: userErr } = await sb.auth.getUser(token);
    if (userErr || !userData?.user?.id) {
      return res.status(200).json({ ok:false, step:"auth", error:userErr?.message || "invalid_token" });
    }
    const user = userData.user;

    // Body JSON
    const raw = await new Promise(r=>{let b=""; req.on("data",c=>b+=c); req.on("end",()=>r(b));});
    let body={}; try{ body = JSON.parse(raw||"{}") }catch{ return res.status(200).json({ ok:false, step:"body", error:"invalid_json" }) }
    const price_id = body.price_id;
    if (!price_id) return res.status(200).json({ ok:false, step:"body", error:"missing_price_id" });

    // Price valido?
    try { await stripe.prices.retrieve(price_id); }
    catch(e) { return res.status(200).json({ ok:false, step:"price_check", error:String(e?.message||e) }) }

    // Crea sessione Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price_id, quantity: 1 }],
      success_url: `${site}/#/premium?status=success`,
      cancel_url:  `${site}/#/premium?status=cancel`,
      customer_email: user.email || undefined,
      metadata: { user_id: user.id },
      subscription_data: { metadata: { user_id: user.id } }
    });

    return res.status(200).json({ ok:true, url: session.url });
  } catch (e) {
    return res.status(200).json({ ok:false, step:"unknown", error:String(e?.message||e) });
  }
}
