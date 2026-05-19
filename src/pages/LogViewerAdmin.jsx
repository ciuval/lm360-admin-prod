import React from "react";

const rows = [
  {
    label: "Stato",
    value: "lettura log disattivata dal client",
  },
  {
    label: "Tabella",
    value: "public.log_attivita",
  },
  {
    label: "Accesso browser",
    value: "append-only per utenti autenticati",
  },
  {
    label: "Motivo",
    value: "i log operativi non vengono letti o esportati dal frontend",
  },
];

export default function LogViewerAdmin() {
  return (
    <main style={pageStyle} aria-labelledby="admin-log-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 admin</p>

        <h1 id="admin-log-title" style={titleStyle}>
          Log operativi non disponibili dal client
        </h1>

        <p style={textStyle}>
          La tabella public.log_attivita e stata resa append-only lato browser.
          Questa schermata non legge, non esporta e non visualizza log operativi
          dal frontend.
        </p>

        <div style={gridStyle}>
          {rows.map((row) => (
            <div key={row.label} style={rowStyle}>
              <span style={labelStyle}>{row.label}</span>
              <strong style={valueStyle}>{row.value}</strong>
            </div>
          ))}
        </div>

        <p style={noteStyle}>
          Eventuali consultazioni amministrative dei log devono passare da un
          canale server-side verificato, con permessi dedicati e minimizzazione
          del contenuto.
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
  maxWidth: 860,
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

const rowStyle = {
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.24)",
};

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.58)",
};

const valueStyle = {
  display: "block",
  fontSize: 16,
  lineHeight: 1.4,
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
