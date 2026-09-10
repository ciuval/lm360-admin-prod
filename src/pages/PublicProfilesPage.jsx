import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { track } from "../lib/analytics.js";
import { getActivationJourneyProps } from "../lib/activationJourney.js";
import { calculateProfileCompletion } from "../lib/profileCompletion.js";

function normalizeRole(value) {
  return String(value || "").trim().toLowerCase();
}

function isFutureDate(value) {
  if (!value) return false;
  const time = new Date(value).getTime();
  return Number.isFinite(time) && time > Date.now();
}

function hasPremiumAccess(profile) {
  const role = normalizeRole(profile?.ruolo);

  return (
    Boolean(profile?.premium) ||
    role === "premium" ||
    role === "super" ||
    isFutureDate(profile?.premium_fine)
  );
}

function toInterestArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export default function PublicProfilesPage() {
  const [profili, setProfili] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [likes, setLikes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [likingIds, setLikingIds] = useState(() => new Set());
  const likingIdsRef = useRef(new Set());
  const [hasExistingLikes, setHasExistingLikes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filtroInteresse, setFiltroInteresse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    async function fetchAll() {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const currentUserId = user?.id || null;
        if (!alive) return;

        setUserId(currentUserId);

        if (currentUserId) {
          const { data: myProfileData } = await supabase
            .from("profili")
            .select("id, nome, ruolo, premium, premium_fine, status_account")
            .eq("id", currentUserId)
            .maybeSingle();

          if (!alive) return;
          setMyProfile(myProfileData || null);

          const { data: likeData, error: likeError } = await supabase
            .from("likes")
            .select("user_to")
            .eq("user_from", currentUserId);

          if (!alive) return;
          if (likeError) {
            setHasExistingLikes(null);
            track("discovery_load_failed", {
              ...getActivationJourneyProps(),
              stage: "likes",
            }).catch(() => {});
          } else {
            setLikes((likeData || []).map((row) => row.user_to));
            setHasExistingLikes((likeData || []).length > 0);
          }

          const { data: matchData } = await supabase
            .from("match_scores")
            .select("user_a, user_b, score")
            .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
            .eq("score", 100);

          if (!alive) return;

          const matchedIds = (matchData || []).map((row) =>
            row.user_a === currentUserId ? row.user_b : row.user_a
          );

          setMatches(matchedIds);
        }

        const { data: profiliData, error: profiliError } = await supabase
          .from("profili")
          .select("id, nome, bio, foto_url, avatar_url, interessi, premium, premium_fine, ruolo, status_account")
          .eq("status_account", "attivo")
          .order("nome", { ascending: true });

        if (!alive) return;

        if (profiliError) {
          track("discovery_load_failed", {
            ...getActivationJourneyProps(),
            stage: "profiles",
          }).catch(() => {});
          toast.error("Errore nel caricamento dei profili.");
          setProfili([]);
          return;
        }

        const otherProfiles = (profiliData || []).filter(
          (profilo) => profilo.id !== currentUserId
        );
        const pubblici = otherProfiles.filter((profilo) =>
          calculateProfileCompletion({ profile: profilo }).isComplete
        );
        setProfili(pubblici);
        track("discovery_opened", {
          ...getActivationJourneyProps(),
          results: pubblici.length,
          excluded_results: otherProfiles.length - pubblici.length,
        }).catch(() => {});
      } catch {
        if (!alive) return;
        track("discovery_load_failed", {
          ...getActivationJourneyProps(),
          stage: "unexpected",
        }).catch(() => {});
        toast.error("Errore temporaneo nella sezione scopri.");
        setProfili([]);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    fetchAll();

    return () => {
      alive = false;
    };
  }, []);

  const isUserPremium = useMemo(() => {
    return hasPremiumAccess(myProfile);
  }, [myProfile]);

  const handleLike = async (profiloId) => {
    if (!userId || userId === profiloId) return;
    if (likes.includes(profiloId)) return;
    if (likingIdsRef.current.has(profiloId)) return;

    likingIdsRef.current.add(profiloId);
    setLikingIds((current) => new Set(current).add(profiloId));
    const isFirstLike = hasExistingLikes === false;

    try {
      const { error } = await supabase.from("likes").insert([
        {
          user_from: userId,
          user_to: profiloId,
        },
      ]);

      if (error) {
        track("like_failed", getActivationJourneyProps()).catch(() => {});
        toast.error("Impossibile salvare il like.");
        return;
      }

      setLikes((prev) => [...prev, profiloId]);
      setHasExistingLikes(true);
      track("like_sent", getActivationJourneyProps()).catch(() => {});

      if (isFirstLike) {
        track("first_like_sent", getActivationJourneyProps()).catch(() => {});
      }

      const { data: likeBack, error: likeBackError } = await supabase
        .from("likes")
        .select("user_from, user_to")
        .eq("user_from", profiloId)
        .eq("user_to", userId)
        .maybeSingle();

      if (likeBackError) {
        track("match_check_failed", getActivationJourneyProps()).catch(() => {});
        return;
      }

      if (!likeBack || matches.includes(profiloId)) return;

      const pair = [userId, profiloId].sort();

      const { error: matchError } = await supabase.from("match_scores").upsert(
        [
          {
            user_a: pair[0],
            user_b: pair[1],
            score: 100,
            matched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        { onConflict: "user_a,user_b" }
      );

      if (matchError) {
        track("match_create_failed", getActivationJourneyProps()).catch(() => {});
        toast.error("Like salvato, ma il match non è stato registrato.");
        return;
      }

      track("match_created", getActivationJourneyProps()).catch(() => {});
      toast.success("💘 Match reciproco trovato!");
      setMatches((prev) => [...prev, profiloId]);
    } catch {
      track("like_failed", {
        ...getActivationJourneyProps(),
        stage: "unexpected",
      }).catch(() => {});
      toast.error("Impossibile salvare il like.");
    } finally {
      likingIdsRef.current.delete(profiloId);
      setLikingIds((current) => {
        const next = new Set(current);
        next.delete(profiloId);
        return next;
      });
    }
  };

  const interessiUnici = useMemo(() => {
    return [...new Set(profili.flatMap((profilo) => toInterestArray(profilo.interessi)))];
  }, [profili]);

  const profiliFiltrati = useMemo(() => {
    return profili.filter((profilo) => {
      const testo = `${profilo.nome || ""} ${profilo.bio || ""}`.toLowerCase();
      const includeTesto = testo.includes(query.trim().toLowerCase());

      const interessiProfilo = toInterestArray(profilo.interessi);
      const matchInteresse =
        !filtroInteresse || interessiProfilo.includes(filtroInteresse);

      return includeTesto && matchInteresse;
    });
  }, [profili, query, filtroInteresse]);

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes glow {
          from { text-shadow: 0 0 5px #f08fc0; }
          to { text-shadow: 0 0 15px #f08fc0; }
        }

        @media (max-width: 600px) {
          .responsive-item {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .responsive-text {
            font-size: 1rem !important;
          }
        }
      `}</style>

      <Toaster position="top-right" />
      <h2 style={titleStyle}>Scopri persone</h2>
      <p style={{ margin: "-0.45rem 0 1.25rem", color: "#d8d8e2", lineHeight: 1.6 }}>
        Guarda un profilo, leggi ciò che racconta e scegli con intenzione.
      </p>

      {!isUserPremium && (
        <div style={promoBox}>
          <p>🔒 Attiva l'accesso Premium per usare i filtri avanzati.</p>
          <button style={promoBtn} onClick={() => navigate("/premium")}>
            🌟 Passa a Premium
          </button>
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
          value={filtroInteresse}
          onChange={(e) => {
            if (!isUserPremium) {
              toast("🔐 Solo per utenti premium");
              return;
            }
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
          {interessiUnici.map((interesse) => (
            <option key={interesse} value={interesse}>
              {interesse}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Caricamento profili...</p>
      ) : profiliFiltrati.length === 0 ? (
        <section
            aria-label="Nessun profilo da scoprire"
            style={{
              marginTop: 18,
              padding: "1.15rem",
              borderRadius: 22,
              border: "1px solid rgba(240, 143, 192, 0.24)",
              background:
                "linear-gradient(135deg, rgba(240, 143, 192, 0.10), rgba(255, 255, 255, 0.04))",
              lineHeight: 1.7,
            }}
          >
            <p style={{ margin: "0 0 0.5rem", fontWeight: 800 }}>
              Scopri è pronto: al momento non ci sono profili reali da mostrare.
            </p>
            <p style={{ margin: 0, opacity: 0.82 }}>
              Non è un errore. Completa il tuo profilo e torna qui: quando saranno disponibili
              altre persone, capiranno subito meglio chi sei.
            </p>
            <a
              href="#/profilo"
              style={{
                display: "inline-block",
                marginTop: 12,
                color: "#ffd7ea",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Completa il profilo
            </a>
          </section>
      ) : (
        <ul style={listStyle}>
          {profiliFiltrati.map((profilo, index) => {
            const isMatch = matches.includes(profilo.id);
            const interessiProfilo = toInterestArray(profilo.interessi);
            const premiumLabel = hasPremiumAccess(profilo);

            return (
              <motion.li
                key={profilo.id}
                className="responsive-item"
                style={itemStyle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <Link to={`/profilo/${profilo.id}`} style={linkStyle}>
                  <img
                    src={profilo.foto_url || profilo.avatar_url || "/default-avatar.png"}
                    alt={`Foto di ${profilo.nome}`}
                    style={avatarStyle}
                  />
                  <div>
                    <strong className="responsive-text" style={{ fontSize: "1.2rem" }}>
                      {profilo.nome || "Profilo"}
                      {premiumLabel && <span style={badgePremium}>🌟 Premium</span>}
                      {isMatch && (
                        <span style={{ animation: "glow 1s infinite alternate", marginLeft: "0.5rem" }}>
                          💘
                        </span>
                      )}
                    </strong>

                    <p className="responsive-text">
                      {profilo.bio?.slice(0, 80)}
                      {profilo.bio?.length > 80 ? "..." : ""}
                    </p>

                    <small>
                      💡 {interessiProfilo.length ? interessiProfilo.join(", ") : "Interessi non disponibili"}
                    </small>
                  </div>
                </Link>

                {userId && userId !== profilo.id && (
                  <button
                    onClick={() => handleLike(profilo.id)}
                    disabled={likes.includes(profilo.id) || likingIds.has(profilo.id)}
                    style={{
                      marginTop: "0.5rem",
                      backgroundColor: likes.includes(profilo.id) || likingIds.has(profilo.id) ? "#555" : "#f08fc0",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.6rem 1.4rem",
                      cursor: likes.includes(profilo.id) || likingIds.has(profilo.id) ? "not-allowed" : "pointer",
                      marginRight: "0.5rem",
                      fontWeight: "bold",
                      fontSize: "1rem",
                    }}
                  >
                    💗 {likes.includes(profilo.id) ? "Like inviato" : likingIds.has(profilo.id) ? "Invio…" : "Mi piace"}
                  </button>
                )}
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

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
  cursor: "pointer",
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
  fontWeight: "bold",
};
