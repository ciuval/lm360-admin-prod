import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Eye, EyeOff, Crown, Heart, Flag, Mail } from "lucide-react";

export default function ProfilePublicCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profilo, setProfilo] = useState(null);
  const [visite, setVisite] = useState(0);
  const [likeInviato, setLikeInviato] = useState(false);
  const [likeRicevuti, setLikeRicevuti] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

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

    const fetchLikesRicevuti = async () => {
      const { count } = await supabase
        .from("likes")
        .select("id", { count: "exact", head: true })
        .eq("destinatario_id", id);
      setLikeRicevuti(count || 0);
    };

    if (id) {
      fetchUserAndProfile();
      fetchVisite();
      fetchLikesRicevuti();
    }
  }, [id]);

  const inviaLike = async () => {
    if (!user || likeInviato) return;
    await supabase.from("likes").insert({ mittente_id: user.id, destinatario_id: id });
    setLikeInviato(true);
    setLikeRicevuti((prev) => prev + 1);
  };

  const segnalaUtente = async () => {
    if (!user) return;
    await supabase.from("segnalazioni").insert({ segnalatore_id: user.id, utente_segnalato_id: id });
    alert("Segnalazione inviata. Grazie per il tuo contributo.");
  };

  const vaiAllaChat = async () => {
    if (!user || !id) return;
    navigate(`/chat/${id}`);
  };

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

      <div className="flex flex-col gap-1 text-sm text-gray-400 mt-4">
        <div className="flex items-center gap-2">
          <Eye size={16} /> <span>{visite} visite ricevute</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={16} /> <span>{likeRicevuti} like ricevuti</span>
        </div>
      </div>

      {/* Azioni social */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={inviaLike}
          disabled={likeInviato}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${
            likeInviato ? "bg-gray-700 text-gray-400" : "bg-pink-600 hover:bg-pink-700 text-white"
          }`}
        >
          <Heart size={16} /> {likeInviato ? "Like inviato" : "Metti Like"}
        </button>
        <button
          onClick={vaiAllaChat}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Mail size={16} /> Invia messaggio
        </button>
        <button
          onClick={segnalaUtente}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-red-700 hover:bg-red-800 text-white"
        >
          <Flag size={16} /> Segnala
        </bu