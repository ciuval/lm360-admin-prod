import React from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    title: "1. Crea il profilo",
    text: "Nome, bio, interessi e foto aiutano le altre persone a capire chi sei davvero.",
  },
  {
    title: "2. Entra in Scopri",
    text: "Guarda i profili disponibili e usa il sito con calma, senza caos e senza pulsanti inutili.",
  },
  {
    title: "3. Dai valore ai like",
    text: "Ogni azione deve aiutarti a costruire un percorso più chiaro, non solo a cliccare a caso.",
  },
  {
    title: "4. Arriva ai match",
    text: "Quando l'interesse è reciproco, il sito può diventare più utile e più umano.",
  },
  {
    title: "5. Usa Premium solo quando serve",
    text: "Premium resta un percorso da valutare con calma. Nessun acquisto parte da questa pagina.",
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} aria-labelledby="welcome-title">
      <section style={heroStyle}>
        <p style={eyebrowStyle}>LoveMatch360 · onboarding</p>

        <h1 id="welcome-title" style={titleStyle}>
          Inizia dal percorso giusto.
        </h1>

        <p style={textStyle}>
          LoveMatch360 funziona meglio quando il profilo è chiaro, la scoperta è ordinata
          e ogni passaggio ha un senso. Questa pagina ti guida nei primi passi senza
          confusione.
        </p>

        <div style={actionsStyle}>
          <button type="button" style={primaryButtonStyle} onClick={() => navigate("/profilo")}>
            Inizia dal profilo
          </button>

          <button type="button" style={secondaryButtonStyle} onClick={() => navigate("/scopri")}>
            Vai a Scopri
          </button>
        </div>
      </section>

      <section style={gridStyle} aria-label="Passi consigliati">
        {steps.map((step) => (
          <article key={step.title} style={cardStyle}>
            <h2 style={cardTitleStyle}>{step.title}</h2>
            <p style={cardTextStyle}>{step.text}</p>
          </article>
        ))}
      </section>

      <aside style={noteStyle} aria-label="Nota importante">
        <strong>Prima il valore, poi la monetizzazione.</strong>
        <span>
          {" "}
          In questa fase il percorso Premium viene migliorato con prudenza. L'obiettivo è
          costruire fiducia, profili migliori e un'esperienza più utile prima di pensare
          alla monetizzazione reale.
        </span>
      </aside>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 16px",
  background:
    "radial-gradient(circle at top left, rgba(240,143,192,0.18), transparent 34%), #121212",
  color: "#f6f6f6",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
};

const heroStyle = {
  maxWidth: 980,
  margin: "0 auto",
  padding: "36px 22px",
  borderRadius: 26,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.045)",
  boxShadow: "0 24px 80px rgba(0,0,0,0.28)",
};

const eyebrowStyle = {
  margin: 0,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#f08fc0",
};

const titleStyle = {
  margin: "14px 0 0",
  fontSize: "clamp(2.25rem, 7vw, 4.6rem)",
  lineHeight: 1.02,
  letterSpacing: "-0.05em",
};

const textStyle = {
  margin: "18px 0 0",
  maxWidth: 760,
  fontSize: 17,
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.82)",
};

const actionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 26,
};

const primaryButtonStyle = {
  border: "none",
  borderRadius: 999,
  padding: "13px 18px",
  background: "#f08fc0",
  color: "#121212",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 999,
  padding: "13px 18px",
  background: "rgba(255,255,255,0.06)",
  color: "#f6f6f6",
  fontWeight: 800,
  cursor: "pointer",
};

const gridStyle = {
  maxWidth: 980,
  margin: "20px auto 0",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
};

const cardStyle = {
  padding: 18,
  borderRadius: 20,
  border: "1px solid rgba(255,255,255,0.09)",
  background: "rgba(0,0,0,0.24)",
};

const cardTitleStyle = {
  margin: 0,
  fontSize: 18,
};

const cardTextStyle = {
  margin: "10px 0 0",
  lineHeight: 1.65,
  color: "rgba(255,255,255,0.78)",
};

const noteStyle = {
  maxWidth: 980,
  margin: "20px auto 0",
  padding: 18,
  borderRadius: 20,
  border: "1px solid rgba(240,143,192,0.26)",
  background: "rgba(240,143,192,0.08)",
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.84)",
};
