function isSafeInternalPath(value) {
  return typeof value === "string" && value.startsWith("/");
}

function normalizeFrom(state) {
  const from = state?.from;
  return isSafeInternalPath(from) ? from : null;
}

export function getPremiumReturnPath(state) {
  const from = normalizeFrom(state);

  if (!from) {
    return "/quantum";
  }

  if (from === "/premium" || from === "/checkout" || from === "/checkout/success") {
    return "/quantum";
  }

  return from;
}

export function getCheckoutSuccessPath(state) {
  const from = normalizeFrom(state);

  if (!from) {
    return "/quantum";
  }

  if (from === "/premium" || from === "/checkout" || from === "/checkout/success") {
    return "/quantum";
  }

  return from;
}