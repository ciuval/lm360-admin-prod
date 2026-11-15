import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { loadVisibleMatchedProfiles } from "../lib/matchProfiles.js";

export default function MatchDashboard() {
  const [matchList, setMatchList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [hasReciprocalMatch, setHasReciprocalMatch] = useState(false);

  useEffect(() => {
    let alive = true;

    async function fetchMatches() {
      setLoading(true);
      setLoadError(false);

      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        const result = await loadVisibleMatchedProfiles(supabase, data?.session?.user?.id);

        if (!alive) return;
        setMatchList(result.profiles.map((profilo) => ({ profilo })));
        setHasReciprocalMatch(result.hasReciprocalMatch);
      } catch {
        if (!alive) return;
        setMatchList([]);
        setLoadError(true);
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchMatches();
    return () => { alive = false; };
  }, []);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>💘 Match Trovati</h2>

      {loading ? (
        <p role="status">⏳ Caricamento...</p>
      ) : loadError ? (
        <p role="alert" style={{ color: "#ffd6ea" }}>
          Non riusciamo a mostrare i match in questo momento. Riprova più tardi.
        </p>
      ) : matchList.length === 0 ? (
        <section
        aria-label="Nessun match ancora"
        style={{
          maxWidth: 760,
          marginTop: 18,
          padding: "1.15rem",
          borderRadius: 22,
          border: "1px solid rgba(240, 143, 192, 0.28)",
          background:
            "linear-gradient(135deg, rgba(240, 143, 192, 0.12), rgba(255, 255, 255, 0.04))",
          lineHeight: 1.7,
        }}
      >
        <p style={{ margin: "0 0 0.5rem", fontWeight: 800 }}>
          {hasReciprocalMatch ? "Nessun match visibile in questo momento." : "Nessun match ancora, percorso pronto."}
        </p>
        <p style={{ margin: 0, opacity: 0.82 }}>
          {hasReciprocalMatch
            ? "Hai un match reciproco, ma il profilo dell'altra persona non è attualmente disponibile nella scoperta autorizzata. Rispettiamo la sua scelta di visibilità."
            : "I match compariranno qui solo quando ci sarà interesse reciproco. Completa il profilo, torna su Scopri e lascia like solo ai profili che senti davvero vicini."}
        </p>
        <a
          href="#/scopri-profili"
          style={{
            display: "inline-block",
            marginTop: 12,
            color: "#ffd7ea",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Vai a Scopri
        </a>
      </section>
      ) : (
        <ul style={listStyle}>
          {matchList.map(({ profilo }) => (
            <li key={profilo.id} style={itemStyle}>
              <Link to={`/profilo/${profilo.id}`} style={linkStyle}>
                <img
                  src={profilo.foto_url || "/default-avatar.png"}
                  alt={profilo.nome}
                  style={avatarStyle}
                />
                <div>
                  <strong>{profilo.nome || "Profilo"}</strong>
                  <p>{profilo.bio?.slice(0, 80)}{profilo.bio?.length > 80 ? "..." : ""}</p>
                  <p style={{ fontSize: "0.9rem", color: "#aaa" }}>🎯 {profilo.interessi}</p>
                  <span style={{ color: "#f08fc0" }}>💘 Interesse reciproco</span>
                </div>
              </Link>

              <Link to={`/stanza/${profilo.id}`} style={chatBtn}>
                Apri Stanza 360
              </Link>
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

const listStyle = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
};

const itemStyle = {
  backgroundColor: "#1e1e1e",
  borderRadius: "8px",
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",
  boxShadow: "0 0 8px #f08fc0",
};

const avatarStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  objectFit: "cover",
};

const linkStyle = {
  textDecoration: "none",
  color: "#f08fc0",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flexGrow: 1,
};

const chatBtn = {
  padding: "0.5rem 1rem",
  backgroundColor: "#f08fc0",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  textDecoration: "none",
};
