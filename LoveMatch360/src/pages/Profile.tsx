// src/pages/Profile.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MicroOnboarding } from 
'../components/MicroOnboarding/MicroOnboarding';

const Profile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      // Ottieni l'utente autenticato
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Carica i dati del profilo dalla tabella "profiles"
      const { data, error } = await supabase
        .from('profiles')
        .select('photo, bio, interests')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Errore nel caricamento del profilo:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) return <p style={{ color: '#fff', padding: '2rem' 
}}>Caricamento profilo...</p>;

  if (!profile) return <p style={{ color: '#fff', padding: '2rem' 
}}>Utente non autenticato.</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui', color: '#fff', 
background: '#121212' }}>
      <h1>Il tuo profilo</h1>

      {/* Componente onboarding: mostra cosa manca nel profilo */}
      <MicroOnboarding profile={profile} />

      {/* Debug: mostra i dati profilo grezzi */}
      <pre style={{ marginTop: '2rem', background: '#1a1a1a', padding: 
'1rem' }}>
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  );
};

export default Profile;

