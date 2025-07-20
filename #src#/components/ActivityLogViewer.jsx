import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ActivityLogViewer() {
  const [log, setLog] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchLog();
  }, []);

  const fetchLog = async () => {
    const { data, error } = await supabase
      .from("log_attivita")
      .select("id, tipo, descrizione, data")
      .order("data", { ascending: false })
      .limit(100);

    if (!error && data) setLog(data);
    else console.error("Errore nel fetch dei log:", error);
  };

  const logFiltrato = log.filter((item) =>
    item.tipo.toLowerCase().includes(filtro.toLowerCase()) ||
    item.descrizione.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-4 text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Registro Attività (ultimi 100)</h2>

      <input
        type="text"
        placeholder="Filtra per tipo o descrizione..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-900 border border-gray-700"
      />

      {logFiltrato.length === 0 ? (
        <p className="text-gray-400">Nessun log trovato.</p>
      ) : (
        <table className="w-full text-left border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2 border-b border-gray-700">#</th>
              <th className="p-2 border-b border-gray-700">Tipo</th>
              <th className="p-2 border-b border-gray-700">Descrizione</th>
              <th className="p-2 border-b border-gray-700">Data</th>
            </tr>
          </thead>
          <tbody>
            {logFiltrato.map((entry, index) => (
              <tr key={entry.id} className="odd:bg-gray-900 even:bg-gray-800">
                <td className="p-2 border-b border-gray-700">{index + 1}</td>
                <td className="p-2 border-b border-gray-700">{entry.tipo}</td>
                <td className="p-2 border-b border-gray-700">{entry.descrizione}</td>
                <td className="p-2 border-b border-gray-700">
                  {new Date(entry.data).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
