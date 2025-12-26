// src/pages/DevEnv.jsx — mostra gli ENV client effettivi
import React from 'react';

export default function DevEnv() {
  const env = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '(vuoto)',
    VITE_SUPABASE_ANON_KEY: (import.meta.env.VITE_SUPABASE_ANON_KEY || '(vuoto)').slice(0, 12) + '…',
    NODE_ENV: import.meta.env.MODE,
  };
  return (
    <pre style={{color:'#e5e7eb', background:'#111827', padding:'16px', borderRadius:'8px'}}>
{JSON.stringify(env, null, 2)}
    </pre>
  );
}
