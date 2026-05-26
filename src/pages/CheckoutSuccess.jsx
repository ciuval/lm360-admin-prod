import React from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  return (
    <main style={pageStyle} aria-labelledby="checkout-success-paused-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 · account</p>

        <h1 id="checkout-success-paused-title" style={titleStyle}>
          Nessuna attivazione automatica.
        </h1>

        <p style={textStyle}>
          Questa pagina non aggiorna lo stato Premium e non modifica il tuo
          profilo. Il vecchio percorso di conferma è stato messo in pausa per
          evitare attivazioni test o scritture non controllate.
        </p>

        <div style={gridStyle}>
          <article style={itemStyle}>
            <h2 style={itemTitleStyle}>Account protetto</h2>
            <p style={itemTextStyle}>
              Nessuna scrittura manuale viene eseguita da questa schermata.
            </p>
          </article>

          <article style={itemStyle}>
            <h2 style={itemTitleStyle}>Premium prudente</h2>
            <p style={itemTextStyle}>
              Premium resta un percorso facoltativo, da riattivare solo quando
              sarà verificato.
            </p>
          </article>
        </div>

        <div style={actionsStyle}>
          <button type="button" style={primaryButtonStyle} onClick={() => navigate("/premium")}>
            Torna a Premium
          </button>

          <button type="button" style={secondaryButtonStyle} onClick={() => navigate("/profilo")}>
            Vai al profilo
          </button>
        </div>

        <p style={noteStyle}>
          Se pensi di aver completato un pagamento reale, contatta il supporto
          prima di riprovare. Non usare questa pagina come prova automatica di
          attivazione.
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
