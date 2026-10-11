// This module never writes credentials, URLs or provider messages to logs/storage.
import { getPasswordFeedback } from './signupFeedback.js';
export const RECOVERY_PATH = '/recupero-password';
export const REQUEST_MESSAGE = 'Se questo indirizzo è associato a un account, riceverai le istruzioni. Controlla anche Spam.';
export function validEmail(value) {
  return typeof value === 'string' && value.trim().length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
export function safeDestination(value) {
  return typeof value === 'string' && /^\/(?![\/\\])/.test(value) && !/[\\\x00-\x20]/.test(value) ? value : '/profilo';
}
export function loginMessage(error = {}) {
  const e = error || {}, code = String(e.code || '').toLowerCase();
  if (e.status === 429 || /rate_limit/.test(code)) return 'Troppi tentativi. Attendi prima di riprovare.';
  if (code === 'email_not_confirmed') return 'Conferma prima il tuo indirizzo email. Controlla anche Spam.';
  if (code === 'invalid_credentials') return 'Email o password non corrette. Controlla i dati oppure recupera la password.';
  return 'Accesso non completato. Riprova tra poco oppure contatta l’assistenza.';
}
export function recoveryMessage(error = {}) {
  const e = error || {}, c = String(e.code || '');
  if (e.status === 429 || /rate_limit/.test(c) || c === 'cooldown') return 'Attendi almeno un minuto prima di richiedere un’altra email.';
  if (c === 'invalid_email') return 'Inserisci un indirizzo email valido.';
  if (c === 'password_mismatch') return 'Le due password non coincidono.';
  if (c === 'weak_password' || c === 'same_password') return 'Scegli una password nuova, non compromessa, con almeno 12 caratteri, una lettera e un numero.';
  if (c === 'expired' || c === 'otp_expired' || c === 'session_not_found' || c === 'refresh_token_not_found' || e.status === 401) return 'Collegamento non valido o scaduto. Richiedi una nuova email di recupero.';
  return 'Operazione non completata. Non ripetere subito la richiesta; riprova più tardi o contatta l’assistenza.';
}
// Capture before loading either the main application or analytics. Callers immediately scrub the URL.
export function readRecoveryURL(href) {
  const u = new URL(href), p = new URLSearchParams(u.hash.slice(1));
  const active = /^\/recupero-password\/?$/.test(u.pathname) || p.get('type') === 'recovery';
  if (!active) return { active: false };
  if (!u.search && !u.hash) return { active: true, mode: 'request' };
  const access = p.get('access_token'), refresh = p.get('refresh_token');
  const valid = !u.search && p.getAll('type').length === 1 && p.get('type') === 'recovery' &&
    p.getAll('access_token').length === 1 && p.getAll('refresh_token').length === 1 &&
    !p.has('error') && !p.has('error_code') &&
    typeof access === 'string' && access.length >= 20 && access.length <= 12000 && /^[A-Za-z0-9_.-]+$/.test(access) &&
    typeof refresh === 'string' && refresh.length >= 8 && refresh.length <= 4096 && /^[A-Za-z0-9_.~-]+$/.test(refresh);
  return valid ? { active: true, mode: 'link', tokens: { access_token: access, refresh_token: refresh } } : { active: true, mode: 'invalid' };
}
const fault = code => Object.assign(new Error('Recovery operation not completed'), { code });
// A dedicated in-memory Auth client is supplied: no existing login session can authorize this form.
export function createRecoveryFlow(auth, incoming, redirectTo, now = Date.now) {
  let tokens = incoming?.mode === 'link' ? incoming.tokens : null;
  let verified = false, finished = false, busy = false, nextRequest = 0;
  async function exclusive(task) {
    if (busy) throw fault('busy');
    busy = true;
    try { return await task(); } finally { busy = false; }
  }
  return {
    remaining: () => Math.max(0, Math.ceil((nextRequest - now()) / 1000)),
    request(email) { return exclusive(async () => {
      if (!validEmail(email)) throw fault('invalid_email');
      if (now() < nextRequest) throw fault('cooldown');
      nextRequest = now() + 60000;
      const { error } = await auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
      if (error && !['user_not_found', 'email_not_found'].includes(error.code)) throw error;
      return REQUEST_MESSAGE;
    }); },
    verify() { return exclusive(async () => {
      if (finished) throw fault('expired');
      if (verified) return;
      if (!tokens) throw fault('expired');
      const supplied = tokens; tokens = null;
      const { data, error } = await auth.setSession(supplied);
      if (error || !data?.session) throw fault('expired');
      const checked = await auth.getUser();
      if (checked.error || !checked.data?.user?.id) throw fault('expired');
      // Recovery is not a route around the account's existing MFA.
      const assurance = await auth.mfa.getAuthenticatorAssuranceLevel();
      if (assurance.error || !['aal1', 'aal2'].includes(assurance.data?.currentLevel)) throw fault('expired');
      if (assurance.data?.nextLevel === 'aal2' && assurance.data?.currentLevel !== 'aal2') throw fault('mfa_required');
      verified = true;
    }); },
    update(password, confirmation) { return exclusive(async () => {
      if (!verified || finished) throw fault('expired');
      if (password !== confirmation) throw fault('password_mismatch');
      if (!getPasswordFeedback(password).ready || password.length > 256) throw fault('weak_password');
      const { data, error } = await auth.updateUser({ password });
      if (error) throw error;
      if (!data?.user?.id) throw fault('expired');
      finished = true; verified = false; tokens = null;
      try { const out = await auth.signOut({ scope: 'global' }); return { sessionsRevoked: !out.error }; }
      catch { return { sessionsRevoked: false }; }
    }); }
  };
}
