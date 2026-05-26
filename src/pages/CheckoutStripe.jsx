import React from "react";
import { useNavigate } from "react-router-dom";

const points = [
  "la monetizzazione reale è sospesa finché il percorso non sarà verificato",
  "nessun pagamento parte da questa pagina",
  "nessuna modifica viene fatta al tuo account",
  "Premium resta un percorso da valutare con calma",
];

export default function CheckoutStripe() {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} aria-labelledby="checkout-paused-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 · Premium</p>

        <h1 id="checkout-paused-title" style={titleStyle}>
          Checkout in pausa controllata.
        </h1>

        <p style={textStyle}>
          In questa fase LoveMatch360 sta dando priorità a valore, utenti,
          profili e onboarding. Il percorso di pagamento verrà riattivato solo
          quando sarà pronto, chiaro e verificato.
        </p>

        <ul style={listStyle}>
          {points.map((item) => (
            <li key={item} style={itemStyle}>{item}</li>
          ))}
        </ul>

        <div style={actionsStyle}>
          <button type="button" style={primaryButtonStyle} onClick={() => navigate("/premium")}>
            Torna a Premium
          </button>

          <button type="button" style={secondaryButtonStyle} onClick={() => navigate("/welcome")}>
            Vai a Inizia
          </button>
        </div>

        <p style={noteStyle}>
          Nessun checkout parte da questa pagina. Nessun acquisto viene creato
          senza una scelta chiara dell’utente.
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
  lineHeight: 1.55,
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
