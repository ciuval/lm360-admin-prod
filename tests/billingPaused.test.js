import test from "node:test";
import assert from "node:assert/strict";
import createPrice from "../api/create-price.js";
import createCheckout from "../api/create-checkout-session.js";
import getPrices from "../api/get-prices.js";
import stripeWebhook from "../api/stripe-webhook.js";

function response() {
  return {
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("untrusted calls cannot create a live Stripe price or Checkout Session", () => {
  const price = response();
  createPrice({ method: "POST", body: { unit_amount: 1, currency: "eur" } }, price);
  assert.equal(price.statusCode, 410);
  assert.equal(price.headers["Cache-Control"], "no-store");

  const checkout = response();
  createCheckout({ method: "POST" }, checkout);
  assert.equal(checkout.statusCode, 503);
  assert.equal(checkout.headers["Cache-Control"], "no-store");
  assert.equal("url" in checkout.body, false);
});

test("paused catalog does not query Stripe and webhook never acknowledges an event", () => {
  const catalog = response();
  getPrices({ method: "GET" }, catalog);
  assert.equal(catalog.statusCode, 503);

  const webhook = response();
  stripeWebhook({ method: "POST", body: { type: "invoice.paid" } }, webhook);
  assert.equal(webhook.statusCode, 503);
  assert.equal(webhook.headers["Retry-After"], "3600");
});

test("billing endpoints reject unrelated methods", () => {
  for (const handler of [createCheckout, stripeWebhook]) {
    const res = response();
    handler({ method: "GET" }, res);
    assert.equal(res.statusCode, 405);
    assert.equal(res.headers.Allow, "POST");
  }
});
