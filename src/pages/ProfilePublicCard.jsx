import { getJson, setJson } from '../lib/storage';
// src/pages/ProfilePublicCard.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import LazyImage from '../components/LazyImage';

export default function ProfilePublicCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profilo, setProfilo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMatch, setIsMatch] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: session } = await supabase.auth.getSession();
      const myId = session?.session?.user?.id;
      setUserId(myId);

      // Carica profilo
      const { data, error } = await supabase.from('profili').select('*').eq('id', id).single();
      if (!error) setProfilo(data);

      // Verifica match reciproco
      if (myId && id) {
        const { data: m1 } = await supabase
          .from('match_scores')
          .select('*')
          .eq('user_id', myId)
          .eq('matched_user_id', id)
          .eq('score', 100)
          .maybeSingle();

        const { data: m2 } = await supabase
          .from('match_scores')
          .select('*')
          .eq('user_id', id)
          .eq('matched_user_id', myId)
          .eq('score', 100)
          .maybeSingle();

        if (m1 && m2) setIsMatch(true);
      }

      setLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  const vaiAllaChat = () => {
    navigate(`/chat/${id}`);
  };

  if (loading) return <p className="p-8 text-gray-400">â³ Caricamento...</p>;
  if (!profilo) return <p className="p-8 text-gray-400">âŒ Profilo non trovato.</p>;

  return (
    <div className="p-8 bg-dark text-light min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
        ðŸ‘¤ Profilo Pubblico
        {isMatch && (
          <span className="bg-primary text-white px-3 py-1 rounded-lg text-sm shadow animate-pulse">
            ðŸ’˜ Match!
          </span>
        )}
      </h2>

      {/* Foto profilo */}
      {profilo.foto_url && (
        <div className="w-40 h-40 rounded-xl overflow-hidden mb-6 shadow-lg">
          <LazyImage
            src={profilo.foto_url}
            alt={`Foto profilo di ${profilo.nome}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info profilo */}
      <div className="space-y-2 text-gray-300">
        <p>
          <strong className="text-light">Nome:</strong> {profilo.nome || 'N/D'}
        </p>
        <p>
          <strong className="text-light">Bio:</strong> {profilo.bio || 'Nessuna bio'}
        </p>
        <p>
          <strong className="text-light">Interessi:</strong> {profilo.interessi || 'Nessuno'}
        </p>
        <p>
          <strong className="text-light">Ruolo:</strong> {profilo.ruolo || 'utente'}
        </p>
      </div>

      {/* CTA se match */}
      {isMatch && (
        <button
          onClick={vaiAllaChat}
          className="mt-6 px-6 py-3 bg-primary text-white font-semibold rounded-xl shadow hover:bg-pink-600 transition"
        >
          ðŸ’¬ Chatta ora
        </button>
      )}
    </div>
  );
}
