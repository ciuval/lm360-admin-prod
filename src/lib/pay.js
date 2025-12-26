/**
 * CTA Premium unica (same-tab).
 * Usa SOLO: VITE_STRIPE_PAYMENT_LINK
 * (Niente log PII)
 */
export function goToPayLink() {
  const url = import.meta.env.VITE_STRIPE_PAYMENT_LINK;

  if (!url || typeof url !== "string" || !url.startsWith("http")) {
    alert("Link Premium non configurato (VITE_STRIPE_PAYMENT_LINK).");
    return;
  }

  window.location.assign(url);
}
