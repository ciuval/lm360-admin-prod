# LoveMatch360 - admin-email-sender

Step: ADMIN_EMAIL_04B
Mode: DRY RUN ONLY

This Supabase Edge Function is intentionally safe.

It does:

- read pending rows from public.admin_notification_queue;
- filter recipient to servizioclienti@lovematch360.com;
- return a safe preview summary;
- require x-admin-email-secret.

It does not:

- send real email;
- call Resend;
- update queue rows;
- update audit log rows;
- expose secrets;
- expose user UUIDs;
- expose user emails;
- touch Stripe;
- assign Premium or Super Premium.

Required server-side environment variables:

- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_EMAIL_SECRET
- ADMIN_EMAIL_DRY_RUN=true
- ADMIN_EMAIL_SENDER_ENABLED=false
- ADMIN_EMAIL_BATCH_LIMIT=5

Local dry-run idea:

Do not run until secrets are configured safely.

supabase functions serve admin-email-sender --env-file supabase/functions/admin-email-sender/.env.local

Expected behavior:

- returns mode: DRY_RUN_ONLY;
- returns real_email_sent: false;
- returns resend_called: false;
- leaves pending queue unchanged.

Future step:

A later step may add real Resend sending, but only after DNS, secrets, dry run and explicit confirmation.
