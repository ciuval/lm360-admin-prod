import { getJson, setJson } from '../lib/storage';
// src/components/PremiumOnly.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function PremiumOnly({ children }) {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPremium = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast('ðŸš« Devi essere loggato per accedere.');
        navigate('/login');
        return;
      }

      const { data: profilo, error } = await supabase
        .from('profili')
        .select('premium')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !profilo) {
        toast.error('Errore nel controllo Premium.');
        navigate('/paywall');
        return;
      }

      if (profilo.premium !== true) {
        toast('ðŸ”’ Funzione riservata agli utenti Premium');
        navigate('/paywall');
        return;
      }

      setIsPremium(true);
      setLoading(false);
    };

    checkPremium();
  }, [navigate]);

  if (loading) return <p style={{ padding: '2rem' }}>â³ Verifica accesso Premium...</p>;

  return <>{isPremium && children}</>;
}
