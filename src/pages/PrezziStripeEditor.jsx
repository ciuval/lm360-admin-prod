import React from "react";

const safeguards = [
  "nessuna modifica commerciale da questa schermata",
  "nessun collegamento di pagamento avviato",
  "nessuna configurazione sensibile esposta",
  "riattivazione solo con procedura controllata",
];

export default function PricingAdminPlaceholder() {
  return (
    <main style={pageStyle} aria-labelledby="pricing-admin-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 admin</p>

        <h1 id="pricing-admin-title" style={titleStyle}>
          Configurazione commerciale in revisione
        </h1>

        <p style={textStyle}>
          Questa area e temporaneamente informativa. Le modifiche commerciali
          richiedono una procedura separata, verificata e approvata prima di
          qualsiasi pubblicazione.
        </p>

        <div style={gridStyle}>
          {safeguards.map((item) => (
            <div key={item} style={itemStyle}>
              {item}
            </div>
          ))}
        </div>

        <p style={noteStyle}>
          Per proteggere utenti, valore del progetto e continuita del servizio,
          questa pagina non avvia azioni operative.
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
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
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
  fontSize: "clamp(2rem, 5vw, 3rem)",
  lineHeight: 1.05,
};

const textStyle = {
  margin: "18px 0 0",
  maxWidth: 720,
  fontSize: 16,
  lineHeight: 1.7,
  color: "rgba(255,255,255,0.82)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 14,
  marginTop: 24,
};

const itemStyle = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.24)",
};

const noteStyle = {
  margin: "24px 0 0",
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(240,143,192,0.24)",
  background: "rgba(240,143,192,0.08)",
  color: "rgba(255,255,255,0.82)",
  lineHeight: 1.7,
};
