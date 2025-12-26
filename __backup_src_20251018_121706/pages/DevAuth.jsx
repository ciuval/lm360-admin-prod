// src/pages/DevAuth.jsx — DEV login con email/password (oltre ai pulsanti già presenti)
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function DevAuth() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [email, setEmail] = useState('dev@test.local');
  const [password, setPassword] = useState('Dev12345!');

  const refresh = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data?.user ?? null);
  };
  useEffect(() => { refresh(); }, []);

  const loginPwd = async () => {
    setErr(''); setMsg('login password…');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message); else setMsg('ok');
    await refresh();
  };

  const signupPwd = async () => {
    setErr(''); setMsg('signup… (può richiedere conferma email se attiva)');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setErr(error.message); else setMsg('signup ok (controlla Users o email)');
    await refresh();
  };

  const logout = async () => {
    setErr(''); setMsg('logout…');
    await supabase.auth.signOut();
    await refresh();
    setMsg('ok');
  };

  return (
    <div className='p-6 text-white'>
      <h1 className='text-2xl font-semibold'>Dev Auth</h1>
      <p className='opacity-80 text-sm'>Login di sviluppo. Usa una mail solo per DEV.</p>

      <div className='mt-4 p-4 rounded-md border border-zinc-700 bg-zinc-900'>
        <div className='text-sm mb-2'>User: {user ? user.id : '— (non loggato)'}</div>

        <div className='grid gap-2 max-w-sm'>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email' className='px-3 py-2 rounded bg-zinc-800 border border-zinc-700'/>
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder='password' type='password' className='px-3 py-2 rounded bg-zinc-800 border border-zinc-700'/>
          <div className='flex gap-2 mt-2'>
            <button onClick={loginPwd}  className='px-3 py-1 rounded bg-indigo-600'>Login (pwd)</button>
            <button onClick={signupPwd} className='px-3 py-1 rounded bg-zinc-700'>Signup (pwd)</button>
            <button onClick={logout}    className='px-3 py-1 rounded bg-zinc-700'>Logout</button>
            <button onClick={refresh}   className='px-3 py-1 rounded bg-zinc-700'>Refresh</button>
          </div>
        </div>

        {msg && <div className='mt-3 text-indigo-300 text-sm'>{msg}</div>}
        {err && <div className='mt-2 text-red-400 text-sm'>{err}</div>}
      </div>
    </div>
  );
}
