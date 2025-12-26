import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth, AuthGuard } from '../lib/authContext';
import { resolveAvatarUrl } from '../lib/avatar';

function AccountInner() {
  const { user } = useAuth();
  const uid = user?.id;
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!uid) return;
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', uid)
        .maybeSingle();
      if (alive) setAvatar(resolveAvatarUrl(data?.avatar_url));
    })();
    return () => { alive = false; };
  }, [uid]);

  const shell = { maxWidth: 720, margin: '8vh auto', padding: 24 };

  return (
    <section style={shell}>
      <h2>Il tuo account</h2>
      <img src={avatar} alt='Avatar utente'
           style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '1px solid #2b323b' }} />
      <p>Sessione attiva. Le tue preferenze sono al sicuro.</p>
    </section>
  );
}

export default function Account() {
  return (
    <AuthGuard>
      <AccountInner />
    </AuthGuard>
  );
}
