export default function BadgeRichiestePremium() {
  return (
    <span style={badgeStyle} aria-label="Richieste Premium non attive">
      Richieste Premium: non attive
    </span>
  );
}

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: "28px",
  padding: "0 10px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.06)",
  color: "rgba(255,255,255,0.82)",
  fontSize: "0.85rem",
  fontWeight: 800,
};