const statusCards = [
  {
    label: "Database",
    title: "Base pulita",
    value: "Reset sviluppo completato",
    text:
      "Ultimo stato verificato: account test, profili test, storage e dati prova sono stati azzerati prima della ripartenza.",
    tone: "ok",
  },
  {
    label: "Account",
    title: "Admin attivo",
    value: "1 account pulito",
    text:
      "L account corrente e stato ricreato dopo il reset e promosso ad admin. Premium resta non attivo.",
    tone: "ok",
  },
  {
    label: "Percorsi",
    title: "Pagine protette",
    value: "Login richiesto",
    text:
      "Profilo, Scopri, Match, Admin e Quantum sono percorsi protetti. Chi non entra viene rimandato al login.",
    tone: "ok",
  },
  {
    label: "Pagamenti",
    title: "Stripe dormiente",
    value: "Checkout sospeso",
    text:
      "La parte commerciale resta ferma durante lo sviluppo. Nessun pagamento parte da questa dashboard.",
    tone: "warn",
  },
];

const pageCards = [
  {
    title: "Home",
    href: "#/",
    state: "Viva",
    text: "Ingresso pubblico e messaggio principale del sito.",
  },
  {
    title: "Inizia",
    href: "#/welcome",
    state: "Prioritaria",
    text: "Percorso guidato per far capire dove andare.",
  },
  {
    title: "Profilo",
    href: "#/profilo",
    state: "Da completare",
    text: "Centro identita utente: nome, bio, interessi e foto.",
  },
  {
    title: "Scopri",
    href: "#/scopri",
    state: "Stato vuoto OK",
    text: "Discovery pronta anche senza profili reali.",
  },
  {
    title: "Match",
    href: "#/match",
    state: "Stato vuoto OK",
    text: "Match protetto, con messaggio chiaro se non ci sono match.",
  },
  {
    title: "Premium",
    href: "#/premium",
    state: "In pausa",
    text: "Valore visibile, monetizzazione non ancora attiva.",
  },
  {
    title: "Billing",
    href: "#/billing",
    state: "Protetta",
    text: "Area futura, senza pagamento reale in questa fase.",
  },
  {
    title: "Quantum",
    href: "#/quantum",
    state: "Admin OK",
    text: "Area speciale accessibile all account autorizzato.",
  },
];

const actionPlan = [
  {
    step: "01",
    title: "Rendere Profilo piu guidato",
    text:
      "Aiutare il primo utente a completare nome, bio, interessi e foto senza confusione.",
  },
  {
    step: "02",
    title: "Preparare contenuti reali",
    text:
      "Scrivere testi e microcopy per stati vuoti, onboarding e pagine fiducia.",
  },
  {
    step: "03",
    title: "Gestione utenti futura",
    text:
      "Prima solo conteggi sicuri. Azioni su account e profili solo con conferma separata.",
  },
  {
    step: "04",
    title: "Premium dopo il valore",
    text:
      "Stripe resta dormiente finche il prodotto non e chiaro e testato con utenti veri.",
  },
];

const safetyRules = [
  "Questa dashboard non cancella dati dal browser.",
  "Questa dashboard non esporta email, UUID o dati sensibili.",
  "Questa dashboard non avvia checkout o pagamenti.",
  "Ogni azione irreversibile richiede audit, backup, conferma e postcheck.",
];

const adminNotes = [
  "Admin e una responsabilita operativa, non un piano commerciale.",
  "Il sito e in sviluppo: molte sezioni sono vive, ma non ancora definitive.",
  "Finche non ci sono clienti reali, gli stati vuoti devono essere chiari e intenzionali.",
  "Il libro del progetto registra le decisioni importanti; il sito esegue il percorso.",
];

