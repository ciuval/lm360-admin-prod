import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProfilePublicCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profilo, setProfilo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMatch, setIsMatch] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: session } = await supabase.auth.getSession();
      const myId = session?.session?.user?.id;
      setUserId(myId);

      const { data, error } = await supabase
        .from("profili")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setProfilo(data);

      if (myId && id) {
        const pair = [myId, id].sort();

      const { data: matchRow } = await supabase
        .from("match_scores")
        .select("user_a, user_b, score")
        .eq("user_a", pair[0])
        .eq("user_b", pair[1])
        .eq("score", 100)
        .maybeSingle();

      setIsMatch(Boolean(matchRow));
      }

      setLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  const vaiAllaChat = () => {
    navigate(`/chat/${id}`);
  };

  if (loading) return <p style={textStyle}>⏳ Caricamento...</p>;
  if (!profilo) return <p style={textStyle}>❌ Profilo non trovato.</p>;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        👤 Profilo Pubblico
        {isMatch && <span style={badgeStyle}>💘 Match!</span>}
      </h2>

      {profilo.foto_url && (
        <img
          src={profilo.foto_url}
          alt="Avatar"
          style={{ width: "150px", borderRadius: "8px", marginBottom: "1rem" }}
        />
      )}

      <p><strong>Nome:</strong> {profilo.nome || "N/D"}</p>
      <p><strong>Bio:</strong> {profilo.bio || "Nessuna bio"}</p>
      <p><strong>Interessi:</strong> {profilo.interessi || "Nessuno"}</p>
      <p><strong>Ruolo:</strong> {profilo.ruolo || "utente"}</p>

      {isMatch && (
        <button onClick={vaiAllaChat} style={chatBtnStyle}>
          💬 Chatta ora
        </button>
      )}
    </div>
  );
}

// STILI

const containerStyle = {
  padding: "2rem",
  backgroundColor: "#121212",
  color: "white",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
};

const titleStyle = {
  color: "#f08fc0",
  textShadow: "0 0 10px #f08fc0",
  marginBottom: "1.5rem",
};

const textStyle = {
  padding: "2rem",
  fontFamily: "'Segoe UI', sans-serif",
  color: "#ccc",
};

const badgeStyle = {
  marginLeft: "0.5rem",
  backgroundColor: "#f08fc0",
  color: "white",
  padding: "0.3rem 0.6rem",
  borderRadius: "6px",
  fontSize: "0.9rem",
  boxShadow: "0 0 10px #f08fc0",
  animation: "pulse 1s infinite alternate",
};

const chatBtnStyle = {
  marginTop: "1.5rem",
  backgroundColor: "#f08fc0",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.6rem 1.2rem",
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 0 10px #f08fc0",
};

