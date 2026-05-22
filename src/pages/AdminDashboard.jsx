import React from "react";

const items = [
  {
    title: "Area in revisione",
    text: "Questa sezione e stata messa in pausa per proteggere ruoli, profili e funzioni interne.",
  },
  {
    title: "Nessuna modifica utenti",
    text: "Da questa pagina non e possibile cambiare ruoli, stati account o accessi.",
  },
  {
    title: "Nessuna cancellazione",
    text: "Le azioni delicate richiederanno un percorso separato, controllato e approvato.",
  },
];

export default function AdminDashboard() {
  return (
    <main style={pageStyle} aria-labelledby="admin-dashboard-title">
      <section style={cardStyle}>
        <p style={eyebrowStyle}>LoveMatch360 admin</p>

        <h1 id="admin-dashboard-title" style={titleStyle}>
          Pannello amministrativo in revisione
        </h1>

        <p style={textStyle}>
          Questa area e stata resa sicura mentre prepariamo una struttura
          amministrativa piu ordinata, con ruoli separati e permessi chiari.
        </p>

        <div style={gridStyle}>
          {items.map((item) => (
            <article key={item.title} style={itemStyle}>
              <h2 style={itemTitleStyle}>{item.title}</h2>
              <p style={itemTextStyle}>{item.text}</p>
            </article>
          ))}
        </div>

        <p style={noteStyle}>
          Le future funzioni amministrative saranno divise tra Supporto,
          Operativo e Super Admin, una cosa alla volta e solo dopo verifiche.
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
  padding: 16,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.24)",
};

const itemTitleStyle = {
  margin: 0,
  fontSize: 17,
};

const itemTextStyle = {
  margin: "10px 0 0",
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.78)",
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
