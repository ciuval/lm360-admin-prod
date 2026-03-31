import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCurrentAccountTier } from "../lib/accountTier";

export default function PremiumPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState("free");
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        const result = await loadCurrentAccountTier();

        if (!alive) return;

        setTier(result?.tier || "free");
        setIsAuthed(Boolean(result?.isAuthed));
      } catch {
        if (!alive) return;
        setTier("free");
        setIsAuthed(false);
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  const hasPremiumAccess = useMemo(() => {
    return tier === "premium" || tier === "super" || tier === "admin";
  }, [tier]);

  const title = useMemo(() => {
    if (tier === "admin") return "Controllo admin attivo";
    if (tier === "super") return "Piano Super attivo";
    if (tier === "premium") return "Piano Premium attivo";
    return "Premium quando serve davvero.";
  }, [tier]);

  const description = useMemo(() => {
    if (tier === "admin") {
      return "Il tuo account ha privilegi amministrativi. Le funzioni premium commerciali non sono necessarie per accedere ai controlli di gestione.";
    }

    if (tier === "super") {
      return "Hai già accesso al livello più alto disponibile nel flusso commerciale attuale.";
    }

    if (tier === "premium") {
      return "Il tuo accesso premium è già attivo. Puoi continuare a usare le funzioni sbloccate senza effettuare una nuova attivazione.";
    }

    return "Filtri pro, boost visibilità e accesso esteso alle funzioni premium di LoveMatch360.";
  }, [tier]);

  const ctaLabel = useMemo(() => {
    if (!isAuthed) return "Accedi per continuare";
    if (hasPremiumAccess) return "Vai al profilo";
    return "Attiva Premium";
  }, [isAuthed, hasPremiumAccess]);

  const handlePrimaryAction = () => {
    if (!isAuthed) {
      navigate("/login");
      return;
    }

    if (hasPremiumAccess) {
      navigate("/profilo");
      return;
    }

    navigate("/attiva-premium");
  };

  if (loading) {
    return (
      <section style={sectionStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Premium</h1>
          <p style={textStyle}>Caricamento stato account...</p>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>{title}</h1>
        <p style={textStyle}>{description}</p>

        <button type="button" style={buttonStyle} onClick={handlePrimaryAction}>
          {ctaLabel}
        </button>

        {!isAuthed && (
          <p style={noteStyle}>
            Per attivare o gestire il piano è necessario accedere con un account valido.
          </p>
        )}

        {isAuthed && hasPremiumAccess && (
          <p style={noteStyle}>
            Il tuo account risulta già abilitato. Da qui non è necessaria alcuna nuova attivazione.
          </p>
        )}
      </div>
    </section>
  );
}

const sectionStyle = {
  minHeight: "60vh",
  display: "grid",
  placeItems: "center",
  padding: "24px 16px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "760px",
  padding: "32px 24px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(28,28,34,0.96) 0%, rgba(16,16,22,0.96) 100%)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
  textAlign: "center",
};

const titleStyle = {
  margin: 0,
  fontSize: "clamp(2rem, 4vw, 3rem)",
  lineHeight: 1.05,
  color: "#ffffff",
};

const textStyle = {
  marginTop: "16px",
  marginBottom: 0,
  fontSize: "1.15rem",
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.88)",
};

const buttonStyle = {
  marginTop: "28px",
  padding: "14px 24px",
  minWidth: "220px",
  border: "none",
  borderRadius: "14px",
  backgroundColor: "#e48abb",
  color: "#111111",
  fontSize: "1rem",
  fontWeight: 800,
  cursor: "pointer",
};

const noteStyle = {
  marginTop: "18px",
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.68)",
};