import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
{user?.id === profilo?.id && (
  <IncognitoBadge userId={user.id} context="pubblico" />
)}

export default function ProfilePublicView() {
  const { id } = useParams(); // ID del profilo da visualizzare
  const [profilo, setProfilo] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from("profili")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setProfilo(data);
    };
    fetchUserAndProfile();
  }, [id]);

  useEffect(() => {
    const registraVisita = async () => {
      if (!user?.id || !profilo?.id || user.id === profilo.id) return;

      // Controlla se il visitatore ha la modalità incognito attiva
      const { data: visitatore } = await supabase
        .from("profili")
        .select("modalita_incognito")
        .eq("id", user.id)
        .single();

      if (visitatore?.modalita_incognito) return;

      await supabase.from("visite_profili").insert({
        visitatore_id: user.id,
        visitato_id: profilo.id,
      });
    };
    registraVisita();
  }, [user, profilo]);

  if (!profilo) return <p className="text-white">Caricamento profilo...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Profilo Pubblico</h2>
      <div className="bg-gray-800 p-4 rounded-xl">
        <p><strong>Username:</strong> {profilo.username}</p>
        <p><strong>Bio:</strong> {profilo.bio}</p>
        <p><strong>Interessi:</strong> {profilo.interessi}</p>
      </div>
    </div>
  );
}
