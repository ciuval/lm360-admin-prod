import React from "react";
import { useNavigate } from "react-router-dom";

export default function TesterPage() {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} aria-labelledby="tester-paused-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 · area test</p>

        <h1 id="tester-paused-title" style={titleStyle}>
          Area tester sospesa.
        </h1>

        <p style={textStyle}>
          Questa pagina non usa account di prova, non genera match e non legge
          dati dal browser. I test tecnici verranno spostati in procedure
          separate, sicure e non pubbliche.
        </p>

        <ul style={listStyle}>
          <li style={itemStyle}>nessuna sessione di prova attiva</li>
          <li style={itemStyle}>nessuna lettura di profili o messaggi</li>
          <li style={itemStyle}>nessuna creazione di match dal browser</li>
          <li style={itemStyle}>nessuna informazione personale mostrata</li>
        </ul>

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
  maxWidth: 900,
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

const listStyle = {
  margin: "24px 0 0",
  padding: 0,
  listStyle: "none",
  display: "grid",
  gap: 12,
};

const itemStyle = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.24)",
  lineHeight: 1.6,
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
