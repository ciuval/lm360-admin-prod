import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Eye, EyeOff, Crown } from "lucide-react";

export default function ProfilePublicCard() {
  const { id } = useParams();
  const [profilo, setProfilo] = useState(null);
  const [visite, setVisite] = useState(0);

  useEffect(() => {
    const fetchProfilo = async () => {
      const { data, error } = await supabase.from("profili").select("*").eq("id", id).single();
      if (!error) setProfilo(data);
    };

    const fetchVisite = async () => {
      const { count } = await supabase
        .from("visite_profili")
        .select("id", { count: "exact", head: true })
        .eq("visitato_id", id);
      setVisite(count || 0);
    };

    if (id) {
      fetchProfilo();
      fetchVisite();
    }
  }, [id]);

  if (!profilo) return <p className="text-white">Caricamento profilo...</p>;

  return (
    <div className="bg-gray-900 text-white p-6 rounded-xl max-w-md mx-auto shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={profilo.avatar_url || "/default-avatar.png"}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border border-pink-500"
        />
        <div>
          <h2 className="text-2xl font-bold">{profilo.username}</h2>
          <div className="flex gap-2 mt-1">
            {profilo.stato_premium === "approvato" && (
              <span className="inline-flex items-center text-yellow-400 text-sm bg-yellow-800 px-2 py-1 rounded">
                <Crown size={14} className="mr-1" /> Premium
              </span>
            )}
            {profilo.modalita_incognito && (
              <span className="inline-flex items-center text-gray-300 text-sm bg-gray-700 px-2 py-1 rounded">
                <EyeOff size={14} className="mr-1" /> Incognito
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mb-2">
        <p className="text-sm text-gray-400 mb-1">Bio:</p>
        <p className="text-base">{profilo.bio || "(nessuna descrizione)"}</p>
      </div>

      <div className="mb-2">
        <p className="text-sm text-gray-400 mb-1">Interessi:</p>
        <p className="text-base">{profilo.interessi || "(non specificati)"}</p>
      </div>

      <div className="flex items-center text-sm text-gray-400 mt-4 gap-2">
        <Eye size={16} />
        <span>{visite} visite ricevute</span>
      </div>
    </div>
  );
}

