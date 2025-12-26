import { createClient } from '@supabase/supabase-js';
import { Env } from './env.mjs';

export const supabaseAdmin = createClient(
  Env.SUPABASE_URL,
  Env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PROFILES_TABLE = 'profili'; // cambia se necessario

export async function getProfile(userId) {
  return supabaseAdmin.from(PROFILES_TABLE)
    .select('id,email,stripe_customer_id')
    .eq('id', userId)
    .single();
}

export async function setStripeCustomerId(userId, customerId) {
  return supabaseAdmin.from(PROFILES_TABLE)
    .update({ stripe_customer_id: customerId })
    .eq('id', userId);
}

// Upsert abbonamento (tabella: `abbonamenti`)
export async function upsertAbbonamento({ user_id, customer_id, subscription }) {
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.id ?? null;

  const rec = {
    user_id,
    stripe_customer_id: customer_id,
    stripe_subscription_id: subscription.id,
    price_id: priceId,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at_period_end: !!subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from('abbonamenti')
    .upsert(rec, { onConflict: 'stripe_subscription_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}
