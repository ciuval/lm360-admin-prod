export default function ActivityLogViewer() {
  return (
    <section style={cardStyle} aria-label="Registro amministrativo">
      <strong style={titleStyle}>Registro amministrativo</strong>
      <p style={textStyle}>
        Questa vista è in revisione controllata. I log amministrativi restano protetti e non vengono mostrati qui.
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