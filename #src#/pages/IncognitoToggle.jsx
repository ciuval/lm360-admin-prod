import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function IncognitoToggle({ userId }) {
  const [attivo, setAttivo] = useState(false);
  const [caricamento, setCaricamento] = useState(true);

  useEffect(() => {
    const fetchStato = async () => {
      const { data, error } = await supabase
        .from("profili")
        .select("modalita_incognito")
        .eq("id", userId)
        .single();

      if (!error && data) setAttivo(data.modalita_incognito || false);
      setCaricamento(false);
    };
    if (userId) fetchStato();
  }, [userId]);

  const toggleIncognito = async () => {
    const nuovoStato = !attivo;
    setAttivo(nuovoStato);
    await supabase.from("profili").update({ modalita_incognito: nuovoStato }).eq("id", userId);
  };

  if (caricamento) return <p className="text-white">Caricamento modalità incognito...</p>;

  return (
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-xl mt-6">
      <div className="flex-1">
        <p className="text-white font-semibold">Modalità Incognito 🕶️</p>
        <p className="text-sm text-gray-400">Se attiva, le tue visite non verranno registrate negli altri profili.</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={attivo}
          onChange={toggleIncognito}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
        <span className="ml-2 text-sm text-gray-300">{attivo ? "Attiva" : "Disattiva"}</span>
      </label>
    </div>
  );
}

