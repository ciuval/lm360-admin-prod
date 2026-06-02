const pageData = {
  impostazioni: {
    eyebrow: "Impostazioni",
    title: "Impostazioni vive e sicure.",
    lead: "Qui l utente trova percorsi chiari per profilo, privacy, notifiche e sicurezza. Le modifiche reali restano guidate e senza scorciatoie dal browser.",
    cards: [
      { label: "Account", title: "Stato account", text: "Controlla il percorso account senza modificare dati dal browser. Gli stati reali si cambiano solo con procedura, audit e postcheck.", actions: [{ label: "Vai al profilo", href: "#/profilo" }, { label: "Apri admin", href: "#/admin" }] },
      { label: "Notifiche", title: "Centro notifiche", text: "Le notifiche operative sono separate dalle email reali. Le code admin restano pending finche il sender server-side non viene attivato.", actions: [{ label: "Apri notifiche", href: "#/notifiche" }] },
      { label: "Privacy", title: "Dati e preferenze", text: "Le preferenze utente devono essere chiare, reversibili e senza esposizione di dati sensibili.", actions: [{ label: "Privacy", href: "#/privacy" }, { label: "Sicurezza", href: "#/sicurezza" }] },
      { label: "Owner", title: "Area operativa", text: "Owner puo orientarsi in tutte le aree, ma le azioni live restano separate: preflight, conferma, esecuzione e postcheck.", actions: [{ label: "Manuale admin", href: "#/admin" }] },
    ],
  },
  notifiche: {
    eyebrow: "Notifiche",
    title: "Notifiche chiare, niente invii nascosti.",
    lead: "Questa pagina spiega cosa succede alle notifiche: stato pending, email reali solo server-side e nessun segreto nel client.",
    cards: [
      { label: "Queue", title: "Notification queue", text: "Le notifiche admin vengono registrate in coda. Il browser non invia email e non contiene segreti.", actions: [{ label: "Manuale admin", href: "#/admin" }] },
      { label: "Email", title: "servizioclienti", text: "Le notifiche operative sono indirizzate a servizioclienti. L invio reale arrivera solo con funzione server-side e dry run completato.", actions: [{ label: "Contatti", href: "#/contatti" }] },
      { label: "Stati", title: "Pending, sent, failed", text: "Pending significa pronta ma non inviata. Sent e failed verranno gestiti solo dal sender server-side.", actions: [{ label: "Log admin", href: "#/log-admin" }] },
      { label: "Sicurezza", title: "Niente segreti nel client", text: "API key, service role e segreti email non devono mai stare nelle pagine React.", actions: [{ label: "Sicurezza", href: "#/sicurezza" }] },
    ],
  },
  funzioni: {
    eyebrow: "Funzioni",
    title: "Mappa funzioni del sito.",
    lead: "Una panoramica delle funzioni vive e delle funzioni in preparazione. Ogni blocco viene attivato solo quando e sicuro.",
    cards: [
      { label: "Utente", title: "Profilo, Scopri, Match", text: "Il percorso principale e profilo, scoperta e match reciproco. Le pagine sono pronte anche quando la base utenti e vuota.", actions: [{ label: "Profilo", href: "#/profilo" }, { label: "Scopri", href: "#/scopri" }, { label: "Match", href: "#/match" }] },
      { label: "Trust", title: "Pagine pubbliche", text: "Contatti, FAQ, sicurezza, termini, rimborsi e chi siamo danno fiducia e chiarezza al sito.", actions: [{ label: "FAQ", href: "#/faq" }, { label: "Come funziona", href: "#/come-funziona" }] },
      { label: "Admin", title: "Gestione sicura", text: "Owner e admin hanno guide operative. Le modifiche live non partono dal browser.", actions: [{ label: "Admin", href: "#/admin" }, { label: "Log admin", href: "#/log-admin" }] },
      { label: "Futuro", title: "Premium e notifiche", text: "Premium, Super Premium e email operative sono progettati, ma non attivati commercialmente.", actions: [{ label: "Premium", href: "#/premium" }, { label: "Notifiche", href: "#/notifiche" }] },
    ],
  },
  profiliPubblici: {
    eyebrow: "Profili pubblici",
    title: "Profili pubblici senza caos.",
    lead: "La pagina prepara la visibilita futura dei profili senza mostrare dati sensibili o righe live dal browser.",
    cards: [
      { label: "Visibilita", title: "Solo profili pronti", text: "Quando il sito avra utenti reali, la visibilita pubblica dovra rispettare stato account, privacy e qualita profilo.", actions: [{ label: "Completa profilo", href: "#/profilo" }] },
      { label: "Scoperta", title: "Usa Scopri", text: "La discovery protetta resta il punto principale per vedere profili nel percorso utente.", actions: [{ label: "Vai a Scopri", href: "#/scopri" }] },
      { label: "Sicurezza", title: "Niente dati inutili", text: "Nessuna email, UUID o dato sensibile deve essere pubblicato nella pagina.", actions: [{ label: "Sicurezza", href: "#/sicurezza" }] },
      { label: "Moderazione", title: "Review prima della crescita", text: "Quando arrivano clienti reali, i profili pubblici dovranno passare da regole di stato e moderazione.", actions: [{ label: "Admin", href: "#/admin" }] },
    ],
  },
  visitatori: {
    eyebrow: "Visitatori",
    title: "Visitatori: stati, supporto e procedure.",
    lead: "Area owner/admin per preparare interventi sui visitatori: stato account, supporto, review e motivazione. Non legge dati live e non modifica account dal browser.",
    cards: [
      { label: "Stati", title: "Attivo, review, sospeso", text: "Attivo, review e sospeso sono decisioni operative. Prima si raccoglie il motivo, poi si prepara una procedura separata con preflight e postcheck.", actions: [{ label: "Manuale admin", href: "#/admin" }] },
      { label: "Supabase", title: "Procedure con preflight", text: "Le modifiche reali si preparano fuori dal browser: audit, conferma esplicita, esecuzione controllata e postcheck leggibile.", actions: [{ label: "Sicurezza", href: "#/sicurezza" }] },
      { label: "Supporto", title: "Problemi utente", text: "Ogni problema va trattato con motivo scritto e senza esporre dati sensibili in chat o browser.", actions: [{ label: "Contatti", href: "#/contatti" }] },
      { label: "Log", title: "Traccia prima di agire", text: "Le modifiche importanti devono generare audit log e notification queue verso servizioclienti.", actions: [{ label: "Log admin", href: "#/log-admin" }] },
    ],
  },
  logAdmin: {
    eyebrow: "Log admin",
    title: "Log admin: decisioni, audit e notifiche.",
    lead: "Qui si spiega come usare audit log e notification queue senza mostrare righe reali, identificativi o dati personali.",
    cards: [
      { label: "Audit", title: "Ogni azione importante lascia traccia", text: "Ruoli, permessi, owner, admin temporanei e Premium manuale devono lasciare una traccia chiara: azione, motivo, esito e notifica.", actions: [{ label: "Admin", href: "#/admin" }] },
      { label: "Queue", title: "Notifiche pending", text: "Ogni cambiamento operativo deve creare una notifica verso servizioclienti. L email reale resta server-side e mai nel browser.", actions: [{ label: "Notifiche", href: "#/notifiche" }] },
      { label: "Sicurezza", title: "No dati sensibili", text: "Log pubblicati o visibili in UI devono essere aggregati o mascherati.", actions: [{ label: "Sicurezza", href: "#/sicurezza" }] },
      { label: "Procedure", title: "Niente scorciatoie", text: "Non usare pulsanti rapidi per cancellare o promuovere utenti. Prima serve una procedura separata.", actions: [{ label: "Manuale owner", href: "#/admin" }] },
    ],
  },
  logStats: {
    eyebrow: "Log stats",
    title: "Log stats: segnali aggregati e qualita sito.",
    lead: "Area per preparare metriche sicure: pagine visitate, smoke test, errori visibili, stato deploy e segnali aggregati. Nessuna lettura live dal browser.",
    cards: [
      { label: "Deploy", title: "Stato produzione", text: "Ogni rilascio deve avere Vercel Ready, build OK, smoke production e nessuna regressione visibile.", actions: [{ label: "Admin", href: "#/admin" }] },
      { label: "Errori", title: "Console e schema errors", text: "Gli smoke devono registrare console errors, pagine non trovate e regressioni visibili.", actions: [{ label: "FAQ", href: "#/faq" }] },
      { label: "Utenti", title: "Solo aggregati", text: "Quando arriveranno clienti reali, le statistiche dovranno restare aggregate, mascherate e coerenti con privacy e consenso.", actions: [{ label: "Privacy", href: "#/privacy" }] },
      { label: "Crescita", title: "Misurare senza forzare", text: "Prima stabilita e fiducia, poi crescita commerciale. Stripe resta dormiente finche non serve.", actions: [{ label: "Funzioni", href: "#/funzioni" }] },
    ],
  },
};

