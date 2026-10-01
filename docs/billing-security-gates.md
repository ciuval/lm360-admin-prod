# LoveMatch360: gates for registration and subscription billing

The public billing routes are paused. This is a containment change, not a
working subscription integration. Do not publish a price or turn on checkout
by changing a button alone.

## Registration and user data

1. Check Supabase Auth settings: confirmed email required, allowed redirect
   URLs restricted to owned HTTPS domains, password rules and abuse controls.
2. Test RLS as an anonymous user, a normal member, a different member and an
   admin. In particular, verify that members cannot change `profili.ruolo`,
   `premium`, `premium_fine`, `stripe_customer_id`, `status_account`,
   subscription rows or other users' photos and messages.
3. The browser's age declaration and `user_metadata` are user-editable.
   Add server-side enforcement, retention and a reviewable consent/terms record
   before treating those fields as eligibility or legal evidence.
4. Review the final Terms, Privacy, Cookie and Refund texts with the business
   owner and appropriate advisers; the current pages include summary text.
   Establish a real contact, retention periods, account deletion and report/
   moderation response procedure.

## Reconcile existing subscriptions first

1. Export a restricted Stripe inventory of current subscriptions, statuses,
   latest invoices and customer IDs. Compare it with Supabase entitlements.
   Resolve mismatches individually; do not cancel or grant access in bulk.
2. Confirm the account is permitted to charge and the product is supported
   before opening new sales. Check tax registrations and invoice settings.
3. Verify the production webhook URL is deployed on the same host and
   environment configured in Stripe. A 2xx response must only mean the event
   was verified and durably handled. Never acknowledge an event to silence
   retries. Inspect failed deliveries and replay after repair.

## Implementation gates

1. Develop in a separate Stripe sandbox. Use a fixed, server-owned recurring
   price and a restricted secret key stored only in protected environment
   variables. Never expose an API to create prices from arbitrary input.
2. Checkout requires a validated Supabase user token and confirmed email.
   Bind one Stripe Customer to the immutable user ID, never by email lookup.
   Reject duplicate active subscriptions and use idempotency keys for retries.
3. Verify Stripe's webhook signature against the raw request body. Persist
   processed event IDs with a unique constraint, handle event reordering, and
   update entitlements transactionally based on verified subscription and
   invoice status. Process renewals, failures, cancellations and refunds.
   A success page must not grant Premium.
4. Offer an authenticated Stripe Customer Portal to manage or cancel an
   existing subscription. Do not accept a client-provided customer ID.
5. Display final price, currency, billing interval, tax treatment, renewal
   and cancellation terms before payment. Confirm legal and tax text for
   actual selling jurisdictions.
6. Test successful and failed payments, delayed events, duplicate and
   out-of-order events, cancellation at period end, refunds, email changes,
   direct API calls without authentication and RLS bypass attempts. Verify
   the deployed endpoint, headers and logs contain no secrets or personal
   data. Only after these checks may live checkout be explicitly enabled.
