import { getJson, setJson } from '../lib/storage';
// src/pages/CheckoutSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ldOn, ldOff } from '../hooks/useLoader';
import { abAssign, abTrack } from '../lib/ab';
import { supabase } from '../lib/supabaseClient';

export default function CheckoutSuccess() {
  const nav = useNavigate();

  useEffect(() => {
    try {
      ldOn();
    } catch {}
    const t = setTimeout(() => {
      try {
        ldOff();
      } catch {}
    }, 600);
    return () => clearTimeout(t);
  }, []);

  // Conversioni A/B: hero_v1 & paywall_copy
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const uid = user?.id || null;

      const vHero = abAssign('hero_v1');
      abTrack({ test: 'hero_v1', variant: vHero, event: 'conversion', user_id: uid });

      const vPay = abAssign('paywall_copy');
      abTrack({ test: 'paywall_copy', variant: vPay, event: 'conversion', user_id: uid });
    })();
  }, []);

  return (
    <section className="p-8 bg-dark text-light min-h-screen flex items-center justify-center">
      <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-8 max-w-lg text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-extrabold mb-3 text-primary">Benvenuto in Premium!</h1>
        <p className="text-gray-300 mb-6">
          Hai sbloccato filtri pro, chat prioritaria e libreria pratica.
        </p>
        <button
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-pink-600 transition"
          onClick={() => nav('/profilo', { replace: true })}
        >
          Vai al Profilo
        </button>
        <div className="mt-4 text-sm text-gray-400">
          Vuoi vedere subito i tuoi <strong>Match</strong>?{' '}
          <button className="text-primary hover:underline" onClick={() => nav('/match')}>
            Vai ai Match 💘
          </button>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Gestisci l’abbonamento dal tuo profilo (Billing Portal).
        </div>
      </div>
    </section>
  );
}
