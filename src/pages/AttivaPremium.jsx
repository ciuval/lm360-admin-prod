import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCurrentAccountTier } from "../lib/accountTier";

export default function AttivaPremium() {
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

  const content = useMemo(() => {
    if (!isAuthed) {
      return {
        badge: "Accesso ospite",
        title: "Attiva Premium",
        description:
          "Per entrare nel flusso premium devi prima accedere con un account valido.",
        primaryLabel: "Vai al login",
        secondaryLabel: "Torna a Premium",
        note: "Nessuna attivazione parte senza autenticazione.",
      };
    }

    if (tier === "admin") {
      return {
        badge: "Admin",
        title: "Controllo admin già attivo",
        description:
          "Il tuo account ha già privilegi amministrativi. Non serve alcuna attivazione premium commerciale.",
        primaryLabel: "Vai al profilo",
        secondaryLabel: "Apri Admin",
        note: "Questo account non usa il flusso commerciale premium.",
      };
    }

    if (tier === "super") {
      return {
        badge: "Super attivo",
        title: "Hai già il livello più alto.",
        description:
          "Il tuo account ha già accesso al livello Super. Nessuna nuova attivazione è necessaria.",
        primaryLabel: "Vai al profilo",
        secondaryLabel: "Apri Quantum",
        note: "Nessun checkout viene avviato per un account già abilitato.",
      };
    }

    if (tier === "premium") {
      return {
        badge: "Premium attivo",
        title: "Il tuo Premium è già acceso.",
        description:
          "Il tuo account premium è già attivo. Non devi attivare di nuovo nulla da questa pagina.",
        primaryLabel: "Vai al profilo",
        secondaryLabel: "Apri Billing",
        note: "Il checkout non parte se il piano è già attivo.",
      };
    }

    return {
      badge: "Free",
      title: "Attiva il tuo Premium",
      description:
        "Da qui entri nel checkout vero. Nessuna scrittura manuale in tabella: il flusso corretto passa da Stripe.",
      primaryLabel: "Procedi al checkout",
      secondaryLabel: "Torna a Premium",
      note: "Il passaggio successivo apre il checkout del piano configurato.",
    };
  }, [isAuthed, tier]);

  const handlePrimaryAction = () => {
    if (!isAuthed) {
      navigate("/login");
      return;
    }

    if (tier === "admin" || tier === "premium" || tier === "super") {
      navigate("/profilo");
      return;
    }

    navigate("/checkout");
  };

  const handleSecondaryAction = () => {
    if (!isAuthed) {
      navigate("/premium");
      return;
    }

    if (tier === "admin") {
      navigate("/admin");
      return;
    }

    if (tier === "super") {
      navigate("/quantum");
      return;
    }

    if (tier === "premium") {
      navigate("/billing");
      return;
    }

    navigate("/premium");
  };

  if (loading) {
    return (
      <section style={sectionStyle}>
        <div style={cardStyle}>
          <span style={badgeStyle("neutral")}>Premium</span>
          <h1 style={titleStyle}>Verifica stato account...</h1>
          <p style={textStyle}>
            Stiamo controllando il tuo accesso per mostrarti il percorso giusto.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle}>
      <div style={cardStyle}>
        <span
          style={badgeStyle(
            tier === "admin"
              ? "admin"
              : tier === "super"
                ? "super"
                : tier === "premium"
                  ? "premium"
                  : "neutral"
          )}
        >
          {content.badge}
        </span>

        <h1 style={titleStyle}>{content.title}</h1>
        <p style={textStyle}>{content.description}</p>

        <div style={actionsRowStyle}>
          <button type="button" style={primaryButtonStyle} onClick={handlePrimaryAction}>
            {content.primaryLabel}
          </button>

          <button type="button" style={secondaryButtonStyle} onClick={handleSecondaryAction}>
            {content.secondaryLabel}
          </button>
        </div>

        <p style={noteStyle}>{content.note}</p>
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
  maxWidth: "820px",
  padding: "36px 24px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background:
    "linear-gradient(180deg, rgba(28,28,34,0.96) 0%, rgba(16,16,22,0.96) 100%)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
  textAlign: "center",
};

const titleStyle = {
  margin: "16px 0 0",
  fontSize: "clamp(2rem, 4vw, 3.2rem)",
  lineHeight: 1.05,
  color: "#ffffff",
};

const textStyle = {
  marginTop: "18px",
  marginBottom: 0,
  fontSize: "1.12rem",
  lineHeight: 1.8,
  color: "rgba(255,255,255,0.88)",
  maxWidth: "62ch",
  marginInline: "auto",
};

const actionsRowStyle = {
  marginTop: "30px",
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  flexWrap: "wrap",
};

const primaryButtonStyle = {
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

const secondaryButtonStyle = {
  padding: "14px 24px",
  minWidth: "220px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.05)",
  color: "#ffffff",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
};

const noteStyle = {
  marginTop: "18px",
  fontSize: "0.95rem",
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.68)",
};

function badgeStyle(tone) {
  const tones = {
    premium: {
      background: "rgba(240,143,192,0.16)",
      border: "1px solid rgba(240,143,192,0.26)",
      color: "#ffd9e8",
    },
    super: {
      background: "rgba(125,211,252,0.16)",
      border: "1px solid rgba(125,211,252,0.28)",
      color: "#d8f1ff",
    },
    admin: {
      background: "rgba(250,204,21,0.16)",
      border: "1px solid rgba(250,204,21,0.28)",
      color: "#ffe79a",
    },
    neutral: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      color: "#f3f4f6",
    },
  };

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 36,
    padding: "0 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.01em",
    ...(tones[tone] || tones.neutral),
  };
}