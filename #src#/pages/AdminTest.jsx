// src/pages/AdminTest.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminTest() {
  const [utenti, setUtenti] = useState([]);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    async function fetchUtenti() {
      const { data, error } = await supabase.from("profili").select("*");
      if (error) {
        setErrore(error.message);
      } else {
        setUtenti(data);
      }
    }

    fetchUtenti();
  }, []);

  return (
    <div style={{ backgroundColor: "#121212", color: "#fff", padding: 
"2rem", fontFamily: "Segoe UI, sans-serif" }}>
      <h2 style={{ color: "#f08fc0", textShadow: "0 0 8px #f08fc0" }}>🔍 
Test Supabase</h2>

      {errore && <p style={{ color: "red" }}>❌ Errore: {errore}</p>}

      {!errore && utenti.length === 0 && <p>Nessun utente trovato.</p>}

      <ul>
        {utenti.map((utente) => (
          <li key={utente.id}>👤 {utente.username || "Anonimo"} – 
{utente.email || "email sconosciuta"}</li>
        ))}
      </ul>
    </div>
  );
}

