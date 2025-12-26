import Stripe from 'stripe';
import { Env, assertServerSecrets } from './env.mjs';

assertServerSecrets();

export const stripe = new Stripe(Env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  maxNetworkRetries: 2,
  appInfo: { name: 'LoveMatch360', version: '1.0' },
});