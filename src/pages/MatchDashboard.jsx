import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function MatchDashboard() {
  const [matchList, setMatchList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setMatchList([]);
        setLoading(false);
        return;
      }

      const id = session.user.id;
      setUserId(id);

      if (!id) {
        console.warn("❌ Nessun utente loggato");
        setLoading(false);
        return;
      }

      const { data: matches, error: matchErr } = await supabase
        .from("match_scores")
        .select("user_a, user_b, score")
        .or(`user_a.eq.${id},user_b.eq.${id}`)
        .eq("score", 100)
        .order("score", { ascending: false });

      if (matchErr) {
        console.error("Errore caricamento match:", matchErr);
        setLoading(false);
        return;
      }

      if (!matches || matches.length === 0) {
        setMatchList([]);
        setLoading(false);
        return;
      }

      const ids = [...new Set(matches.map((m) => (m.user_a === id ? m.user_b : m.user_a)).filter(Boolean))];

      const { data: profili, error: profiliErr } = await supabase
        .from("profili")
        .select("id, nome, eta, bio, interessi, foto_url")
        .in("id", ids);

      if (profiliErr) {
        console.error("Errore caricamento profili:", profiliErr);
        setLoading(false);
        return;
      }

      const uniti = matches
        .map((m) => {
          const otherId = m.user_a === id ? m.user_b : m.user_a;
          return {
            score: m.score,
            profilo: profili.find((p) => p.id === otherId),
          };
        })
        .filter((m) => m.profilo);

      setMatchList(uniti);
      setLoading(false);
    };

    fetchMatches();
  }, []);

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>💘 Match Trovati</h2>

      {loading ? (
        <p>⏳ Caricamento...</p>
      ) : matchList.length === 0 ? (
        <p>Nessun match trovato. Inizia a lasciare qualche 💗!</p>
      ) : (
        <ul style={listStyle}>
          {matchList.map(({ score, profilo }) => (
            <li key={profilo.id} style={itemStyle}>
              <Link to={`/profilo/${profilo.id}`} style={linkStyle}>
                <img
                  src={profilo.foto_url || "/default-avatar.png"}
                  alt={profilo.nome}
                  style={avatarStyle}
                />
                <div>
                  <strong>{profilo.nome}, {profilo.eta}</strong>
                  <p>{profilo.bio?.slice(0, 80)}{profilo.bio?.length > 80 ? "..." : ""}</p>
                  <p style={{ fontSize: "0.9rem", color: "#aaa" }}>🎯 {profilo.interessi}</p>
                  <span style={{ color: "#f08fc0" }}>💘 Match Score: {score}%</span>
                </div>
              </Link>

              <Link to={`/chat/${profilo.id}`} style={chatBtn}>
                💬 Chatta
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


