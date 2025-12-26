import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoad] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoad(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) throw error;
      window.dispatchEvent(new CustomEvent('lm360:event', { detail: { name: 'login' } }));
      location.hash = '#/home';
    } catch {
      setError('Accesso non riuscito. Controlla i campi.');
    } finally {
      setLoad(false);
    }
  };

  const shell = { maxWidth: 420, margin: '8vh auto', padding: 24 };
  const field = { display: 'grid', gap: 6 };

  return (
    <section style={shell}>
      <h2>Accedi</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14, marginTop: 12 }} noValidate>
        <label style={field}>
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label style={field}>
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
        </label>
        {error && (
          <div role="alert" style={{ color: '#ff6b6b' }}>
            {error}
          </div>
        )}
        <button
          disabled={loading}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            border: 'none',
            fontWeight: 600,
            background: '#7C3AED',
            color: '#fff',
          }}
        >
          {loading ? 'Entro…' : 'Accedi'}
        </button>
        <small style={{ opacity: 0.7 }}>
          Non hai un account? <a href="#/signup">Registrati</a>
        </small>
      </form>
    </section>
  );
}
