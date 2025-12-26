import { getJson, setJson } from '../lib/storage';
/* src/pages/LoginPage.jsx */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useLoader } from '../hooks/useLoader';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
const strong = (p) =>
  p.length >= 8 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);

export default function LoginPage() {
  const nav = useNavigate();
  const { withAsync } = useLoader();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [newPwd, setNewPwd] = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setShowReset(true);
    });
    const qs = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
    if (qs.get('type') === 'recovery') setShowReset(true);
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      toast.error('Email non valida');
      return;
    }
    if (password.length < 6) {
      toast.error('Password troppo corta');
      return;
    }
    setSubmitting(true);
    await withAsync(async () => {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        toast.error(error.message || 'Accesso non riuscito');
        setSubmitting(false);
        return;
      }
      toast.success('Bentornato!');
      setSubmitting(false);
      nav('/profilo', { replace: true });
    });
  };

  const reset = async () => {
    if (!isEmail(email)) {
      toast("Inserisci l'email sopra e riprova");
      return;
    }
    await withAsync(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/#/login`,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Email inviata. Controlla la casella.');
    });
  };

  const updatePassword = async () => {
    if (newPwd !== newPwd2) {
      toast.error('Le password non coincidono');
      return;
    }
    if (!strong(newPwd)) {
      toast.error('Min 8, minuscola, MAIUSCOLA, numero, simbolo.');
      return;
    }
    setSavingPwd(true);
    await withAsync(async () => {
      const { error } = await supabase.auth.updateUser({ password: newPwd });
      if (error) {
        toast.error(error.message || 'Aggiornamento non riuscito');
        setSavingPwd(false);
        return;
      }
      setShowReset(false);
      setNewPwd('');
      setNewPwd2('');
      toast.success('Password aggiornata. Ora accedi.');
      setSavingPwd(false);
    });
  };

  return (
    <section className="lm-page">
      <div className="lm-wrap">
        <div className="lm-card" style={{ maxWidth: 520 }}>
          <div className="lm-title">
            <span style={{ fontSize: 24 }}>🔐</span>
            <span>Accedi</span>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <input
              className="lm-input"
              type="email"
              placeholder="email@esempio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <div className="lm-row">
              <input
                className="lm-input"
                style={{ flex: 1 }}
                type={showPwd ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="lm-eye"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? 'Nascondi password' : 'Mostra password'}
              >
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
            <button type="submit" disabled={submitting} className="lm-btn-primary">
              {submitting ? 'Accesso...' : 'Accedi'}
            </button>
          </form>

          <div className="lm-actions">
            Password dimenticata?{' '}
            <button className="lm-link" onClick={reset}>
              Invia link reset
            </button>
          </div>
          <div className="lm-actions">
            Non hai un account?{' '}
            <button className="lm-link" onClick={() => nav('/signup')}>
              Crea profilo
            </button>
          </div>
        </div>
      </div>

      {showReset && (
        <div
          className="lm-modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div className="lm-card" style={{ maxWidth: 520, width: '100%' }}>
            <div className="lm-title">
              <span style={{ fontSize: 22 }}>🔒</span>
              <span>Imposta nuova password</span>
            </div>
            <div className="space-y-3">
              <input
                className="lm-input"
                type="password"
                placeholder="Nuova password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
              <input
                className="lm-input"
                type="password"
                placeholder="Ripeti password"
                value={newPwd2}
                onChange={(e) => setNewPwd2(e.target.value)}
              />
              <div className="lm-row" style={{ gap: 8 }}>
                <button className="lm-btn-primary" onClick={updatePassword} disabled={savingPwd}>
                  {savingPwd ? 'Salvataggio…' : 'Salva'}
                </button>
                <button
                  className="lm-link"
                  onClick={() => setShowReset(false)}
                  disabled={savingPwd}
                >
                  Annulla
                </button>
              </div>
              <p className="lm-actions" style={{ opacity: 0.7 }}>
                Requisiti: 8+ caratteri, minuscola, maiuscola, numero e simbolo.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
