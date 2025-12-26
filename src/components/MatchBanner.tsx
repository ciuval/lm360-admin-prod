// src/components/MatchBanner.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const MatchBanner = ({ userId1, userId2 }: { userId1: string; userId2: string }) => {
  const [isMatch100, setIsMatch100] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data, error } = await supabase
        .from('match_scores_flat')
        .select('score')
        .match({ user_id: userId1, other_user_id: userId2 })
        .maybeSingle();

      if (!error && data?.score === 100) {
        setIsMatch100(true);
      }
    };

    if (userId1 && userId2) check();
  }, [userId1, userId2]);

  if (!isMatch100) return null;

  return (
    <div style={{
      background: '#bb86fc',
      color: '#000',
      padding: '1rem',
      textAlign: 'center',
      borderRadius: '8px',
      fontWeight: 'bold',
      marginTop: '1rem'
    }}>
      💘 Match al 100%! Siete super compatibili!
    </div>
  );
};

export default MatchBanner;
