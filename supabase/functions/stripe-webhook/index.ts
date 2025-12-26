// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.13.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.3";

const STRIPE_SECRET = Deno.env.get("STRIPE_SECRET_KEY")!;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2022-11-15" });
const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return new Response(`Bad signature: ${err.message}`, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as any;
      const uid: string | null = s.client_reference_id ?? null;    // passato dall’app
      const customer: string | null = s.customer ?? null;

      if (uid) {
        const { error } = await admin
          .from("profiles")
          .update({
            is_premium: true,
            premium_since: new Date().toISOString(),
            stripe_customer_id: customer,
          })
          .eq("id", uid);

        if (error) throw error;

        // facoltativo: evento analitico server-side
        await admin.from("events").insert({
          event: "purchase",
          user_id: uid,
          payload: { checkout_session: s.id, customer },
        });
      }
    }
  } catch (err: any) {
    console.error("webhook error:", err);
    return new Response("KO", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
