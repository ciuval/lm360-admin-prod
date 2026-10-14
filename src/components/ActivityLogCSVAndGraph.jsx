export default function ActivityLogCSVAndGraph() {
  return (
    <section style={cardStyle} aria-label="Registro attività">
      <strong style={titleStyle}>Registro attività</strong>
      <p style={textStyle}>
        Esportazione e grafico non sono attivi in questa vista. Nessun dato personale viene mostrato da questo componente.
      </p>
    </section>
  );
}

const cardStyle = {
  padding: "1rem",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.04)",
};

const titleStyle = {
  display: "block",
  marginBottom: "0.35rem",
};

const textStyle = {
  margin: 0,
  opacity: 0.82,
  lineHeight: 1.55,
};