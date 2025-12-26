import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function NewsletterPage() {
  const [oggetto, setOggetto] = useState("Aggiornamenti LoveMatch360");
  const [messaggio, setMessaggio] = useState("Benvenuto! Questa è una newsletter di test.");
  const [output, setOutput] = useState("");

  const inviaNewsletter = async () => {
    setOutput("📨 Invio in corso...");

    const { data: destinatari, error } = await supabase
      .from("iscritti_newsletter")
      .select("email");

    if (error) return setOutput(`❌ Errore lettura iscritti: ${error.message}`);
    if (!destinatari.length) return setOutput("⚠️ Nessun iscritto trovato.");

    for (const r of destinatari) {
      console.log(`📬 Email inviata a: ${r.email}`);
    }

    const { error: logErr } = await supabase.from("log_newsletter").insert({
      oggetto,
      messaggio,
      destinatari: destinatari.length,
    });

    if (logErr) return setOutput(`❌ Errore log: ${logErr.message}`);
    setOutput(`✅ Newsletter inviata a ${destinatari.length} iscritti.`);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">📬 Invia Newsletter</h2>

      <input
        type="text"
        value={oggetto}
        onChange={(e) => setOggetto(e.target.value)}
        className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-600"
        placeholder="Oggetto"
      />
      <textarea
        value={messaggio}
        onChange={(e) => setMessaggio(e.target.value)}
        className="w-full mb-4 p-2 rounded bg-gray-800 border border-gray-600"
        placeholder="Messaggio"
        rows={6}
      />
      <button
        onClick={inviaNewsletter}
        className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded"
      >
        📩 Invia newsletter
      </button>

      <pre className="whitespace-pre-wrap mt-4 bg-gray-900 p-4 rounded text-sm border border-gray-700">
        {output}
      </pre>
    </div>
  );
}

