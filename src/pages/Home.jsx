import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroAB from "../components/HeroAB";
import { loadCurrentAccountTier } from "../lib/accountTier";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tier, setTier] = useState("free");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        const result = await loadCurrentAccountTier();

        if (!alive) return;

        setIsAuthed(Boolean(result?.isAuthed));
        setUserId(result?.user?.id || null);
        setTier(result?.tier || "free");
      } catch {
        if (!alive) return;

        setIsAuthed(false);
        setUserId(null);
        setTier("free");
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  const homeContent = useMemo(() => {
    if (loading) {
      return {
        title: "LoveMatch360, connessioni con una direzione.",
        description:
          "Stiamo preparando il tuo spazio e verificando lo stato del tuo account.",
        primaryLabel: "Caricamento...",
        secondaryLabel: "Torna più su",
      };
    }

    if (!isAuthed) {
      return {
        title: "Incontri veri, connessioni responsabili, meno rumore.",
        description:
          "LoveMatch360 è pensato per chi vuole profili chiari, scoperta pulita e un flusso semplice: scopri → match → relazione.",
        primaryLabel: "Accedi",
        secondaryLabel: "Scopri Premium",
      };
    }

    if (tier === "admin") {
      return {
        title: "Sistema attivo, visione chiara.",
        description:
          "Il tuo account ha accesso di controllo. Puoi rientrare nel flusso operativo o verificare subito le aree sensibili del progetto.",
        primaryLabel: "Apri Admin",
        secondaryLabel: "Vai al profilo",
      };
    }

    if (tier === "super") {
      return {
        title: "Hai già il massimo accesso disponibile.",
        description:
          "Il tuo profilo è attivo al livello più alto del flusso commerciale. Ora il punto è usare bene scoperta, qualità e continuità.",
        primaryLabel: "Scopri i profili",
        secondaryLabel: "Vai al profilo",
      };
    }

    if (tier === "premium") {
      return {
        title: "Il tuo accesso premium è già vivo.",
        description:
          "Ora conta usarlo bene: più qualità nella scoperta, più ordine nel percorso, meno attrito nel trovare persone compatibili.",
        primaryLabel: "Scopri i profili",
        secondaryLabel: "Vai al profilo",
      };
    }

    return {
      title: "Il tuo profilo è acceso. Adesso dagli direzione.",
      description:
        "Completa il profilo, entra nella scoperta e usa LoveMatch360 con un flusso più pulito, più serio, più intenzionale.",
      primaryLabel: "Scopri i profili",
      secondaryLabel: "Vai a Premium",
    };
  }, [loading, isAuthed, tier]);

  const statusLine = useMemo(() => {
    if (loading) return "Caricamento stato account...";
    if (!isAuthed) return "Non sei loggato.";
    if (tier === "admin") return "Accesso amministrativo attivo.";
    if (tier === "super") return "Accesso Super attivo.";
    if (tier === "premium") return "Accesso Premium attivo.";
    return "Bentornato. Il tuo account è attivo.";
  }, [loading, isAuthed, tier]);

  const handlePrimaryAction = () => {
    if (loading) return;

    if (!isAuthed) {
      navigate("/login");
      return;
    }

    if (tier === "admin") {
      navigate("/admin");
      return;
    }

    navigate("/scopri");
  };

  const handleSecondaryAction = () => {
    if (loading) return;

    if (!isAuthed) {
      navigate("/premium");
      return;
    }

    if (tier === "admin" || tier === "premium" || tier === "super") {
      navigate("/profilo");
      return;
    }

    navigate("/premium");
  };

  return (
    <>
      <HeroAB userId={userId} />

      <section style={sectionStyle}>
        <div style={heroCardStyle}>
          <span style={eyebrowStyle}>LoveMatch360</span>

          <h1 style={titleStyle}>{homeContent.title}</h1>

          <p style={descriptionStyle}>{homeContent.description}</p>

          <div style={actionsStyle}>
            <button type="button" style={primaryButtonStyle} onClick={handlePrimaryAction}>
              {homeContent.primaryLabel}
            </button>

            <button type="button" style={secondaryButtonStyle} onClick={handleSecondaryAction}>
              {homeContent.secondaryLabel}
            </button>
          </div>

          <p style={statusStyle}>{statusLine}</p>
        </div>

        <div style={gridStyle}>
          <article style={infoCardStyle}>
            <h2 style={cardTitleStyle}>Come funziona</h2>
            <p style={cardTextStyle}>
              1) Scopri profili → 2) Metti like → 3) Match reciproco → 4) Chat.
              Premium sblocca funzioni avanzate senza cambiare le regole del rispetto.
            </p>
          </article>

          <article style={infoCardStyle}>
            <h2 style={cardTitleStyle}>Perché qui</h2>
            <p style={cardTextStyle}>
              Meno caos, più chiarezza. LoveMatch360 mette al centro profili vivi,
              connessioni responsabili e un flusso semplice da seguire.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

const sectionStyle = {
  padding: "24px 16px 48px",
};

const heroCardStyle = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "28px 24px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "linear-gradient(180deg, rgba(28,28,34,0.96) 0%, rgba(16,16,22,0.96) 100%)",
  boxShadow: "0 20px 50px rgba(0,0,0,0.24)",
};

const eyebrowStyle = {
  display: "inline-block",
  fontSize: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.62)",
  fontWeight: 800,
};

const titleStyle = {
  margin: "12px 0 0",
  color: "#f08fc0",
  fontSize: "clamp(2rem, 5vw, 3.4rem)",
  lineHeight: 1.04,
};

const descriptionStyle = {
  marginTop: "18px",
  marginBottom: 0,
  color: "rgba(255,255,255,0.88)",
  fontSize: "1.12rem",
  lineHeight: 1.8,
  maxWidth: "65ch",
};

const actionsStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "24px",
};

const primaryButtonStyle = {
  padding: "14px 22px",
  border: "none",
  borderRadius: "14px",
  backgroundColor: "#e48abb",
  color: "#111111",
  fontWeight: 800,
  fontSize: "1rem",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "14px 22px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.05)",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

const statusStyle = {
  marginTop: "16px",
  color: "rgba(255,255,255,0.68)",
  fontSize: "0.95rem",
  lineHeight: 1.6,
};

const gridStyle = {
  maxWidth: "1100px",
  margin: "20px auto 0",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "16px",
};

const infoCardStyle = {
  padding: "20px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.03)",
};

const cardTitleStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "1.15rem",
};

const cardTextStyle = {
  marginTop: "12px",
  marginBottom: 0,
  color: "rgba(255,255,255,0.78)",
  lineHeight: 1.75,
};