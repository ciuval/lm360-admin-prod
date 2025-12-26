// src/pages/Signup.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoad(true);
    try {
      const redirect = `${location.origin}/#/home?verify=1`;
      const { error } = await supabase.auth.signUp({
        email,
        password: pwd,
        options: {
          emailRedirectTo: redirect,
          data: { role: 'user' }, // metadati innocui
        },
      });
      if (error) throw error;
      setSent(true);
      // Event stitching (no PII)
      window.dispatchEvent(new CustomEvent('lm360:event', { detail: { name: 'sign_up' } }));
    } catch (err) {
      // Messaggio sobrio, senza dettagli PII
      setError(err?.message?.replace(/email|password/gi, 'campo') || 'Errore di registrazione');
    } finally {
      setLoad(false);
    }
  };

  const field = { display: 'grid', gap: 6 };
  const shell = { maxWidth: 520, margin: '8vh auto', padding: '24px' };

  if (sent) {
    return (
      <section style={shell} aria-live="polite">
        <h2>Controlla la tua email</h2>
        <p>
          Ti abbiamo inviato un link per confermare l’account. Dopo la conferma verrai riportatə
          nell’app.
        </p>
        <p style={{ opacity: 0.8, fontSize: 14 }}>
          Se non arriva, verifica spam o riprova tra 1–2 minuti.
        </p>
      </section>
    );
  }

  return (
    <section style={shell}>
      <h2>Crea il tuo profilo</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14, marginTop: 12 }} noValidate>
        <label style={field}>
          <span>Email</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
          />
        </label>

        <label style={field}>
          <span>Password</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            aria-invalid={!!error}
          />
          <small style={{ opacity: 0.7 }}>Minimo 8 caratteri.</small>
        </label>

        {error ? (
          <div role="alert" style={{ color: '#ff6b6b' }}>
            {error}
          </div>
        ) : null}

        <button
          disabled={loading}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: 'none',
            fontWeight: 600,
            background: '#7C3AED',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Invio…' : 'Registrati'}
        </button>
      </form>
    </section>
  );
}
