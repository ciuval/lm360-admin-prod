import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PremiumFeaturesGate({ userId }) {
  const [stato, setStato] = useState("caricamento");

  useEffect(() => {
    if (userId) checkStatoPremium();
  }, [userId]);

  const checkStatoPremium = async () => {
    const { data, error } = await supabase
      .from("profili")
      .select("stato_premium")
      .eq("id", userId)
      .single();

    if (!error && data) setStato(data.stato_premium);
    else setStato("errore");
  };

  if (stato === "caricamento") return <p className="text-white">Caricamento...</p>;
  if (stato === "errore") return <p className="text-red-500">Errore nel controllo accesso premium.</p>;
  if (stato !== "approvato")
    return (
      <div className="bg-yellow-800 text-white p-4 rounded-xl text-center">
        <p className="text-lg font-bold">Accesso Premium Non Disponibile</p>
        <p className="text-sm">Questa sezione è riservata agli utenti con accesso premium approvato.</p>
      </div>
    );

  // Se approvato, mostra i contenuti premium
  return (
    <div className="bg-green-900 p-4 rounded-xl text-white">
      <h2 className="text-xl font-bold mb-2">Contenuti Premium</h2>
      <ul className="list-disc list-inside">
        <li>Visualizza chi ha visitato il tuo profilo</li>
        <li>Accesso anticipato ai match compatibili</li>
        <li>Modalità incognito</li>
        <li>Priorità nel radar e nei suggerimenti</li>
        <li>Posta illimitata e swipe extra</li>
      </ul>
    </div>
  );
}
