
import PremiumFeaturesGate from "../components/PremiumFeaturesGate";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import IncognitoBadge from "../components/IncognitoBadge";

import IncognitoToggle from "../components/IncognitoToggle";
function SezioneVisite({ userId }) {
  const [visite, setVisite] = useState([]);

  useEffect(() => {
    if (userId) fetchVisite();
  }, [userId]);

  const fetchVisite = async () => {
    const { data, error } = await supabase
      .from("visite_profili")
      .select("*, visitatore:visitatore_id (username)")
      .eq("visitato_id", userId)
      .order("data_visita", { ascending: false });

    if (!error) setVisite(data);
  };

  return (
    <PremiumFeaturesGate userId={userId}>
      <div className="bg-gray-900 p-4 rounded-xl text-white mt-6">
        <h3 className="text-lg font-bold mb-3">Chi ha visitato il tuo profilo</h3>
        {visite.length === 0 ? (
          <p className="text-gray-400">Nessuna visita recente.</p>
        ) : (
          <ul className="list-disc pl-4">
            {visite.map((v) => (
              <li key={v.id}>{v.visitore?.username || "(utente sconosciuto)"}</li>
            ))}
          </ul>
        )}
      </div>
    </PremiumFeaturesGate>
  );
}
<SezioneVisite userId={user?.id} />