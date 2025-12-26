import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function VisitatoriPage() {
  const [sessionUserId, setSessionUserId] = useState(null);
  const [visitatori, setVisitatori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuoviCount, setNuoviCount] = useState(0);
  const [soloNuovi, setSoloNuovi] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const id = data?.session?.user?.id;
      if (id) setSessionUserId(id);
    });
  }, []);

  useEffect(() => {
    if (!sessionUserId) return;

    const fetchVisitatori = async () => {
      const { data, error } = await supabase
        .rpc("visitatori_conteggio", { profilo_id: sessionUserId });

      if (!error && data) {
        setVisitatori(data);
        setNuoviCount(data.filter(v => !v.visto).length);
      }
      setLoading(false);
    };

    fetchVisitatori();
  }, [sessionUserId]);

  const segnaComeVisto = async (id) => {
    await supabase.from("visite").update({ visto: true }).eq("id", id);
    setVisitatori((prev) =>
      prev.map(v => v.id === id ? { ...v, visto: true } : v)
    );
    setNuoviCount((prev) => prev - 1);
  };

  const visitatoriFiltrati = soloNuovi
    ? visitatori.filter((v) => !v.visto)
    : visitatori;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        👁️ Chi ti ha visitato{" "}
        {nuoviCount > 0 && <span style={badgeStyle}>({nuoviCount} nuovi)</span>}
      </h2>

      <label style={filtroStyle}>
        <input
          type="checkbox"
          checked={soloNuovi}
          onChange={() => setSoloNuovi(!soloNuovi)}
        />{" "}
        Mostra solo nuovi visitatori
      </label>

      {loading ? (
        <p style={textStyle}>⏳ Caricamento...</p>
      ) : visitatoriFiltrati.length === 0 ? (
        <p style={textStyle}>Nessuna visita trovata.</p>
      ) : (
        <ul style={listStyle}>
          {visitatoriFiltrati.map((v) => (
            <li
              key={v.id}
              style={{
                ...itemStyle,
                border: v.visto ? "1px solid #333" : "2px solid #3af",
                boxShadow: v.visto ? "none" : "0 0 8px #3af",
              }}
            >
              <img
                src={v.foto_url || "/default-avatar.png"}
                alt="Visitante"
                style={avatarStyle}
              />
              <div>
                <strong>{v.nome || "Anonimo"}</strong>
                <p style={{ fontSize: "0.8rem", color: "#aaa" }}>
                  {new Date(v.ultima_visita).toLocaleString()}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#999" }}>
                  Visite totali: {v.contatore}
                </p>
              </div>
              {!v.visto && (
                <button onClick={() => segnaComeVisto(v.id)} style={btnStyle}>
                  ✅ Visto
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// STILI
const containerStyle = {
  padding: "2rem",
  backgroundColor: "#121212",
  color: "#fff",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
};

const titleStyle = {
  color: "#f08fc0",
  fontSize: "1.7rem",
  marginBottom: "1rem",
};

const badgeStyle = {
  marginLeft: "0.6rem",
  fontSize: "1rem",
  backgroundColor: "#3af",
  color: "#000",
  borderRadius: "12px",
  padding: "0.2rem 0.6rem",
};

const filtroStyle = {
  marginBottom: "1rem",
  fontSize: "0.9rem",
  color: "#ccc",
};

const textStyle = {
  color: "#ccc",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  padding: "1rem",
  backgroundColor: "#1e1e1e",
  borderRadius: "8px",
};

const avatarStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  objectFit: "cover",
};

const btnStyle = {
  marginLeft: "auto",
  backgroundColor: "#f08fc0",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "0.5rem 1rem",
  cursor: "pointer",
};


