import React from "react";

const checks = [
  "nessun elenco account mostrato",
  "nessun export dati disponibile",
  "nessuna modifica agli accessi",
  "nessuna azione sui piani commerciali",
];

export default function AdminAbbonamentiDashboard() {
  return (
    <main style={pageStyle} aria-labelledby="admin-subscriptions-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 admin</p>

        <h1 id="admin-subscriptions-title" style={titleStyle}>
          Gestione accessi in revisione
        </h1>

        <p style={textStyle}>
          Questa sezione e stata messa in pausa per evitare letture estese,
          esportazioni non necessarie o interventi non controllati sugli account.
        </p>

        <ul style={listStyle}>
          {checks.map((item) => (
            <li key={item} style={itemStyle}>
              {item}
            </li>
          ))}
        </ul>

        <p style={noteStyle}>
          Quando verra riattivata, questa area dovra usare permessi dedicati,
          informazioni minimizzate e passaggi di conferma chiari.
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
