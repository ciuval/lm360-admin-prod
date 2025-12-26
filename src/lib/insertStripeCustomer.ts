import { supabase } from './supabaseClient';

export async function insertStripeCustomer(user) {
  if (!user?.email || !user?.id) return;

  const response = await fetch('/api/create-stripe-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: user.id,
      email: user.email
    })
  });

  const data = await response.json();
  return data;
}
