// src/components/PremiumOnly.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import usePremium from '../hooks/usePremium';

export default function PremiumOnly({ children }) {
  const { premium, loading } = usePremium();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !premium) {
      toast('Contenuto Premium. Sbloccalo a 9,99€', { icon: '🔒' });
      navigate('/premium'); // la tua pagina paywall
    }
  }, [loading, premium, navigate]);

  if (loading) return <div className='p-6'>Carico…</div>;
  if (!premium) return null;
  return <>{children}</>;
}
