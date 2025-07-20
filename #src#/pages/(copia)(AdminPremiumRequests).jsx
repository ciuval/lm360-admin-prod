import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminPremiumRequests() {
  const [richieste, setRichieste] = useState([]);

  useEffect(() => {
    fetchRichieste();
  }, []);

  const fetchRichieste = async () => {
    const { data, error } = await supabase
      .from("profili")
      .select("id, username, richiesta_premium, stato_premium")
      .neq("stato_premium", "approvato");

    if (!error && data) setRichieste(data);
  };

  const aggiornaStato = async (id, nuovoStato) => {
    await supabase
      .from("profili")
      .update({ stato_premium: nuovoStato })
      .eq("id", id);

    fetchRichieste();
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      <h2 className="text-xl font-bold mb-4">Richieste Accesso Premium</h2>
      {richieste.length === 0 ? (
        <p className="text-gray-400">Nessuna richiesta in sospeso.</p>
      ) : (
        richieste.map((utente) => (
          <div
            key={utente.id}
            className="bg-gray-800 p-4 rounded-xl mb-4 shadow-md"
          >
            <div className="mb-2">
              <strong>Username:</strong> {utente.username || "(Sconosciuto)"}
            </div>
            <div className="mb-2">
              <strong>Richiesta:</strong> {utente.richiesta_premium || "(vuota)"}
            </div>
            <div className="mb-2">
              <strong>Stato attuale:</strong> {utente.stato_premium}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => aggiornaStato(utente.id, "approvato")}
                className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded"
              >
                ✅ Approva
              </button>
              <button
                onClick={() => aggiornaStato(utente.id, "rifiutato")}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
              >
                ❌ Rifiuta
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
