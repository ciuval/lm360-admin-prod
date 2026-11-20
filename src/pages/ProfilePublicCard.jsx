import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { normalizePublicProfileProjection } from "../lib/publicProfiles.js";

export default function ProfilePublicCard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profilo, setProfilo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    let alive = true;

    async function fetchData() {
      setLoading(true);
      setLoadError(false);
      setProfilo(null);
      setIsMatch(false);

      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!alive) return;

        if (authError || !user?.id) {
          setLoadError(true);
          return;
        }

        setUserId(user.id);

        if (user.id === id) {
          navigate("/profilo", { replace: true });
          return;
        }

        // Una sola API di lettura minimizzata. Mai leggere profili o foto altrui
        // dalle tabelle private, anche quando la RPC non è disponibile.
        const { data, error } = await supabase.rpc(
          "lm360_get_public_profiles",
          { p_profile_id: id }
        );
        if (!alive) return;

        if (error || !Array.isArray(data)) {
          setLoadError(true);
          return;
        }

        const visible = normalizePublicProfileProjection(data, user.id);
        const selected = visible.find((row) => row.id === id) || null;
        setProfilo(selected);

        if (!selected) return;

        const pair = [user.id, id].sort();
        const { data: matchRow, error: matchError } = await supabase
          .from("match_scores")
          .select("user_a, user_b, score")
          .eq("user_a", pair[0])
          .eq("user_b", pair[1])
          .eq("score", 100)
          .maybeSingle();

        if (!alive) return;
        setIsMatch(!matchError && Boolean(matchRow));
      } catch {
        if (alive) setLoadError(true);
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (id) fetchData();
    else {
      setLoading(false);
      setLoadError(true);
    }

    return () => {
      alive = false;
    };
  }, [id, navigate]);

  if (loading) return <p style={textStyle}>Caricamento...</p>;
  if (loadError) return <p role="alert" style={textStyle}>Profilo non disponibile in questo momento.</p>;
  if (!profilo) return <p style={textStyle}>Profilo non disponibile o non autorizzato alla visibilità.</p>;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        Profilo pubblico
        {isMatch && <span style={badgeStyle}>💘 Match!</span>}
      </h2>

      {profilo.foto_url && (
        <img
          src={profilo.foto_url}
          alt={`Foto di ${profilo.nome || "questo profilo"}`}
          style={{ width: "150px", borderRadius: "8px", marginBottom: "1rem" }}
        />
      )}

      <p><strong>Nome:</strong> {profilo.nome || "N/D"}</p>
      <p><strong>Bio:</strong> {profilo.bio || "Nessuna bio"}</p>
      <p><strong>Interessi:</strong> {profilo.interessi || "Nessuno"}</p>

      {userId && userId !== id && !isMatch && (
        <button onClick={() => navigate(`/stanza/${id}`)} style={roomBtnStyle}>
          Confronta le nostre Stanze
        </button>
      )}

      {isMatch && (
        <button onClick={() => navigate(`/stanza/${id}`)} style={chatBtnStyle}>
          Apri Stanza 360
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

const roomBtnStyle = {
  ...chatBtnStyle,
  display: "block",
  background: "linear-gradient(135deg, #ffd6ea, #f08fc0)",
  color: "#170c13",
};
