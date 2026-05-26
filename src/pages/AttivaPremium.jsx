import React from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Prima il valore",
    text: "LoveMatch360 sta rafforzando profili, onboarding, scoperta e fiducia prima della monetizzazione reale.",
  },
  {
    title: "Premium resta facoltativo",
    text: "Chi vuole può valutare più valore in futuro. Chi non vuole può restare nel percorso base.",
  },
  {
    title: "Nessun acquisto automatico",
    text: "Da questa pagina non parte nessun checkout e non viene modificato lo stato account.",
  },
];

export default function AttivaPremium() {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} aria-labelledby="attiva-premium-paused-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 · Premium</p>

        <h1 id="attiva-premium-paused-title" style={titleStyle}>
          Premium in pausa controllata.
        </h1>

        <p style={textStyle}>
          Costruire e mantenere un servizio richiede lavoro, tempo e risorse.
          Per questo Premium resta un percorso futuro e facoltativo, ma in
          questa fase non viene avviato alcun pagamento dal browser.
        </p>

        <div style={gridStyle}>
          {cards.map((card) => (
            <article key={card.title} style={itemStyle}>
              <h2 style={itemTitleStyle}>{card.title}</h2>
              <p style={itemTextStyle}>{card.text}</p>
            </article>
          ))}
        </div>

        <div style={actionsStyle}>
          <button type="button" style={primaryButtonStyle} onClick={() => navigate("/welcome")}>
            Vai a Inizia
          </button>

          <button type="button" style={secondaryButtonStyle} onClick={() => navigate("/premium")}>
            Torna a Premium
          </button>
        </div>

        <p style={noteStyle}>
          Nessun checkout parte da questa pagina. Nessuna scrittura manuale
          viene fatta su profili, piani o abbonamenti.
        </p>
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 16px",
  backgroundColor: "#121212",
  color: "#f6f6f6",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
};

const cardStyle = {
  maxWidth: 940,
  margin: "0 auto",
  padding: 28,
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.045)",
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
  margin: "12px 0 0",
  fontSize: "clamp(2rem, 6vw, 3.4rem)",
  lineHeight: 1.05,
};

const textStyle = {
  margin: "18px 0 0",
  maxWidth: 780,
  fontSize: 16,
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.82)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
  marginTop: 24,
};

const itemStyle = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.24)",
};

const itemTitleStyle = {
  margin: 0,
  fontSize: 18,
};

const itemTextStyle = {
  margin: "10px 0 0",
  lineHeight: 1.65,
  color: "rgba(255,255,255,0.78)",
};

const actionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
  marginTop: 24,
};

const primaryButtonStyle = {
  border: "none",
  borderRadius: 999,
  padding: "12px 18px",
  background: "#f08fc0",
  color: "#121212",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 999,
  padding: "12px 18px",
  background: "rgba(255,255,255,0.06)",
  color: "#f6f6f6",
  fontWeight: 800,
  cursor: "pointer",
};

const noteStyle = {
  margin: "24px 0 0",
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(240,143,192,0.24)",
  background: "rgba(240,143,192,0.08)",
  color: "rgba(255,255,255,0.84)",
  lineHeight: 1.7,
};
