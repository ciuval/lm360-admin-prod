import { readRecoveryURL, RECOVERY_PATH } from './lib/recoveryFlow.js';
const incoming = readRecoveryURL(window.location.href);
const failed = () => {
  const root = document.getElementById('root');
  root.textContent = 'Pagina non disponibile. Ricarica la pagina oppure torna al login. ';
  const link = document.createElement('a'); link.href = '/#/login'; link.textContent = 'Torna ad Accedi'; root.append(link);
};
if (incoming.active) {
  // Tokens remain only in memory; do not import the normal app/analytics on recovery pages.
  try {
    window.history.replaceState(null, '', RECOVERY_PATH);
    const meta = document.createElement('meta'); meta.name = 'referrer'; meta.content = 'no-referrer'; document.head.append(meta);
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow');
    import('./pages/RecoveryPage.jsx').then(m => m.mountRecovery(incoming)).catch(failed);
  } catch { failed(); }
} else {
  import('./application.jsx').catch(failed);
}
