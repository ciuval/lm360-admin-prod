const sections = [
  {
    title: "Stato operativo",
    label: "Base pulita",
    text:
      "Supabase e stato ripulito per lo sviluppo. L account admin e la base da cui continuare il lavoro.",
  },
  {
    title: "Persone e account",
    label: "Gestione prudente",
    text:
      "Qui si preparano controlli su login, profili, ruoli e stati account. Ogni modifica reale deve passare da audit, conferma e postcheck.",
  },
  {
    title: "Pagine del sito",
    label: "Sviluppo ordinato",
    text:
      "Home, Inizia, Profilo, Scopri, Match, Chat, Premium, Billing, Quantum, contenuti e pagine legali vanno migliorate una alla volta.",
  },
  {
    title: "Sicurezza",
    label: "Niente scorciatoie",
    text:
      "Nessun dato operativo viene esportato da questa schermata. Le azioni delicate non partono dal browser senza procedura separata.",
  },
];

const paths = [
  { label: "Profilo", href: "#/profilo", note: "Gestione profilo admin pulito" },
  { label: "Inizia", href: "#/welcome", note: "Percorso guidato utente" },
  { label: "Scopri", href: "#/scopri", note: "Discovery protetta" },
  { label: "Match", href: "#/match", note: "Match e stato vuoto" },
  { label: "Premium", href: "#/premium", note: "Valore Premium, non checkout" },
  { label: "Billing", href: "#/billing", note: "Area futura, protetta" },
  { label: "Quantum", href: "#/quantum", note: "Area speciale" },
  { label: "Privacy", href: "#/privacy", note: "Trust e conformita" },
];

const futureActions = [
  "Creare pannello stato sito con soli conteggi sicuri.",
  "Preparare gestione pagine: bozza, pubblicata, da migliorare.",
  "Preparare gestione profili con conferma esplicita prima di ogni modifica.",
  "Preparare archivio decisioni: cosa e stato fatto, quando, perche.",
  "Aggiungere strumenti admin solo server-side quando servono davvero.",
];

const safetyRules = [
  "Nessuna cancellazione diretta da questa pagina.",
  "Nessun pagamento Stripe parte da questa pagina.",
  "Nessuna lista email o dato sensibile viene mostrato qui.",
  "Ogni azione irreversibile richiede backup, preflight, conferma e postcheck.",
];

