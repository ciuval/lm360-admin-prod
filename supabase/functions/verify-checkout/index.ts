import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { cs } = await req.json();
    if (!cs) return new Response("Missing session", { status: 400 });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.retrieve(cs);
    if (session.payment_status !== "paid") {
      return new Response("Not paid", { status: 402 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userId = session.metadata?.user_id;
    if (!userId) return new Response("Missing user", { status: 400 });

    await supabase
      .from("profiles")
      .update({ is_premium: true })
      .eq("id", userId);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response("Error", { status: 500 });
  }
});
