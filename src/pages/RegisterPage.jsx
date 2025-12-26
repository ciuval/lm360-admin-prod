import { getJson, setJson } from '../lib/storage';
/* src/pages/RegisterPage.jsx */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useLoader } from '../hooks/useLoader';

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());

export default function RegisterPage() {
  const nav = useNavigate();
  const { withAsync } = useLoader();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      toast.error('Email non valida');
      return;
    }
    if (password.length < 6) {
      toast.error('Password troppo corta (min 6)');
      return;
    }
    if (password !== confirm) {
      toast.error('Le password non coincidono');
      return;
    }
    if (!agree) {
      toast('Accetta Termini e Privacy');
      return;
    }
    setSubmitting(true);
    await withAsync(async () => {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/#/login` },
      });
      if (error) {
        toast.error(error.message || 'Registrazione non riuscita');
        setSubmitting(false);
        return;
      }
      toast.success("Controlla la tua email per confermare l'account.");
      setSubmitting(false);
      nav('/login', { replace: true });
    });
  };

  return (
    <section className="lm-page">
      <div className="lm-wrap">
        <div className="lm-card" style={{ maxWidth: 520 }}>
          <div className="lm-title">
            <span style={{ fontSize: 24 }}>🪪</span>
            <span>Crea profilo</span>
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
            <input
              className="lm-input"
              type="password"
              placeholder="Password (min 6)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <input
              className="lm-input"
              type="password"
              placeholder="Conferma password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
            <label
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'start',
                fontSize: 14,
                color: 'var(--text-dim)',
              }}
            >
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <span>
                Accetto{' '}
                <a href="/#/terms" className="lm-link">
                  Termini
                </a>{' '}
                e{' '}
                <a href="/#/privacy" className="lm-link">
                  Privacy
                </a>
                .
              </span>
            </label>
            <button type="submit" disabled={submitting} className="lm-btn-primary">
              {submitting ? 'Creo profilo...' : 'Crea profilo'}
            </button>
          </form>

          <div className="lm-actions">
            Hai già un account?{' '}
            <button className="lm-link" onClick={() => nav('/login')}>
              Accedi
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
