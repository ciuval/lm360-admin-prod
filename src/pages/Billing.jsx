import React from "react";

const mods = import.meta.glob(
  ["./CheckoutStripe.jsx","./BillingPage.jsx","./StripePortal.jsx"],
  { eager: true }
);

const mod =
  mods["./CheckoutStripe.jsx"] ||
  mods["./BillingPage.jsx"] ||
  mods["./StripePortal.jsx"] ||
  Object.values(mods)[0];

const Billing = (mod && mod.default) || function BillingFallback() {
  return (
    <section style={{ padding: 24 }}>
      <h1>Billing</h1>
      <p>Pagina non disponibile in questa build.</p>
    </section>
  );
};

export default Billing;