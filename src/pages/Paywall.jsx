import React from "react";
import { useNavigate } from "react-router-dom";

export default function Paywall() {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} aria-labelledby="paywall-paused-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 · accesso</p>

        <h1 id="paywall-paused-title" style={titleStyle}>
          Paywall in pausa controllata.
        </h1>

        <p style={textStyle}>
          In questa fase il sito sta dando priorità a profili, onboarding,
          scoperta e sicurezza. L’accesso a funzioni avanzate verrà spiegato e
          riattivato solo quando il percorso sarà pronto.
        </p>

        <div style={gridStyle}>
          <article style={itemStyle}>
            <h2 style={itemTitleStyle}>Nessun acquisto qui</h2>
            <p style={itemTextStyle}>
              Questa schermata non avvia pagamenti e non modifica lo stato
              account.
            </p>
          </article>

          <article style={itemStyle}>
            <h2 style={itemTitleStyle}>Percorso base chiaro</h2>
            <p style={itemTextStyle}>
              Puoi continuare a usare il sito partendo da profilo, scoperta e
              match.
            </p>
          </article>

          <article style={itemStyle}>
            <h2 style={itemTitleStyle}>Valore prima</h2>
            <p style={itemTextStyle}>
              Le funzioni avanzate devono essere utili, comprensibili e
              verificabili.
            </p>
          </article>
        </div>

        <div style={actionsStyle}>
          <button type="button" style={primaryButtonStyle} onClick={() => navigate("/welcome")}>
            Vai a Inizia
          </button>

          <button type="button" style={secondaryButtonStyle} onClick={() => navigate("/premium")}>
            Scopri Premium
          </button>
        </div>
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
  maxWidth: 920,
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
  maxWidth: 760,
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
