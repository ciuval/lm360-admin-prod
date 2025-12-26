import { getJson, setJson } from '../lib/storage';
// src/hooks/useSession.js
// Recupera utente, profilo, ruolo e stato premium da Supabase in modo resiliente.
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // â†©ï¸  cambia se il tuo client ha un path diverso

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const { data: { session } = {} } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(session);

        if (session?.user?.id) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('id, ruolo, tier, is_premium, status_account')
            .eq('id', session.user.id)
            .maybeSingle();

          if (isMounted) setProfile(prof || null);
        }
      } catch (e) {
        console.error('useSession error', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => {
      isMounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const ruolo = profile?.ruolo || (session ? 'user' : 'guest');
  const isPremium =
    profile?.tier === 'premium' || profile?.is_premium === true || ruolo === 'admin';

  return { loading, session, profile, ruolo, isPremium };
}
