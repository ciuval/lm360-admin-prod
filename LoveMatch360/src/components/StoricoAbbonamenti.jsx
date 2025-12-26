import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function StoricoAbbonamenti({ userId }) {
  const [storico, setStorico] = useState([]);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("abbonamenti")
      .select("*")
      .eq("utente_id", userId)
      .order("inizio", { ascending: false })
      .then(({ data }) => setStorico(data || []));
  }, [userId]);

  if (!storico.length) return null;

  return (
    <div>
      <h3>📜 Storico Abbonamenti</h3>
      <ul>
        {storico.map((ab, i) => (
          <li key={i}>
            {ab.tipo} — dal {new Date(ab.inizio).toLocaleDateString()} al {new Date(ab.fine).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
