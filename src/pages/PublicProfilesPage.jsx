import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function PublicProfilesPage() {
  const [profili, setProfili] = useState([]);
  const [userId, setUserId] = useState(null);
  const [likes, setLikes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filtroCittà, setFiltroCittà] = useState("");
  const [filtroInteresse, setFiltroInteresse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const id = user?.id || null;
      setUserId(id);

      const { data: profiliData } = await supabase
        .from("profili")
        .select("id, nome, eta, bio, foto_url, città, interessi, premium")
        .eq("profilo_pubblico", true)
        .eq("status_account", "attivo")
        .order("nome", { ascending: true });

      if (id) {
        const { data: likeData } = await supabase
          .from("likes")
          .select("profilo_piaciuto")
          .eq("utente_id", id);
        setLikes(likeData.map((l) => l.profilo_piaciuto));

        const { data: matchData } = await supabase
          .from("match_scores")
          .select("matched_user_id")
          .eq("user_id", id)
          .eq("score", 100);
        setMatches(matchData.map((m) => m.matched_user_id));
      }

      if (profiliData) setProfili(profiliData);
      setLoading(false);
    };

    fetchAll();
  }, []);

  const isUserPremium = userId && profili.find(p => p.id === userId)?.premium;

  const registraVisita = async (profiloVisitatoId) => {
    if (!userId || userId === profiloVisitatoId) return;
    await supabase.from("visite").insert([
      { visitatore_id: userId, profilo_visitato: profiloVisitatoId },
    ]);
  };

  const handleLike = async (profiloId) => {
    if (!userId || userId === profiloId) return;
    if (likes.includes(profiloId)) return;

    const { error } = await supabase.from("likes").insert([
      { utente_id: userId, profilo_piaciuto: profiloId },
    ]);

    if (!error) {
      setLikes((prev) => [...prev, profiloId]);

      const { data: likeBack } = await supabase
        .from("likes")
        .select("*")
        .eq("utente_id", profiloId)
        .eq("profilo_piaciuto", userId)
        .maybeSingle();

      if (likeBack && !matches.includes(profiloId)) {
        await supabase.from("match_scores").upsert([
          { user_id: userId, matched_user_id: profiloId, score: 100 },
          { user_id: profiloId, matched_user_id: userId, score: 100 },
        ], { onConflict: ["user_id", "matched_user_id"] });

        const audio = new Audio("/notify.mp3");
        audio.play();
        toast.success("💘 Match reciproco trovato!", { icon: "💌" });

        setMatches((prev) => [...prev, profiloId]);
      }
    }
  };

  const cittàUniche = [...new Set(profili.map((p) => p.città).filter(Boolean))];
  const interessiUnici = [...new Set(profili.flatMap((p) =>
    typeof p.interessi === "string"
      ? p.interessi.split(",").map((i) => i.trim())
      : Array.isArray(p.interessi)
      ? p.interessi
      : []
  ))];

  const profiliFiltrati = profili.filter((p) => {
    const testo = (p.nome + " " + p.bio).toLowerCase();
    const includeTesto = testo.includes(query.trim().toLowerCase());
    const matchCittà = !filtroCittà || p.città === filtroCittà;
    const interessiUtente = typeof p.interessi === "string"
      ? p.interessi.split(",").map((i) => i.trim())
      : Array.isArray(p.interessi)
      ? p.interessi
      : [];
    const matchInteresse = !filtroInteresse || interessiUtente.includes(filtroInteresse);
    return includeTesto && matchCittà && matchInteresse;
  });

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes glow { from { text-shadow: 0 0 5px #f08fc0; } to { text-shadow: 0 0 15px #f08fc0; } }
        @media (max-width: 600px) {
          .responsive-item { flex-direction: column !important; align-items: flex-start !important; }
          .responsive-text { font-size: 1rem !important; }
        }
      `}</style>
      <Toaster position="top-right" />
      <h2 style={titleStyle}>🌐 Profili Pubblici</h2>

      {!isUserPremium && (
        <div style={promoBox}>
          <p>🔒 Attiva l'accesso Premium per usare i filtri avanzati!</p>
          <button style={promoBtn} onClick={() => navigate("/paywall")}>🌟 Passa a Premium</button>
        </div>
      )}

      <input
        type="text"
        placeholder="Cerca nome o bio..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={searchInputStyle}
      />

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <select
          value={filtroCittà}
          onChange={(e) => {
            if (!isUserPremium) return toast("🔐 Solo per utenti premium");
            setFiltroCittà(e.target.value);
          }}
          disabled={!isUserPremium}
          style={{
            ...dropdownStyle,
            opacity: !isUserPremium ? 0.5 : 1,
            cursor: !isUserPremium ? "not-allowed" : "pointer",
          }}
        >
          <option value="">Tutte le città</option>
          {cittàUniche.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filtroInteresse}
          onChange={(e) => {
            if (!isUserPremium) return toast("🔐 Solo per utenti premium");
            setFiltroInteresse(e.target.value);
          }}
          disabled={!isUserPremium}
          style={{
            ...dropdownStyle,
            opacity: !isUserPremium ? 0.5 : 1,
            cursor: !isUserPremium ? "not-allowed" : "pointer",
          }}
        >
          <option value="">Tutti gli interessi</option>
          {interessiUnici.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Caricamento profili...</p>
      ) : profiliFiltrati.length === 0 ? (
        <p>Nessun profilo corrisponde alla ricerca.</p>
      ) : (
        <ul style={listStyle}>
          {profiliFiltrati.map((p, index) => {
            const isMatch = matches.includes(p.id);
            return (
              <motion.li
                key={p.id}
                className="responsive-item"
                style={itemStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <Link to={`/profilo/${p.id}`} style={linkStyle} onClick={() => registraVisita(p.id)}>
                  <img
                    src={p.foto_url || "/default-avatar.png"}
                    alt={`Foto di ${p.nome}`}
                    style={avatarStyle}
                  />
                  <div>
                    <strong className="responsive-text" style={{ fontSize: "1.2rem" }}>
                      {p.nome}, {p.eta} {p.premium && <span style={badgePremium}>🌟 Premium</span>} {isMatch && <span style={{ animation: "glow 1s infinite alternate" }}>💘</span>}
                    </strong>
                    <p className="responsive-text">{p.bio?.slice(0, 80)}{p.bio?.length > 80 ? "..." : ""}</p>
                    <small>📍 {p.città} · 💡 {Array.isArray(p.interessi) ? p.interessi.join(", ") : p.interessi}</small>
                  </div>
                </Link>

                {userId && userId !== p.id && (
                  <>
                    <button
                      onClick={() => handleLike(p.id)}
                      disabled={likes.includes(p.id)}
                      style={{
                        marginTop: "0.5rem",
                        backgroundColor: likes.includes(p.id) ? "#555" : "#f08fc0",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.6rem 1.4rem",
                        cursor: likes.includes(p.id) ? "not-allowed" : "pointer",
                        marginRight: "0.5rem",
                        fontWeight: "bold",
                        fontSize: "1rem"
                      }}
                    >
                      💗 {likes.includes(p.id) ? "Già messo" : "Mi Piace"}
                    </button>

                    {isMatch && (
                      <Link
                        to={`/chat/${p.id}`}
                        style={{
                          backgroundColor: "#1e88e5",
                          color: "#fff",
                          padding: "0.6rem 1.4rem",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontWeight: "bold",
                          fontSize: "1rem"
                        }}
                      >
                        💬 Chatta ora
                      </Link>
                    )}
                  </>
                )}
              </motion.li>
            );
          })}
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

const searchInputStyle = {
  padding: "0.6rem",
  marginBottom: "1rem",
  fontSize: "1rem",
  width: "100%",
  maxWidth: "400px",
  borderRadius: "8px",
  border: "1px solid #f08fc0",
  backgroundColor: "#1e1e1e",
  color: "#fff",
};

const dropdownStyle = {
  padding: "0.5rem",
  borderRadius: "8px",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  border: "1px solid #f08fc0",
  fontSize: "1rem",
};

const promoBox = {
  backgroundColor: "#1a1a1a",
  padding: "1rem",
  borderRadius: "8px",
  border: "1px dashed #f08fc0",
  marginBottom: "1rem",
  textAlign: "center",
};

const promoBtn = {
  marginTop: "0.5rem",
  padding: "0.5rem 1.2rem",
  backgroundColor: "#f08fc0",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  color: "#000",
  cursor: "pointer"
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
  color: "#f08fc0",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  flexGrow: 1,
};

const badgePremium = {
  backgroundColor: "#ffd700",
  color: "#000",
  borderRadius: "6px",
  padding: "2px 6px",
  fontSize: "0.75rem",
  marginLeft: "0.5rem",
  fontWeight: "bold"
};

