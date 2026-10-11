import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { createRecoveryFlow, recoveryMessage, RECOVERY_PATH, validEmail } from '../lib/recoveryFlow.js';
import { getPasswordFeedback } from '../lib/signupFeedback.js';
import '../styles/recovery.css';

export function mountRecovery(incoming) {
  document.title = 'Recupera la password | LoveMatch360';
  const clean = value => String(value || '').trim().replace(/^['"]|['"]$/g, '');
  const client = createClient(clean(import.meta.env.VITE_SUPABASE_URL), clean(import.meta.env.VITE_SUPABASE_ANON_KEY), {
    auth: { flowType: 'implicit', persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'lm360-recovery-isolated' },
    global: { fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(15000) }) }
  });
  const flow = createRecoveryFlow(client.auth, incoming, new URL(RECOVERY_PATH, window.location.origin).href);
  delete incoming.tokens;
  createRoot(document.getElementById('root')).render(<RecoveryPage flow={flow} initial={incoming.mode} />);
}
function RecoveryPage({ flow, initial }) {
  const [step, setStep] = useState(initial), [busy, setBusy] = useState(false);
  const [email, setEmail] = useState(''), [password, setPassword] = useState(''), [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false), [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [remaining, setRemaining] = useState(0);
  const lock = useRef(false), heading = useRef(null);
  useEffect(() => { heading.current?.focus(); }, [step]);
  useEffect(() => { const id = setInterval(() => setRemaining(flow.remaining()), 1000); return () => clearInterval(id); }, [flow]);
  async function run(task) {
    if (lock.current) return;
    lock.current = true; setBusy(true); setError('');
    try { await task(); }
    catch (e) {
      if (e?.code === 'mfa_required') setStep('mfa');
      else setError(recoveryMessage(e));
    } finally { lock.current = false; setBusy(false); setRemaining(flow.remaining()); }
  }
  const feedback = getPasswordFeedback(password);
  const title = step === 'done' ? 'Password aggiornata.' : step === 'password' ? 'Scegli una nuova password.' : 'Recupera il tuo accesso.';
  return <main className="lm-recovery"><section aria-labelledby="recovery-title">
    <p className="eyebrow">LoveMatch360 · Accesso</p>
    <h1 id="recovery-title" tabIndex={-1} ref={heading}>{title}</h1>
    {error && <p className="error" role="alert">{error}</p>}
    {notice && <p className="notice" role="status">{notice}</p>}
    {step === 'request' && <form noValidate onSubmit={e => { e.preventDefault(); run(async () => { setNotice(await flow.request(email)); }); }}>
      <p>Inserisci l’email usata per il tuo account. Ti invieremo un collegamento per scegliere una nuova password.</p>
      <label htmlFor="recovery-email">Email dell’account</label>
      <input id="recovery-email" type="email" autoComplete="email" inputMode="email" maxLength={254} required disabled={busy} value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit" disabled={busy || remaining > 0 || !validEmail(email)} aria-busy={busy}>{busy ? 'Invio in corso…' : remaining > 0 ? `Attendi ${remaining} secondi` : 'Invia email di recupero'}</button>
      <p className="hint">La tua password non cambia finché non completi il recupero. Non inviare password o codici all’assistenza.</p>
    </form>}
    {step === 'link' && <><p>Hai aperto un collegamento di recupero. Premi Continua per farlo verificare dal servizio, poi scegli la nuova password.</p>
      <button disabled={busy} aria-busy={busy} onClick={() => run(async () => { await flow.verify(); setStep('password'); })}>{busy ? 'Verifica in corso…' : 'Continua con il recupero'}</button>
      <a href={RECOVERY_PATH}>Richiedi un nuovo collegamento</a></>}
    {step === 'invalid' && <><p role="alert">Collegamento non valido, scaduto o già utilizzato. Apri l’ultima email ricevuta oppure richiedine una nuova.</p><a className="action" href={RECOVERY_PATH}>Richiedi una nuova email</a></>}
    {step === 'mfa' && <><p role="alert">Questo account richiede anche il secondo fattore. Il recupero password non lo disattiva. Contatta l’assistenza per completare la verifica della titolarità.</p><a href="/#/contatti">Problemi di accesso? Contatta l’assistenza</a></>}
    {step === 'password' && <form noValidate onSubmit={e => { e.preventDefault(); run(async () => {
      const result = await flow.update(password, confirm); setPassword(''); setConfirm(''); setShow(false);
      setNotice(result.sessionsRevoked ? 'La nuova password è stata salvata. Accedi nuovamente al tuo account.' : 'Password salvata. Non è stato possibile confermare la revoca delle altre sessioni: contatta l’assistenza.'); setStep('done');
    }); }}>
      <label htmlFor="new-password">Nuova password</label>
      <input id="new-password" type={show ? 'text' : 'password'} autoComplete="new-password" maxLength={256} required disabled={busy} value={password} onChange={e => setPassword(e.target.value)} aria-describedby="password-requirements" />
      <p id="password-requirements" className="hint">{feedback.message}</p>
      <label htmlFor="confirm-password">Ripeti la nuova password</label>
      <input id="confirm-password" type={show ? 'text' : 'password'} autoComplete="new-password" maxLength={256} required disabled={busy} value={confirm} onChange={e => setConfirm(e.target.value)} />
      {confirm && confirm !== password && <p role="status">Le due password non coincidono.</p>}
      <button type="button" className="secondary" aria-pressed={show} aria-controls="new-password confirm-password" onClick={() => setShow(v => !v)}>{show ? 'Nascondi password' : 'Mostra password'}</button>
      <button type="submit" disabled={busy || !feedback.ready || password !== confirm} aria-busy={busy}>{busy ? 'Salvataggio in corso…' : 'Salva la nuova password'}</button>
      <p className="hint">Per sicurezza la procedura rimane solo in questa scheda. Completa senza ricaricare. Verrà richiesta la revoca delle sessioni precedenti, senza accesso automatico.</p>
    </form>}
    <nav aria-label="Aiuto per l’accesso"><a href="/#/login">Torna ad Accedi</a>{step !== 'mfa' && <a href="/#/contatti">Non ricordi l’email o non puoi più usarla? Contatta l’assistenza</a>}</nav>
  </section></main>;
}
