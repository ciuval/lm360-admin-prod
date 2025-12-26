// src/api/payments.js
export async function getPrices() {
  const r = await fetch('/api/get-prices');
  if (!r.ok) throw new Error('get-prices failed');
  return r.json(); // { items: [...] }
}

export async function startCheckout({ priceId, userId }) {
  const r = await fetch('/api/create-checkout-session.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userId ? { priceId, userId } : { priceId })
  });
  if (!r.ok) throw new Error('create-checkout-session failed');
  const { url } = await r.json();
  return url;
}

export async function openBillingPortal({ userId }) {
  const r = await fetch('/api/create-billing-portal-session.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userId ? { userId } : {})
  });
  if (!r.ok) throw new Error('create-billing-portal-session failed');
  const { url } = await r.json();
  return url;
}
