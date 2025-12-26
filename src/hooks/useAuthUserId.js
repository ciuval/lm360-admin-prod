import { getJson, setJson } from '../lib/storage';
// src/hooks/useAuthUserId.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useAuthUserId() {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    let active = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (active) setUserId(user?.id ?? null);
    })();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  return userId;
}
