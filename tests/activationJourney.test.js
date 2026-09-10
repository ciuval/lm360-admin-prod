import test from "node:test";
import assert from "node:assert/strict";
import {
  getActivationJourneyProps,
  readActivationJourney,
  startActivationJourney,
} from "../src/lib/activationJourney.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

test.beforeEach(() => {
  globalThis.window = {
    localStorage: createStorage(),
    crypto: {
      getRandomValues(values) {
        values.set([1234567890, 2345678901, 3456789012]);
        return values;
      },
    },
  };
});

test.afterEach(() => {
  delete globalThis.window;
});

test("the activation journey is anonymous, stable and time-bounded", () => {
  const started = startActivationJourney(1_800_000_000_000);
  const later = readActivationJourney(1_800_000_042_000);

  assert.match(started.flow, /^[a-z0-9]{12,30}$/i);
  assert.equal(later.flow, started.flow);
  assert.equal(later.signup_elapsed_seconds, 42);
  assert.deepEqual(getActivationJourneyProps(1_800_000_042_000), {
    flow: started.flow,
    signup_elapsed_seconds: 42,
  });
});

test("expired activation journeys are discarded", () => {
  const startedAt = 1_800_000_000_000;
  startActivationJourney(startedAt);

  const expired = readActivationJourney(startedAt + 8 * 24 * 60 * 60 * 1000);

  assert.equal(expired, null);
  assert.deepEqual(getActivationJourneyProps(startedAt + 8 * 24 * 60 * 60 * 1000), {});
});
