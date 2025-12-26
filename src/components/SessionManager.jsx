import { getJson, setJson } from '../lib/storage';
// src/components/SessionManager.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function SessionManager({ setSessionUserId }) {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const userId = session?.user?.id;
        if (userId) {
          setSessionUserId(userId);
          navigate('/profilo');
        }
      }

      if (event === 'SIGNED_OUT') {
        setSessionUserId(null);
        navigate('/login');
      }
    });

    return () => {
      authListener.subscription?.unsubscribe?.();
    };
  }, [navigate, setSessionUserId]);

  return null;
}