function OperationalPage({ data }) {
  return (
    <main style={pageStyle} aria-labelledby="operational-page-title">
      <section style={heroStyle}>
        <span style={eyebrowStyle}>{data.eyebrow}</span>
        <h1 id="operational-page-title" style={titleStyle}>{data.title}</h1>
        <p style={leadStyle}>{data.lead}</p>
      </section>

      <section style={gridStyle} aria-label="Opzioni operative">
        {data.cards.map((card) => (
          <article key={card.title} style={cardStyle}>
            <span style={cardLabelStyle}>{card.label}</span>
            <h2 style={cardTitleStyle}>{card.title}</h2>
            <p style={cardTextStyle}>{card.text}</p>
            {card.actions && card.actions.length ? (
              <div style={actionsStyle}>
                {card.actions.map((action) => (
                  <a key={action.href + action.label} href={action.href} style={actionLinkStyle}>
                    {action.label}
                  </a>
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}

export function Impostazioni() {
  return <OperationalPage data={pageData.impostazioni} />;
}

export function Notifiche() {
  return <OperationalPage data={pageData.notifiche} />;
}

export function Funzioni() {
  return <OperationalPage data={pageData.funzioni} />;
}

export function ProfiliPubblici() {
  return <OperationalPage data={pageData.profiliPubblici} />;
}

export function Visitatori() {
  return <OperationalPage data={pageData.visitatori} />;
}

export function LogAdmin() {
  return <OperationalPage data={pageData.logAdmin} />;
}

export function LogStats() {
  return <OperationalPage data={pageData.logStats} />;
}

const pageStyle = {
  minHeight: "100vh",
  padding: "clamp(1.25rem, 3vw, 3rem)",
  color: "#f7f3f8",
  background: "radial-gradient(circle at top left, rgba(240, 143, 192, 0.14), transparent 34rem), #090a0d",
};

const heroStyle = {
  maxWidth: "1120px",
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
  maxWidth: "900px",
  fontSize: "clamp(2.1rem, 5vw, 4.4rem)",
  lineHeight: 0.98,
  letterSpacing: "-0.055em",
};

const leadStyle = {
  maxWidth: "820px",
  margin: "1.1rem 0 0",
  color: "rgba(247, 243, 248, 0.76)",
  fontSize: "clamp(1rem, 2vw, 1.15rem)",
  lineHeight: 1.7,
};

const gridStyle = {
  maxWidth: "1120px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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

const actionsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.55rem",
  marginTop: "1rem",
};

const actionLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.62rem 0.72rem",
  borderRadius: "999px",
  color: "#f7f3f8",
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.13)",
  fontWeight: 800,
  textDecoration: "none",
};
