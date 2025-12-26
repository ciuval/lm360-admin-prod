import 'dotenv/config';

function num(v, d) { const n = parseInt(v ?? '', 10); return Number.isFinite(n) ? n : d; }

export const Env = {
  PORT: process.env.PORT || '3000',
  SITE_URL: process.env.SITE_URL || 'http://localhost:5173',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: num(process.env.SMTP_PORT, 465),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  TEST_USER_ID: process.env.TEST_USER_ID,
};

export function assertServerSecrets() {
  const missing = [];
  if (!Env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY');
  if (!Env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!Env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!Env.STRIPE_WEBHOOK_SECRET) missing.push('STRIPE_WEBHOOK_SECRET');
  if (missing.length) throw new Error(`Missing env: ${missing.join(', ')}`);
}
