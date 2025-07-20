import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminPremiumRequests() {
  const [richieste, setRichieste] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchRichieste();
  }, []);

  const fetchRichieste = async () => {
    const { data, error } = await supabase
      .from("profili")
      .select("id, username, richiesta_premium, stato_premium")
      .neq("stato_premium", "approvato");

    if (!error && data) setRichieste(data);
    else console.error("Errore nel fetch:", error);
  };

  const logAttivita = async (tipo, descrizione, profilo_id) => {
    const { error } = await supabase.from("log_attivita").insert([
      {
        tipo,
        descrizione,
        profilo_id,
      },
    ]);
    if (error) {
      console.error("❌ Errore logging attività:", error.message);
    } else {
      console.log("📝 Log inserito con successo");
    }
  };

  const aggiornaStato = async (id, nuovoStato) => {
    const { error } = await supabase
      .from("profili")
      .update({ stato_premium: nuovoStato })
      .eq("id", id);

    if (!error) {
      console.log(`✅ Stato aggiornato a ${nuovoStato}`);
      await logAttivita(
        "premium",
        `Richiesta premium ${nuovoStato}`,
        id
      );
      fetchRichieste();
    } else {
      console.error("❌ Errore aggiornamento:", error.message);
    }
  };

  const richiesteFiltrate = richieste.filter((u) =>
    u.username?.toLowerCase().includes(filtro.toLowerCase())
  );
<div id="richieste-premium" className="...">
  {/* ...contenuto richieste premium... */}
</div>

  return (
    <div className="p-4 max-w-2xl mx-auto text-white">
      <h2 className="text-xl font-bold mb-4">Richieste Accesso Premium</h2>

      <input
        type="text"
        placeholder="Filtra per username..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-900 border border-gray-700"
      />

   {richiesteFiltrate.length === 0 ? (
        <p className="text-gray-400">Nessuna richiesta trovata.</p>
      ) : (
        richiesteFiltrate.map((utente) => (
          <div
            key={utente.id}
            className="bg-gray-800 p-4 rounded-xl mb-4 shadow-md"
          >
            <div className="mb-2">
              <strong>Username:</strong> {utente.username || "(Sconosciuto)"}
            </div>
            <div className="mb-2">
              <strong>Richiesta:</strong>{" "}
              {utente.richiesta_premium || "(vuota)"}
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

