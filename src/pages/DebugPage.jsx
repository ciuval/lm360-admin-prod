import React from "react";
import { useNavigate } from "react-router-dom";

export default function DebugPage() {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} aria-labelledby="debug-paused-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 · area interna</p>

        <h1 id="debug-paused-title" style={titleStyle}>
          Area debug sospesa.
        </h1>

        <p style={textStyle}>
          Questa pagina non esegue login di prova, non legge dati e non mostra
          informazioni operative. Le verifiche interne verranno riattivate solo
          con un percorso protetto e controllato.
        </p>

        <div style={gridStyle}>
          <article style={itemStyle}>
            <h2 style={itemTitleStyle}>Nessun dato esposto</h2>
            <p style={itemTextStyle}>
              Da qui non vengono lette tabelle, profili, messaggi o match.
            </p>
          </article>

          <article style={itemStyle}>
            <h2 style={itemTitleStyle}>Nessun accesso simulato</h2>
            <p style={itemTextStyle}>
              Gli account di prova restano fuori dal browser pubblico.
            </p>
          </article>

          <article style={itemStyle}>
            <h2 style={itemTitleStyle}>Sicurezza prima</h2>
            <p style={itemTextStyle}>
              Le funzioni interne saranno disponibili solo quando saranno
              separate, autorizzate e verificabili.
            </p>
          </article>
        </div>

        <div style={actionsStyle}>
          <button type="button" style={primaryButtonStyle} onClick={() => navigate("/")}>
            Torna alla Home
          </button>

          <button type="button" style={secondaryButtonStyle} onClick={() => navigate("/welcome")}>
            Vai a Inizia
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