export default function AdminPage() {
  return (
    <main style={pageStyle} aria-labelledby="admin-dashboard-title">
      <section style={heroStyle}>
        <span style={eyebrowStyle}>LoveMatch360 admin nascosto</span>

        <h1 id="admin-dashboard-title" style={titleStyle}>
          Dashboard operativa sicura.
        </h1>

        <p style={leadStyle}>
          Questa e la cabina di regia del progetto: mostra lo stato verificato,
          orienta i prossimi interventi e protegge le decisioni delicate. Non e un
          pannello commerciale e non esegue azioni distruttive.
        </p>

        <div style={heroActionsStyle}>
          <a href="#/profilo" style={primaryLinkStyle}>
            Vai al profilo
          </a>
          <a href="#/welcome" style={secondaryLinkStyle}>
            Rivedi onboarding
          </a>
        </div>
      </section>

      <section style={statusGridStyle} aria-label="Stato verificato del progetto">
        {statusCards.map((card) => (
          <article key={card.title} style={{ ...statusCardStyle, ...toneStyle[card.tone] }}>
            <span style={cardLabelStyle}>{card.label}</span>
            <h2 style={cardTitleStyle}>{card.title}</h2>
            <strong style={cardValueStyle}>{card.value}</strong>
            <p style={cardTextStyle}>{card.text}</p>
          </article>
        ))}
      </section>

      <section style={panelStyle} aria-labelledby="admin-pages-title">
        <div style={panelHeaderStyle}>
          <div>
            <span style={eyebrowStyle}>Pagine vive</span>
            <h2 id="admin-pages-title" style={sectionTitleStyle}>
              Mappa rapida del sito.
            </h2>
          </div>
          <p style={smallTextStyle}>
            Sono link di navigazione. Non modificano dati e non avviano procedure.
          </p>
        </div>

        <div style={pageGridStyle}>
          {pageCards.map((page) => (
            <a key={page.href} href={page.href} style={pageCardStyle}>
              <span style={pageStateStyle}>{page.state}</span>
              <strong>{page.title}</strong>
              <small>{page.text}</small>
            </a>
          ))}
        </div>
      </section>

      <section style={twoColumnStyle}>
        <article style={panelStyle}>
          <span style={eyebrowStyle}>Prossime azioni</span>
          <h2 style={sectionTitleStyle}>Sviluppo ordinato.</h2>

          <div style={actionListStyle}>
            {actionPlan.map((item) => (
              <div key={item.step} style={actionItemStyle}>
                <span style={actionStepStyle}>{item.step}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article style={panelStyle}>
          <span style={eyebrowStyle}>Regole sicurezza</span>
          <h2 style={sectionTitleStyle}>Niente scorciatoie.</h2>

          <ul style={listStyle}>
            {safetyRules.map((item) => (
              <li key={item} style={listItemStyle}>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section style={panelStyle} aria-labelledby="admin-notes-title">
        <span style={eyebrowStyle}>Note di governo</span>
        <h2 id="admin-notes-title" style={sectionTitleStyle}>
          Cosa significa essere admin.
        </h2>

        <div style={notesGridStyle}>
          {adminNotes.map((note) => (
            <p key={note} style={noteStyle}>
              {note}
            </p>
          ))}
        </div>
      </section>

      <section style={panelStyle} aria-labelledby="owner-operations-title">
        <div style={panelHeaderStyle}>
          <div>
            <span style={eyebrowStyle}>Manuale operativo</span>
            <h2 id="owner-operations-title" style={sectionTitleStyle}>
              Manuale operativo owner.
            </h2>
          </div>
          <p style={smallTextStyle}>
            L owner deve poter orientarsi ovunque nel sito. Le azioni reali restano
            separate: prima audit, poi conferma, poi postcheck.
          </p>
        </div>

        <div style={pageGridStyle}>
          <article style={pageCardStyle}>
            <span style={pageStateStyle}>Accesso owner</span>
            <strong>Entrare in tutte le aree protette</strong>
            <small>
              Owner puo navigare Home, Inizia, Profilo, Scopri, Match, Premium,
              Billing, Quantum e Admin. Il ruolo commerciale resta separato.
            </small>
          </article>

          <article style={pageCardStyle}>
            <span style={pageStateStyle}>Supabase</span>
            <strong>Modifiche reali solo da procedura</strong>
            <small>
              Quando serve cambiare stati account o ruoli, si passa da Supabase SQL
              Editor con blocco dedicato, preflight, conferma esplicita e postcheck.
            </small>
          </article>

          <article style={pageCardStyle}>
            <span style={pageStateStyle}>Stati account</span>
            <strong>Attivo, sospeso, review</strong>
            <small>
              Lo stato dei visitatori non va cambiato con pulsanti rapidi. Prima si
              controlla il profilo, poi si registra motivo, audit log e notifica.
            </small>
          </article>

          <article style={pageCardStyle}>
            <span style={pageStateStyle}>Premium manuale</span>
            <strong>Premium non e admin</strong>
            <small>
              Premium e Super Premium sono stati commerciali. Non danno permessi
              admin e non devono attivare Stripe durante lo sviluppo.
            </small>
          </article>

          <article style={pageCardStyle}>
            <span style={pageStateStyle}>Admin temporaneo</span>
            <strong>Accesso con scadenza</strong>
            <small>
              Collaboratori o possibili acquirenti usano account proprio, ruolo
              admin_temp, motivo scritto, scadenza e log. Mai condividere owner.
            </small>
          </article>

          <article style={pageCardStyle}>
            <span style={pageStateStyle}>Notifiche</span>
            <strong>servizioclienti sempre in coda</strong>
            <small>
              Ogni cambio ruoli o permessi deve creare audit log e notification queue
              verso servizioclienti. L email reale arrivera solo server-side.
            </small>
          </article>
        </div>

        <div
          style={{
            ...warningStyle,
            margin: "1rem 0 0",
          }}
        >
          <strong>Regola operativa.</strong>
          <span>
            La dashboard puo guidare, spiegare e collegare. Non deve eseguire
            modifiche distruttive dal browser. I comandi live si preparano solo in blocchi separati e confermati.
          </span>
        </div>
      </section>

      <section style={warningStyle} aria-label="Limite operativo dashboard">
        <strong>Dashboard sicura, non distruttiva.</strong>
        <span>
          I dati mostrati sono stati e indicazioni operative, non una lista live di
          utenti. Le funzioni reali di gestione arriveranno solo a blocchi, con
          controlli separati.
        </span>
      </section>
    </main>
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
  maxWidth: "900px",
  fontSize: "clamp(2.2rem, 6vw, 4.8rem)",
  lineHeight: 0.95,
  letterSpacing: "-0.06em",
};

const leadStyle = {
  maxWidth: "840px",
  margin: "1.25rem 0 0",
  color: "rgba(247, 243, 248, 0.78)",
  fontSize: "clamp(1rem, 2vw, 1.16rem)",
  lineHeight: 1.7,
};

const heroActionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.8rem",
  marginTop: "1.4rem",
};

const primaryLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
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

const statusGridStyle = {
  maxWidth: "1180px",
  margin: "0 auto 1.5rem",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "1rem",
};

const statusCardStyle = {
  padding: "1.15rem",
  borderRadius: "22px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "rgba(255, 255, 255, 0.055)",
};

const toneStyle = {
  ok: {
    boxShadow: "inset 0 0 0 1px rgba(79, 209, 131, 0.10)",
  },
  warn: {
    boxShadow: "inset 0 0 0 1px rgba(255, 199, 102, 0.12)",
  },
};

const cardLabelStyle = {
  color: "#f08fc0",
  fontSize: "0.72rem",
  fontWeight: 900,
  letterSpacing: "0.11em",
  textTransform: "uppercase",
};

const cardTitleStyle = {
  margin: "0.55rem 0 0.4rem",
  fontSize: "1.18rem",
};

const cardValueStyle = {
  display: "block",
  marginBottom: "0.55rem",
  color: "#ffffff",
};

const cardTextStyle = {
  margin: 0,
  color: "rgba(247, 243, 248, 0.72)",
  lineHeight: 1.6,
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
  maxWidth: "380px",
  margin: 0,
  color: "rgba(247, 243, 248, 0.62)",
  lineHeight: 1.55,
};

const pageGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "0.8rem",
};

const pageCardStyle = {
  display: "grid",
  gap: "0.4rem",
  minHeight: "130px",
  padding: "1rem",
  borderRadius: "18px",
  color: "#f7f3f8",
  textDecoration: "none",
  background: "rgba(255, 255, 255, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const pageStateStyle = {
  color: "#ffd7ea",
  fontSize: "0.72rem",
  fontWeight: 900,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const twoColumnStyle = {
  maxWidth: "1180px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "1rem",
};

const actionListStyle = {
  display: "grid",
  gap: "0.85rem",
  marginTop: "1rem",
};

const actionItemStyle = {
  display: "grid",
  gridTemplateColumns: "42px 1fr",
  gap: "0.85rem",
  alignItems: "start",
  padding: "0.95rem",
  borderRadius: "18px",
  background: "rgba(255, 255, 255, 0.05)",
};

const actionStepStyle = {
  display: "inline-grid",
  placeItems: "center",
  width: 38,
  height: 38,
  borderRadius: "50%",
  color: "#170d13",
  background: "#f08fc0",
  fontWeight: 900,
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

const notesGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "0.8rem",
  marginTop: "1rem",
};

const noteStyle = {
  margin: 0,
  padding: "0.95rem",
  borderRadius: "18px",
  lineHeight: 1.6,
  color: "rgba(247, 243, 248, 0.74)",
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
