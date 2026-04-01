import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCurrentAccountTier } from "../lib/accountTier";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [tier, setTier] = useState("free");

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);
        const result = await loadCurrentAccountTier();

        if (!alive) return;

        setIsAuthed(Boolean(result?.isAuthed));
        setTier(result?.tier || "free");
      } catch {
        if (!alive) return;
        setIsAuthed(false);
        setTier("free");
      } finally {
        if (alive) setLoading(false);
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return {
        title: "LoveMatch360",
        description: "Stiamo preparando il tuo spazio.",
        primaryLabel: "Attendi",
        secondaryLabel: "Home",
      };
    }

    if (!isAuthed) {
      return {
        title: "Connessioni vere. Meno rumore. Più direzione.",
        description:
          "LoveMatch360 ti aiuta a scoprire profili, creare match e costruire relazioni con un flusso più pulito e più serio.",
        primaryLabel: "Accedi",
        secondaryLabel: "Scopri Premium",
      };
    }

    if (tier === "admin") {
      return {
        title: "Controllo attivo. Visione chiara.",
        description:
          "Il tuo account ha accesso amministrativo. Puoi entrare subito nelle aree operative o tornare al profilo.",
        primaryLabel: "Apri Admin",
        secondaryLabel: "Vai al profilo",
      };
    }

    if (tier === "super") {
      return {
        title: "Hai già l’accesso più alto disponibile.",
        description:
          "Ora il punto è usare bene scoperta, profilo e continuità. Nessun upsell inutile.",
        primaryLabel: "Scopri i profili",
        secondaryLabel: "Vai al profilo",
      };
    }

    if (tier === "premium") {
      return {
        title: "Il tuo Premium è già attivo.",
        description:
          "Usa il livello sbloccato per entrare più in profondità nella scoperta e nel matching.",
        primaryLabel: "Scopri i profili",
        secondaryLabel: "Vai al profilo",
      };
    }

    return {
      title: "Il tuo profilo è acceso. Ora dagli direzione.",
      description:
        "Completa il profilo, entra nella scoperta e usa LoveMatch360 in modo più intenzionale.",
      primaryLabel: "Scopri i profili",
      secondaryLabel: "Vai a Premium",
    };
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
    <section style={sectionStyle}>
      <div style={heroCardStyle}>
        <span style={eyebrowStyle}>LoveMatch360</span>
        <h1 style={titleStyle}>{content.title}</h1>
        <p style={descriptionStyle}>{content.description}</p>

        <div style={actionsStyle}>
          <button type="button" style={primaryButtonStyle} onClick={handlePrimaryAction}>
            {content.primaryLabel}
          </button>

          <button type="button" style={secondaryButtonStyle} onClick={handleSecondaryAction}>
            {content.secondaryLabel}
          </button>
        </div>
      </div>

      <div style={gridStyle}>
        <article style={infoCardStyle}>
          <h2 style={cardTitleStyle}>Scopri</h2>
          <p style={cardTextStyle}>
            Entra nei profili pubblici, filtra meglio e costruisci il tuo percorso con meno attrito.
          </p>
        </article>

        <article style={infoCardStyle}>
          <h2 style={cardTitleStyle}>Profilo</h2>
          <p style={cardTextStyle}>
            Cura presenza, immagini e bio. Il profilo deve essere vivo, non vuoto.
          </p>
        </article>

        <article style={infoCardStyle}>
          <h2 style={cardTitleStyle}>Premium</h2>
          <p style={cardTextStyle}>
            Il premium serve quando aggiunge valore reale. Non quando crea confusione.
          </p>
        </article>
      </div>
    </section>
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