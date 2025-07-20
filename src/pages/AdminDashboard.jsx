import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// ⚠️ Componenti disattivati temporaneamente per evitare errori
// import AdminPremiumRequests from "../components/AdminPremiumRequests";
// import ActivityLogViewer from "../components/ActivityLogViewer";
// import ActivityLogCSVAndGraph from "../components/ActivityLogCSVAndGraph";
// import BadgeRichiestePremium from "../components/BadgeRichiestePremium";
// import useRealtimeLogListener from "../hooks/useRealtimeLogListener";

export default function AdminDashboard() {
  const [utenti, setUtenti] = useState([]);
  const [filtro, setFiltro] = useState("");

  // useRealtimeLogListener(); // disattivato temporaneamente

  useEffect(() => {
    fetchUtenti();
  }, []);

  const fetchUtenti = async () => {
    const { data, error } = await supabase.from("profili").select("*");
    if (!error && data) setUtenti(data);
  };

  const cambiaRuolo = async (id, nuovoRuolo) => {
    await supabase.from("profili").update({ ruolo: nuovoRuolo }).eq("id", id);
    fetchUtenti();
  };

  const eliminaUtente = async (id) => {
    await supabase.from("profili").delete().eq("id", id);
    fetchUtenti();
  };

  const utentiFiltrati = utenti.filter((u) =>
    (u.username || "").toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>🛠️ Admin Dashboard</h2>

      <input
        type="text"
        placeholder="🔍 Cerca utente..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={inputStyle}
      />

      <ul style={listStyle}>
        {utentiFiltrati.map((u) => (
          <li key={u.id} style={itemStyle}>
            <strong>{u.username || "Anonimo"}</strong> – <code>{u.ruolo}</code>
            <br />
            <button onClick={() => cambiaRuolo(u.id, "admin")} style={btn}>
              🔑 Admin
            </button>
            <button onClick={() => cambiaRuolo(u.id, "utente")} style={btn}>
              🙋‍♂️ Utente
            </button>
            <button
              onClick={() => eliminaUtente(u.id)}
              style={{ ...btn, backgroundColor: "#ff4d4d" }}
            >
              🗑️ Elimina
            </button>
          </li>
        ))}
      </ul>

      {/* Sezioni extra da riattivare dopo */}
      {/* <div id="richieste-premium"><AdminPremiumRequests /></div>
          <ActivityLogViewer />
          <ActivityLogCSVAndGraph /> */}
    </div>
  );
}

// STILI
const containerStyle = {
  backgroundColor: "#121212",
  color: "#fff",
  padding: "2rem",
  fontFamily: "Segoe UI, sans-serif",
  minHeight: "100vh",
};

const titleStyle = {
  color: "#f08fc0",
  textShadow: "0 0 10px #f08fc0",
  marginBottom: "1rem",
};

const inputStyle = {
  padding: "0.6rem",
  marginBottom: "1rem",
  width: "100%",
  borderRadius: "6px",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  border: "none",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
};

const itemStyle = {
  marginBottom: "1rem",
  borderBottom: "1px solid #333",
  paddingBottom: "1rem",
};

const btn = {
  margin: "0.4rem 0.4rem 0 0",
  padding: "0.4rem 0.8rem",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  backgroundColor: "#333",
  color: "#fff",
};

