// src/components/Auth/LoginForm.tsx

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    setMessage('Login in corso...');
    const { error, data } = await supabase.auth.signInWithPassword({ 
email, password });

    if (error && error.message === 'Invalid login credentials') {
      // Fallback → registra utente se non esiste
      const { error: signUpError } = await supabase.auth.signUp({ email, 
password });
      if (signUpError) {
        setMessage('Registrazione fallita: ' + signUpError.message);
      } else {
        setMessage('Utente registrato! Controlla la mail se necessario.');
      }
    } else if (error) {
      setMessage('Errore login: ' + error.message);
    } else {
      setMessage('Login riuscito!');
    }
  };

  return (
    <div style={{ background: '#1e1e1e', padding: '2rem', borderRadius: 
'8px', color: '#fff' }}>
      <h2>Accedi o registrati</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '1rem', 
padding: '0.5rem' }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: '1rem', 
padding: '0.5rem' }}
      />

      <button
        onClick={handleLogin}
        style={{
          background: '#bb86fc',
          color: '#000',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Accedi / Registrati
      </button>

      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

