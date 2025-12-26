// src/pages/ProfileForm.tsx

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { trackEvent } from '../lib/analytics';

const ProfileForm = ({ user }) => {
  const [bio, setBio] = useState('');
  const [interessi, setInteressi] = useState('');

  const handleSave = async () => {
    const { error } = await supabase.from('profili').update({
      bio,
      interessi
    }).eq('id', user.id);

    if (!error) {
      trackEvent('profile_complete', {
        userId: user.id
      });
    }
  };

  return (
    <div>
      <input
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio"
      />
      <input
        value={interessi}
        onChange={(e) => setInteressi(e.target.value)}
        placeholder="Interessi"
      />
      <button onClick={handleSave}>Salva Profilo</button>
    </div>
  );
};

export default ProfileForm;