export default function AdminPage() {
  return (
    <main style={pageStyle} aria-labelledby="admin-title">
      <section style={heroStyle}>
        <span style={eyebrowStyle}>LoveMatch360 admin nascosto</span>

        <h1 id="admin-title" style={titleStyle}>
          Cabina di regia del sito.
        </h1>

        <p style={leadStyle}>
          Admin non e un account da vendere: e la persona che governa il prodotto,
          controlla le pagine, prepara interventi e protegge il percorso prima di
          aprirlo agli utenti.
        </p>

        <div style={statusGridStyle}>
          <StatusPill label="Accesso" value="Admin attivo" tone="ok" />
          <StatusPill label="Premium" value="Non commerciale" tone="neutral" />
          <StatusPill label="Stripe" value="Dormiente" tone="warning" />
          <StatusPill label="Azioni" value="Solo controllate" tone="ok" />
        </div>
      </section>

      <section style={gridStyle} aria-label="Aree admin principali">
        {sections.map((section) => (
          <article key={section.title} style={cardStyle}>
            <span style={cardLabelStyle}>{section.label}</span>
            <h2 style={cardTitleStyle}>{section.title}</h2>
            <p style={cardTextStyle}>{section.text}</p>
          </article>
        ))}
      </section>

      <section style={panelStyle} aria-labelledby="admin-paths-title">
        <div style={panelHeaderStyle}>
          <div>
            <span style={eyebrowStyle}>Percorsi vivi</span>
            <h2 id="admin-paths-title" style={sectionTitleStyle}>
              Muoviti nel sito senza confusione.
            </h2>
          </div>
          <p style={smallTextStyle}>
            Questi sono collegamenti di navigazione, non azioni distruttive.
          </p>
        </div>

        <div style={pathGridStyle}>
          {paths.map((path) => (
            <a key={path.href} href={path.href} style={pathCardStyle}>
              <strong>{path.label}</strong>
              <span>{path.note}</span>
            </a>
          ))}
        </div>
      </section>

      <section style={twoColumnStyle}>
        <article style={panelStyle}>
          <span style={eyebrowStyle}>Prossime funzioni</span>
          <h2 style={sectionTitleStyle}>Cosa deve poter fare l admin.</h2>

          <ul style={listStyle}>
            {futureActions.map((item) => (
              <li key={item} style={listItemStyle}>
                {item}
              </li>
            ))}
          </ul>
        </article>

        <article style={panelStyle}>
          <span style={eyebrowStyle}>Regole anti rischio</span>
          <h2 style={sectionTitleStyle}>Azioni delicate sempre controllate.</h2>

          <ul style={listStyle}>
            {safetyRules.map((item) => (
              <li key={item} style={listItemStyle}>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section style={warningStyle} aria-label="Nota sicurezza admin">
        <strong>Nessuna cancellazione diretta.</strong>
        <span>
          Questa prima cabina di regia e intenzionalmente sicura: prepara il lavoro,
          chiarisce le priorita e non modifica dati live dal browser.
        </span>
      </section>
    </main>
  );
}

function StatusPill({ label, value, tone }) {
  return (
    <div style={{ ...pillStyle, ...pillToneStyle[tone] }}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "clamp(1.25rem, 3vw, 3rem)",
  color: "#f7f3f8",
  background:
    "radial-gradient(circle at top left, rgba(240, 143, 192, 0.16), transparent 34rem), #090a0d",
};

const heroStyle = {
  maxWidth: "1180px",
  margin: "0 auto 1.5rem",
  padding: "clamp(1.25rem, 3vw, 2.5rem)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "28px",
  background:
    "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))",
  boxShadow: "0 24px 80px rgba(0, 0, 0, 0.35)",
};

const eyebrowStyle = {
  display: "inline-block",
  marginBottom: "0.75rem",
  color: "#f08fc0",
  fontSize: "0.76rem",
  fontWeight: 800,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  maxWidth: "850px",
  fontSize: "clamp(2.2rem, 7vw, 5rem)",
  lineHeight: 0.95,
  letterSpacing: "-0.06em",
};

const leadStyle = {
  maxWidth: "780px",
  margin: "1.25rem 0 0",
  color: "rgba(247, 243, 248, 0.78)",
  fontSize: "clamp(1rem, 2vw, 1.18rem)",
  lineHeight: 1.7,
};

const statusGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "0.8rem",
  marginTop: "1.5rem",
};

const pillStyle = {
  padding: "0.9rem 1rem",
  borderRadius: "18px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const pillToneStyle = {
  ok: {
    background: "rgba(79, 209, 131, 0.12)",
    color: "#d8ffe7",
  },
  neutral: {
    background: "rgba(255, 255, 255, 0.08)",
    color: "#f7f3f8",
  },
  warning: {
    background: "rgba(255, 199, 102, 0.12)",
    color: "#ffe5b4",
  },
};

const gridStyle = {
  maxWidth: "1180px",
  margin: "0 auto 1.5rem",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "1rem",
};

const cardStyle = {
  padding: "1.2rem",
  borderRadius: "22px",
  background: "rgba(255, 255, 255, 0.055)",
  border: "1px solid rgba(255, 255, 255, 0.09)",
};

const cardLabelStyle = {
  display: "inline-block",
  marginBottom: "0.65rem",
  color: "#f08fc0",
  fontSize: "0.72rem",
  fontWeight: 800,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const cardTitleStyle = {
  margin: "0 0 0.6rem",
  fontSize: "1.25rem",
};

const cardTextStyle = {
  margin: 0,
  color: "rgba(247, 243, 248, 0.72)",
  lineHeight: 1.65,
};

const panelStyle = {
  maxWidth: "1180px",
  margin: "0 auto 1.5rem",
  padding: "1.25rem",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.045)",
};

const panelHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "1rem",
  alignItems: "flex-start",
  flexWrap: "wrap",
  marginBottom: "1rem",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "clamp(1.35rem, 3vw, 2rem)",
};

const smallTextStyle = {
  maxWidth: "360px",
  margin: 0,
  color: "rgba(247, 243, 248, 0.62)",
  lineHeight: 1.55,
};

const pathGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "0.8rem",
};

const pathCardStyle = {
  display: "grid",
  gap: "0.35rem",
  padding: "1rem",
  borderRadius: "18px",
  color: "#f7f3f8",
  textDecoration: "none",
  background: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const twoColumnStyle = {
  maxWidth: "1180px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
};

const listStyle = {
  display: "grid",
  gap: "0.75rem",
  margin: "1rem 0 0",
  padding: 0,
  listStyle: "none",
};

const listItemStyle = {
  padding: "0.85rem 0.95rem",
  borderRadius: "16px",
  color: "rgba(247, 243, 248, 0.78)",
  background: "rgba(255, 255, 255, 0.05)",
};

const warningStyle = {
  maxWidth: "1180px",
  margin: "1.5rem auto 0",
  display: "grid",
  gap: "0.35rem",
  padding: "1rem 1.1rem",
  borderRadius: "20px",
  color: "#ffe5f1",
  background: "rgba(240, 143, 192, 0.12)",
  border: "1px solid rgba(240, 143, 192, 0.28)",
};
