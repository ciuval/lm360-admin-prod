const linkGroups = [
  {
    title: "Pubblico",
    note: "Pagine aperte per capire il progetto.",
    links: [
      { label: "Home", href: "#/" },
      { label: "Inizia", href: "#/welcome" },
      { label: "Funzioni", href: "#/funzioni" },
      { label: "Soluzioni", href: "#/soluzioni" },
      { label: "Clienti locali", href: "#/sito-clienti-locali" },
      { label: "Prenotazioni", href: "#/sito-prenotazioni" },
      { label: "Profili pubblici", href: "#/profili-pubblici" },
      { label: "Come funziona", href: "#/come-funziona" },
      { label: "Chi siamo", href: "#/chi-siamo" },
    ],
  },
  {
    title: "Percorso utente",
    note: "Aree protette o collegate al percorso personale.",
    links: [
      { label: "Profilo", href: "#/profilo" },
      { label: "Scopri", href: "#/scopri" },
      { label: "Match", href: "#/match" },
      { label: "Impostazioni", href: "#/impostazioni" },
      { label: "Notifiche", href: "#/notifiche" },
      { label: "Premium", href: "#/premium" },
      { label: "Billing", href: "#/billing" },
    ],
  },
  {
    title: "Owner e controllo",
    note: "Mappa operativa. Nessuna azione distruttiva dal footer.",
    links: [
      { label: "Admin", href: "#/admin" },
      { label: "Visitatori", href: "#/visitatori" },
      { label: "Log admin", href: "#/log-admin" },
      { label: "Log stats", href: "#/log-stats" },
      { label: "Quantum", href: "#/quantum" },
    ],
  },
  {
    title: "Trust e legale",
    note: "Supporto, sicurezza e regole pubbliche.",
    links: [
      { label: "Contatti", href: "#/contatti" },
      { label: "FAQ", href: "#/faq" },
      { label: "Sicurezza", href: "#/sicurezza" },
      { label: "Privacy", href: "#/privacy" },
      { label: "Cookie", href: "#/cookies" },
      { label: "Termini", href: "#/terms" },
      { label: "Rimborsi", href: "#/refunds" },
      { label: "Termini IT", href: "#/termini" },
      { label: "Rimborsi IT", href: "#/rimborsi" },
    ],
  },
];

const statusItems = [
  "Piattaforma attiva",
  "Pagamenti in pausa controllata",
  "Nessuna lettura live dal footer",
  "Nessun invio email dal browser",
];

export default function SiteFooter() {
  return (
    <footer style={footerStyle} aria-label="Mappa finale del sito">
      <div style={innerStyle}>
        <section style={brandStyle} aria-labelledby="footer-brand-title">
          <p style={eyebrowStyle}>LoveMatch360</p>
          <h2 id="footer-brand-title" style={brandTitleStyle}>
            Percorsi vivi, meno caos.
          </h2>
          <p style={brandTextStyle}>
            Una mappa ordinata per muoversi tra pagine pubbliche, percorso utente,
            area owner e contenuti di fiducia. Il footer orienta: non modifica account,
            non legge dati live e non avvia pagamenti.
          </p>

          <div style={contactBoxStyle}>
            <span style={contactLabelStyle}>Supporto ufficiale</span>
            <a href="mailto:servizioclienti@lovematch360.com" style={contactLinkStyle}>
              servizioclienti@lovematch360.com
            </a>
          </div>
        </section>

        <nav style={groupsStyle} aria-label="Collegamenti footer">
          {linkGroups.map((group) => (
            <section key={group.title} style={groupStyle} aria-labelledby={`footer-${slug(group.title)}`}>
              <h3 id={`footer-${slug(group.title)}`} style={groupTitleStyle}>
                {group.title}
              </h3>
              <p style={groupNoteStyle}>{group.note}</p>
              <div style={linksStyle}>
                {group.links.map((link) => (
                  <a key={link.href + link.label} href={link.href} style={linkStyle}>
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </nav>

        <section style={statusStyle} aria-label="Stato del servizio">
          <div>
            <span style={statusLabelStyle}>Stato</span>
            <strong style={statusTitleStyle}>Footer sicuro e non distruttivo.</strong>
          </div>
          <div style={statusItemsStyle}>
            {statusItems.map((item) => (
              <span key={item} style={statusItemStyle}>
                {item}
              </span>
            ))}
          </div>
        </section>

        <div style={bottomStyle}>
          <span>2026 LoveMatch360</span>
          <span>Connessioni piu vive, meno caos.</span>
        </div>
      </div>
    </footer>
  );
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const footerStyle = {
  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(5, 7, 11, 0.96)",
  color: "#f8fafc",
};

const innerStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "clamp(2rem, 4vw, 3rem) 1rem 1rem",
};

const brandStyle = {
  maxWidth: 780,
  marginBottom: "1.5rem",
};

const eyebrowStyle = {
  margin: "0 0 0.45rem",
  color: "#f08fc0",
  fontSize: "0.8rem",
  fontWeight: 900,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const brandTitleStyle = {
  margin: 0,
  fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
  letterSpacing: "-0.045em",
};

const brandTextStyle = {
  maxWidth: 820,
  margin: "0.75rem 0 0",
  color: "rgba(248, 250, 252, 0.72)",
  fontSize: "1rem",
  lineHeight: 1.7,
};

const contactBoxStyle = {
  display: "inline-grid",
  gap: "0.35rem",
  marginTop: "1rem",
  padding: "0.85rem 1rem",
  borderRadius: "18px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.05)",
};

const contactLabelStyle = {
  color: "rgba(248, 250, 252, 0.62)",
  fontSize: "0.78rem",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const contactLinkStyle = {
  color: "#ffd7ea",
  fontWeight: 900,
  textDecoration: "none",
};

const groupsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "1rem",
};

const groupStyle = {
  minHeight: 210,
  padding: "1rem",
  borderRadius: "22px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.045)",
};

const groupTitleStyle = {
  margin: 0,
  fontSize: "1rem",
};

const groupNoteStyle = {
  margin: "0.45rem 0 0.8rem",
  color: "rgba(248, 250, 252, 0.58)",
  fontSize: "0.88rem",
  lineHeight: 1.5,
};

const linksStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.45rem",
};

const linkStyle = {
  display: "inline-flex",
  padding: "0.48rem 0.62rem",
  borderRadius: "999px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.06)",
  color: "#f8fafc",
  fontSize: "0.86rem",
  fontWeight: 800,
  textDecoration: "none",
};

const statusStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  marginTop: "1rem",
  padding: "1rem",
  borderRadius: "22px",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.04)",
};

const statusLabelStyle = {
  display: "block",
  color: "#f08fc0",
  fontSize: "0.76rem",
  fontWeight: 900,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const statusTitleStyle = {
  display: "block",
  marginTop: "0.2rem",
};

const statusItemsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.45rem",
};

const statusItemStyle = {
  padding: "0.48rem 0.62rem",
  borderRadius: "999px",
  color: "rgba(248, 250, 252, 0.78)",
  background: "rgba(255, 255, 255, 0.055)",
  border: "1px solid rgba(255, 255, 255, 0.09)",
  fontSize: "0.84rem",
};

const bottomStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: "0.75rem",
  padding: "1rem 0 0",
  color: "rgba(248, 250, 252, 0.5)",
  fontSize: "0.9rem",
};
