// ✅ File: /api/stripe-webhook.js (sezione aggiornata per log notifiche)

if (event.type === "checkout.session.completed") {
  const session = event.data.object;
  const customerId = session.customer;
  const subscriptionId = session.subscription;
  const email = session.customer_email;

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    limit: 1,
  });
  const stripe_price_id = lineItems.data?.[0]?.price?.id || null;

  const { data: user } = await supabase
    .from("profili")
    .select("id")
    .eq("email", email)
    .single();

  if (user) {
    await supabase.from("abbonamenti").insert({
      user_id: user.id,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_price_id: stripe_price_id,
      status: "attivo",
      inizio: new Date(),
    });

    await supabase.from("notifiche").insert({
      user_id: user.id,
      titolo: "Premium attivato",
      messaggio: "Grazie per il tuo abbonamento! Il tuo account è ora Premium.",
      tipo: "success",
    });
  }
}

if (event.type === "customer.subscription.deleted") {
  const subscription = event.data.object;
  const customerId = subscription.customer;

  const { data: abbonamento } = await supabase
    .from("abbonamenti")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (abbonamento) {
    await supabase
      .from("abbonamenti")
      .update({ status: "annullato", fine: new Date() })
      .eq("stripe_customer_id", customerId);

    await supabase
      .from("profili")
      .update({ ruolo: "user" })
      .eq("id", abbonamento.user_id);

    await supabase.from("notifiche").insert({
      user_id: abbonamento.user_id,
      titolo: "Abbonamento annullato",
      messaggio: "Il tuo abbonamento Premium è stato annullato. Il tuo account è stato declassato.",
      tipo: "warning",
    });

    console.log("🔻 Utente declassato a user per abbonamento annullato");
  }
}

