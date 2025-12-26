import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthCtx = createContext({ user: null, session: null, loading: true });

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });
    return () => sub.subscription?.unsubscribe?.();
  }, []);

  return <AuthCtx.Provider value={{ user, session, loading }}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}

export function AuthGuard({ children }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div role="status" aria-live="polite" style={{ padding: 24 }}>
        Carico…
      </div>
    );
  if (!user)
    return (
      <div style={{ padding: 24 }}>
        Devi accedere. <a href="#/login">Vai al login</a>
      </div>
    );
  return children;
}
