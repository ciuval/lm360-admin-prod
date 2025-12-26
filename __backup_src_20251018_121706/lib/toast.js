export function toast(message, type = "info", opts = {}) {
  if (typeof window === "undefined") return;
  const detail = { message, type, duration: opts.duration ?? 4000 };
  window.dispatchEvent(new CustomEvent("lm:toast", { detail }));
}
