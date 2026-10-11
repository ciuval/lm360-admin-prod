import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validEmail, safeDestination, loginMessage, recoveryMessage, readRecoveryURL, createRecoveryFlow, REQUEST_MESSAGE, RECOVERY_PATH } from '../src/lib/recoveryFlow.js';
const input = { active: true, mode: 'link', tokens: { access_token: 'x'.repeat(40), refresh_token: 'y'.repeat(40) } };
const make = (overrides = {}) => ({
  resetPasswordForEmail: async () => ({ error: null }),
  setSession: async () => ({ data: { session: {} }, error: null }),
  getUser: async () => ({ data: { user: { id: 'test-id' } }, error: null }),
  updateUser: async () => ({ data: { user: { id: 'test-id' } }, error: null }),
  signOut: async () => ({ error: null }),
  mfa: { getAuthenticatorAssuranceLevel: async () => ({ data: { currentLevel: 'aal1', nextLevel: 'aal1' }, error: null }) },
  ...overrides
});
const flow = (auth = make(), start = input, clock = () => 100000) => createRecoveryFlow(auth, start, 'https://www.lovematch360.com' + RECOVERY_PATH, clock);
test('email: valida senza verificare esistenza', () => {
  assert.equal(validEmail(' prova@example.invalid '), true);
  for (const x of ['', 'senza-chiocciola', 'a b@example.invalid', null, 'a'.repeat(250) + '@example.invalid']) assert.equal(validEmail(x), false);
});
test('ritorno: solo percorsi interni', () => {
  assert.equal(safeDestination('/profilo'), '/profilo');
  for (const x of ['https://attacker.invalid', '//attacker.invalid', '/\\evil', '/x\nnext', '', null]) assert.equal(safeDestination(x), '/profilo');
});
test('errori login: generici, nessuna conferma esistenza account', () => {
  assert.match(loginMessage({ code: 'invalid_credentials' }), /Email o password non corrette/);
  assert.match(loginMessage({ status: 429, code: 'invalid_credentials' }), /Troppi/);
  assert.match(loginMessage({ code: 'email_not_confirmed' }), /Conferma/);
});
test('errori: mai risposte grezze o dati privati', () => {
  const e = { message: 'PRIVATE_TOKEN user@example.invalid <script>', code: 'unknown', status: 500 };
  for (const msg of [loginMessage(e), recoveryMessage(e)]) assert.doesNotMatch(msg, /PRIVATE_TOKEN|example.invalid|<script>/);
});
test('URL: login e conferme normali restano al router attuale', () => {
  assert.deepEqual(readRecoveryURL('https://site.invalid/#/login?verified=1'), { active: false });
});
test('URL: pagina senza token consente solo richiesta email', () => {
  assert.equal(readRecoveryURL('https://site.invalid/recupero-password').mode, 'request');
});
test('URL: token accettati solo nel frammento di recupero', () => {
  const u = `https://site.invalid/recupero-password#type=recovery&access_token=${input.tokens.access_token}&refresh_token=${input.tokens.refresh_token}`;
  assert.deepEqual(readRecoveryURL(u).tokens, input.tokens);
  assert.equal(readRecoveryURL(u.replace('type=recovery', 'type=signup')).mode, 'invalid');
});
test('URL: anche recupero amministrativo alla radice isolato dal router', () => {
  assert.equal(readRecoveryURL(`https://site.invalid/#type=recovery&access_token=${input.tokens.access_token}&refresh_token=${input.tokens.refresh_token}`).mode, 'link');
});
test('URL: parametri duplicati o token parziali rifiutati', () => {
  for (const fragment of ['type=recovery', 'type=recovery&access_token=x', `type=recovery&type=signup&access_token=${input.tokens.access_token}&refresh_token=${input.tokens.refresh_token}`, 'error=access_denied&error_code=otp_expired']) {
    assert.equal(readRecoveryURL('https://site.invalid/recupero-password#' + fragment).mode, 'invalid');
  }
});
test('URL: code PKCE vecchio non viene scambiato automaticamente', () => {
  assert.equal(readRecoveryURL('https://site.invalid/recupero-password?code=PRIVATE_TOKEN').mode, 'invalid');
});
test('richiesta: dati corretti e risposta neutra', async () => {
  let seen;
  const f = flow(make({ resetPasswordForEmail: async (...args) => { seen = args; return { error: null }; } }), { mode: 'request' });
  assert.equal(await f.request(' Test@Example.Invalid '), REQUEST_MESSAGE);
  assert.deepEqual(seen, ['test@example.invalid', { redirectTo: 'https://www.lovematch360.com/recupero-password' }]);
  assert.equal(f.remaining(), 60);
});
test('richiesta: email malformata non chiama Auth', async () => {
  let calls = 0; const f = flow(make({ resetPasswordForEmail: async () => { calls++; } }));
  await assert.rejects(f.request('bad'), { code: 'invalid_email' }); assert.equal(calls, 0);
});
test('richiesta: account non trovato non viene rivelato', async () => {
  const f = flow(make({ resetPasswordForEmail: async () => ({ error: { code: 'user_not_found' } }) }));
  assert.equal(await f.request('test@example.invalid'), REQUEST_MESSAGE);
});
test('richiesta: nessun falso successo su errore SMTP', async () => {
  const f = flow(make({ resetPasswordForEmail: async () => ({ error: { code: 'unexpected_failure', status: 500 } }) }));
  await assert.rejects(f.request('test@example.invalid'), e => e.status === 500);
});
test('richiesta: cooldown e ripresa dopo un minuto', async () => {
  let now = 100000; const f = flow(make(), { mode: 'request' }, () => now);
  await f.request('test@example.invalid');
  await assert.rejects(f.request('test@example.invalid'), { code: 'cooldown' });
  now += 60000; assert.equal(await f.request('test@example.invalid'), REQUEST_MESSAGE);
});
test('richiesta: doppi click non producono invii paralleli', async () => {
  let release; let calls = 0;
  const f = flow(make({ resetPasswordForEmail: () => { calls++; return new Promise(r => { release = r; }); } }));
  const pending = f.request('test@example.invalid');
  await assert.rejects(f.request('test@example.invalid'), { code: 'busy' });
  release({ error: null }); await pending; assert.equal(calls, 1);
});
test('reset: accesso diretto non autorizza cambio password', async () => {
  let calls = 0; const f = flow(make({ updateUser: async () => { calls++; } }), { mode: 'request' });
  await assert.rejects(f.update('NuovaPassword1!', 'NuovaPassword1!'), { code: 'expired' }); assert.equal(calls, 0);
});
test('reset: verifica server e nessun aggiornamento anticipato', async () => {
  const seen = []; const a = make();
  for (const n of ['setSession', 'getUser', 'updateUser']) { const original = a[n]; a[n] = async (...args) => { seen.push(n); return original(...args); }; }
  await flow(a).verify(); assert.deepEqual(seen, ['setSession', 'getUser']);
});
test('reset: token rifiutato non abilita il modulo', async () => {
  const f = flow(make({ setSession: async () => ({ error: { status: 401 } }) }));
  await assert.rejects(f.verify(), { code: 'expired' });
  await assert.rejects(f.update('NuovaPassword1!', 'NuovaPassword1!'), { code: 'expired' });
});
test('reset: verifica utente fallita non autorizza update', async () => {
  const f = flow(make({ getUser: async () => ({ data: { user: null }, error: null }) }));
  await assert.rejects(f.verify(), { code: 'expired' });
});
test('MFA: nessun bypass di un secondo fattore gia configurato', async () => {
  const f = flow(make({ mfa: { getAuthenticatorAssuranceLevel: async () => ({ data: { currentLevel: 'aal1', nextLevel: 'aal2' } }) } }));
  await assert.rejects(f.verify(), { code: 'mfa_required' });
  await assert.rejects(f.update('NuovaPassword1!', 'NuovaPassword1!'), { code: 'expired' });
});
test('MFA: risposta incompleta rifiutata', async () => {
  const f = flow(make({ mfa: { getAuthenticatorAssuranceLevel: async () => ({ data: null }) } }));
  await assert.rejects(f.verify(), { code: 'expired' });
});
test('reset: mismatch e password debole bloccate prima di update', async () => {
  let calls = 0; const f = flow(make({ updateUser: async () => { calls++; } })); await f.verify();
  await assert.rejects(f.update('NuovaPassword1!', 'DiversaPassword1!'), { code: 'password_mismatch' });
  await assert.rejects(f.update('breve', 'breve'), { code: 'weak_password' }); assert.equal(calls, 0);
});
test('reset: successo, revoca globale e impossibilita di riusare il form', async () => {
  let update, signout; const f = flow(make({ updateUser: async x => { update = x; return { data: { user: { id: 'test-id' } } }; }, signOut: async x => { signout = x; return {}; } }));
  await f.verify(); assert.deepEqual(await f.update('NuovaPassword1!', 'NuovaPassword1!'), { sessionsRevoked: true });
  assert.deepEqual(update, { password: 'NuovaPassword1!' }); assert.deepEqual(signout, { scope: 'global' });
  await assert.rejects(f.update('NuovaPassword2!', 'NuovaPassword2!'), { code: 'expired' });
});
test('reset: password compromessa rifiutata dal server resta errore', async () => {
  const f = flow(make({ updateUser: async () => ({ error: { code: 'weak_password' } }) })); await f.verify();
  await assert.rejects(f.update('NuovaPassword1!', 'NuovaPassword1!'), e => e.code === 'weak_password');
});
test('reset: fallimento logout non nasconde password gia modificata', async () => {
  const f = flow(make({ signOut: async () => { throw new Error('Network'); } })); await f.verify();
  assert.deepEqual(await f.update('NuovaPassword1!', 'NuovaPassword1!'), { sessionsRevoked: false });
});
test('reset: nuovo caricamento non eredita permessi da sessione esistente', async () => {
  const f = flow(make(), { mode: 'request' }); await assert.rejects(f.verify(), { code: 'expired' });
});
const source = f => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
test('pagina: nessuna persistenza sessione ne refresh automatico', () => {
  const s = source('src/pages/RecoveryPage.jsx');
  assert.match(s, /persistSession: false/); assert.match(s, /detectSessionInUrl: false/); assert.match(s, /autoRefreshToken: false/); assert.match(s, /flowType: 'implicit'/);
  assert.doesNotMatch(s, /localStorage|sessionStorage|console\.|track\(/);
});
test('bootstrap: pulizia URL precede import recupero, analytics non importati staticamente', () => {
  const s = source('src/main.jsx'); assert.ok(s.indexOf('replaceState') < s.indexOf("import('./pages/RecoveryPage.jsx')"));
  assert.doesNotMatch(s, /from ['"].*(analytics|supabaseClient|App)/);
});
test('login: mostra password, recupero, contatti e guardia doppio invio presenti', () => {
  const s = source('src/pages/LoginPage.jsx');
  for (const text of ['Password dimenticata?', 'Mostra password', 'Nascondi password', 'Problemi di accesso?', 'loginLock.current']) assert.ok(s.includes(text));
  assert.match(s, /href="\/recupero-password"/); assert.match(s, /to="\/contatti"/);
});
test('config: header no-store e no-referrer soltanto per recupero', () => {
  const c = JSON.parse(source('vercel.json'));
  const h = c.headers.find(x => x.source === RECOVERY_PATH);
  assert.ok(h.headers.some(x => x.key === 'Cache-Control' && x.value === 'no-store'));
  assert.ok(h.headers.some(x => x.key === 'Referrer-Policy' && x.value === 'no-referrer'));
  assert.ok(c.rewrites.some(x => x.source === '/libro' && x.destination === '/libro.html'));
});
