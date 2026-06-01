export default function InfoPageTemplate({ eyebrow, title, lead, sections = [], cta }) {
  return (
    <main style={pageStyle} aria-labelledby="info-page-title">
      <section style={heroStyle}>
        <span style={eyebrowStyle}>{eyebrow}</span>
        <h1 id="info-page-title" style={titleStyle}>{title}</h1>
        <p style={leadStyle}>{lead}</p>
        {cta ? (
          <a href={cta.href} style={primaryLinkStyle}>
            {cta.label}
          </a>
        ) : null}
      </section>

      <section style={gridStyle} aria-label="Contenuti principali">
        {sections.map((section) => (
          <article key={section.title} style={cardStyle}>
            <span style={cardLabelStyle}>{section.label}</span>
            <h2 style={cardTitleStyle}>{section.title}</h2>
            <p style={cardTextStyle}>{section.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "clamp(1.25rem, 3vw, 3rem)",
  color: "#f7f3f8",
  background:
    "radial-gradient(circle at top left, rgba(240, 143, 192, 0.14), transparent 34rem), #090a0d",
};

const heroStyle = {
  maxWidth: "1080px",
  margin: "0 auto 1.5rem",
  padding: "clamp(1.25rem, 3vw, 2.4rem)",
  borderRadius: "28px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.055)",
  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
};

const eyebrowStyle = {
  display: "inline-block",
  marginBottom: "0.75rem",
  color: "#f08fc0",
  fontSize: "0.76rem",
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  maxWidth: "850px",
  fontSize: "clamp(2.1rem, 5vw, 4.4rem)",
  lineHeight: 0.98,
  letterSpacing: "-0.055em",
};

const leadStyle = {
  maxWidth: "780px",
  margin: "1.1rem 0 0",
  color: "rgba(247, 243, 248, 0.76)",
  fontSize: "clamp(1rem, 2vw, 1.15rem)",
  lineHeight: 1.7,
};

const primaryLinkStyle = {
  display: "inline-flex",
  marginTop: "1.25rem",
  padding: "0.85rem 1rem",
  borderRadius: "999px",
  color: "#170d13",
  background: "#f08fc0",
  fontWeight: 900,
  textDecoration: "none",
};

const gridStyle = {
  maxWidth: "1080px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "1rem",
};

const cardStyle = {
  padding: "1.1rem",
  borderRadius: "22px",
  border: "1px solid rgba(255, 255, 255, 0.09)",
  background: "rgba(255, 255, 255, 0.05)",
};

const cardLabelStyle = {
  display: "inline-block",
  marginBottom: "0.6rem",
  color: "#ffd7ea",
  fontSize: "0.72rem",
  fontWeight: 900,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const cardTitleStyle = {
  margin: "0 0 0.55rem",
  fontSize: "1.2rem",
};

const cardTextStyle = {
  margin: 0,
  color: "rgba(247, 243, 248, 0.72)",
  lineHeight: 1.65,
};
