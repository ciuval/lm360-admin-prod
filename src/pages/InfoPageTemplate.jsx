export default function InfoPageTemplate({
  eyebrow,
  title,
  lead,
  sections = [],
  cta,
  secondaryCta,
  quickLinks = [],
}) {
  return (
    <main style={pageStyle} aria-labelledby="info-page-title">
      <section style={heroStyle}>
        <span style={eyebrowStyle}>{eyebrow}</span>
        <h1 id="info-page-title" style={titleStyle}>{title}</h1>
        <p style={leadStyle}>{lead}</p>

        <div style={heroActionsStyle} aria-label="Azioni pagina">
          {cta ? (
            <a href={cta.href} style={primaryLinkStyle}>
              {cta.label}
            </a>
          ) : null}
          {secondaryCta ? (
            <a href={secondaryCta.href} style={secondaryLinkStyle}>
              {secondaryCta.label}
            </a>
          ) : null}
        </div>
      </section>

      <section style={gridStyle} aria-label="Contenuti principali">
        {sections.map((section) => (
          <article key={section.title} style={cardStyle}>
            <span style={cardLabelStyle}>{section.label}</span>
            <h2 style={cardTitleStyle}>{section.title}</h2>
            <p style={cardTextStyle}>{section.text}</p>
            {section.actions && section.actions.length ? (
              <div style={cardActionsStyle}>
                {section.actions.map((action) => (
                  <a key={action.href + action.label} href={action.href} style={cardActionStyle}>
                    {action.label}
                  </a>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>

      {quickLinks.length ? (
        <section style={quickLinksStyle} aria-labelledby="quick-links-title">
          <div>
            <span style={eyebrowStyle}>Percorsi vivi</span>
            <h2 id="quick-links-title" style={quickTitleStyle}>
              Continua senza perderti.
            </h2>
          </div>
          <div style={quickGridStyle}>
            {quickLinks.map((link) => (
              <a key={link.href + link.label} href={link.href} style={quickLinkStyle}>
                <strong>{link.label}</strong>
                <small>{link.text}</small>
              </a>
            ))}
          </div>
        </section>
      ) : null}
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

const heroActionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.75rem",
  marginTop: "1.25rem",
};

const primaryLinkStyle = {
  display: "inline-flex",
  padding: "0.85rem 1rem",
  borderRadius: "999px",
  color: "#170d13",
  background: "#f08fc0",
  fontWeight: 900,
  textDecoration: "none",
};

const secondaryLinkStyle = {
  ...primaryLinkStyle,
  color: "#f7f3f8",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.14)",
};

const gridStyle = {
  maxWidth: "1080px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "1rem",
};

const cardStyle = {
  display: "flex",
  minHeight: "230px",
  flexDirection: "column",
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
  flex: 1,
  margin: 0,
  color: "rgba(247, 243, 248, 0.72)",
  lineHeight: 1.65,
};

const cardActionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginTop: "1rem",
};

const cardActionStyle = {
  display: "inline-flex",
  padding: "0.58rem 0.68rem",
  borderRadius: "999px",
  color: "#f7f3f8",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.12)",
  fontSize: "0.88rem",
  fontWeight: 800,
  textDecoration: "none",
};

const quickLinksStyle = {
  maxWidth: "1080px",
  margin: "1rem auto 0",
  padding: "1.1rem",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.09)",
  background: "rgba(255, 255, 255, 0.045)",
};

const quickTitleStyle = {
  margin: 0,
  fontSize: "clamp(1.35rem, 3vw, 2rem)",
};

const quickGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "0.75rem",
  marginTop: "1rem",
};

const quickLinkStyle = {
  display: "grid",
  gap: "0.35rem",
  padding: "0.9rem",
  borderRadius: "18px",
  color: "#f7f3f8",
  background: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  textDecoration: "none",
};
