// src/config/emails.js
const env = (k, d) => import.meta.env?.[k] ?? d;

export const EMAILS = {
  SUPPORT: env('VITE_SUPPORT_EMAIL', 'servizioclienti@lovematch360.com'),
  INFO: env('VITE_INFO_EMAIL', 'info@lovematch360.com'),
  TEST: env('VITE_TEST_EMAIL', 'test@lovematch360.com'),
};

export const mailto = (address, subject, body) => {
  const q = [];
  if (subject) q.push(`subject=${encodeURIComponent(subject)}`);
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${address}${q.length ? `?${q.join('&')}` : ''}`;
};
