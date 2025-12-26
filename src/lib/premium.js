export function isPremium() {
  try {
    const f = import.meta.env.VITE_FORCE_PREMIUM;
    if (f === '1' || f === 'true') return true;
    return !!JSON.parse(localStorage.getItem('lm360_premium') || 'false');
  } catch {
    return false;
  }
}
export function setPremium(v) {
  try {
    localStorage.setItem('lm360_premium', JSON.stringify(!!v));
  } catch {}
}
