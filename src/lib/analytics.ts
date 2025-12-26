// src/lib/analytics.ts

/**
 * Traccia un evento personalizzato in Google Analytics 4.
 * @param name Nome dell'evento (es. signup, purchase, match_100)
 * @param params Parametri opzionali
 */
export function trackEvent(
  name: string,
  params: Record<string, any> = {}
): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  } else {
    console.log(`[trackEvent] "${name}"`, params);
  }
}
