export default function AdminPremiumRequests() {
  return (
    <section style={cardStyle} aria-label="Richieste Premium" aria-live="polite">
      <strong style={titleStyle}>Richieste Premium</strong>
      <p style={textStyle}>
        Funzione in revisione controllata: da qui non vengono mostrati dati personali e non vengono modificate richieste Premium.
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