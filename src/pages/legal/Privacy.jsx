export default function PrivacyPage() {
  const styles = {
    page: {
      maxWidth: 960,
      margin: "0 auto",
      padding: "24px 16px 56px",
    },
    header: {
      marginBottom: 24,
    },
    eyebrow: {
      display: "inline-block",
      marginBottom: 10,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      opacity: 0.72,
    },
    h1: {
      margin: 0,
      fontSize: "clamp(2rem, 4vw, 2.5rem)",
      lineHeight: 1.1,
    },
    intro: {
      marginTop: 14,
      marginBottom: 0,
      maxWidth: 780,
      fontSize: 16,
      lineHeight: 1.7,
      opacity: 0.92,
    },
    section: {
      marginTop: 28,
      paddingTop: 20,
      borderTop: "1px solid rgba(255,255,255,0.08)",
    },
    h2: {
      margin: 0,
      fontSize: 22,
      lineHeight: 1.25,
    },
    p: {
      marginTop: 12,
      marginBottom: 0,
      fontSize: 16,
      lineHeight: 1.75,
      opacity: 0.92,
    },
    list: {
      marginTop: 12,
      marginBottom: 0,
      paddingLeft: 22,
      fontSize: 16,
      lineHeight: 1.75,
      opacity: 0.92,
    },
    contactList: {
      marginTop: 12,
      display: "grid",
      gap: 10,
    },
    contactCard: {
      padding: "14px 16px",
      borderRadius: 14,
      border: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.03)",
    },
    contactLabel: {
      display: "block",
      marginBottom: 6,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.02em",
      opacity: 0.72,
    },
    contactLink: {
      color: "#ffd7ea",
      textDecoration: "none",
      fontWeight: 600,
      wordBreak: "break-word",
    },
    note: {
      marginTop: 32,
      padding: 16,
      borderRadius: 16,
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      fontSize: 14,
      lineHeight: 1.7,
      opacity: 0.9,
    },
  };

  return (
    <main style={styles.page} aria-labelledby="privacy-title">
      <header style={styles.header}>
        <span style={styles.eyebrow}>LoveMatch360</span>

        <h1 id="privacy-title" style={styles.h1}>
          Informativa Privacy
        </h1>

        <p style={styles.intro}>
          Questa pagina descrive in modo sintetico e trasparente come LoveMatch360
          tratta i dati personali necessari al funzionamento del servizio, alla
          sicurezza, al supporto e alle comunicazioni con gli utenti.
        </p>
      </header>

      <section style={styles.section} aria-labelledby="privacy-section-controller">
        <h2 id="privacy-section-controller" style={styles.h2}>
          1. Titolare, gestore e contatti
        </h2>

        <p style={styles.p}>
          LoveMatch360 è il nome pubblico del servizio. Le richieste relative a
          privacy, account, assistenza e dati personali possono essere inviate ai
          contatti pubblici indicati in questa pagina. Eventuali dati identificativi
          amministrativi ulteriori del titolare o del gestore saranno pubblicati solo
          dopo verifica.
        </p>

        <div style={styles.contactList}>
          <div style={styles.contactCard}>
            <span style={styles.contactLabel}>Informazioni generali</span>
            <a href="mailto:info@lovematch360.com" style={styles.contactLink}>
              info@lovematch360.com
            </a>
          </div>

          <div style={styles.contactCard}>
            <span style={styles.contactLabel}>
              Privacy, account e supporto utenti
            </span>
            <a href="mailto:servizioclienti@lovematch360.com" style={styles.contactLink}>
              servizioclienti@lovematch360.com
            </a>
          </div>
        </div>

        <p style={styles.p}>
          Se un Responsabile della Protezione dei Dati, o DPO, sarà nominato e
          applicabile al servizio, il relativo contatto verrà pubblicato in questa
          informativa.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-purpose">
        <h2 id="privacy-section-purpose" style={styles.h2}>
          2. Finalità del trattamento
        </h2>

        <p style={styles.p}>
          I dati personali possono essere trattati per consentire l’accesso alla
          piattaforma, la creazione e gestione del profilo, il caricamento di foto,
          le funzionalità di matching, eventuali messaggi tra utenti, la sicurezza
          dell’account, il supporto tecnico, la gestione di consensi, pagamenti,
          rimborsi o segnalazioni e gli adempimenti amministrativi o legali
          applicabili.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-data">
        <h2 id="privacy-section-data" style={styles.h2}>
          3. Dati trattati
        </h2>

        <p style={styles.p}>
          I dati trattati dipendono dalle funzionalità utilizzate dall’utente e
          possono includere:
        </p>

        <ul style={styles.list}>
          <li>dati account, come email e identificativi tecnici;</li>
          <li>dati di profilo, bio, preferenze non sensibili e interessi;</li>
          <li>foto caricate dall’utente;</li>
          <li>like, match, messaggi e interazioni necessarie al servizio;</li>
          <li>dati tecnici di sicurezza e funzionamento;</li>
          <li>consensi e preferenze privacy/cookie;</li>
          <li>dati di pagamento gestiti tramite fornitori specializzati, quando attivi;</li>
          <li>eventi analytics minimizzati e sanitizzati, dove consentiti.</li>
        </ul>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-basis">
        <h2 id="privacy-section-basis" style={styles.h2}>
          4. Base giuridica
        </h2>

        <p style={styles.p}>
          Il trattamento può basarsi sull’esecuzione del servizio richiesto
          dall’utente, sull’adempimento di obblighi di legge, sul legittimo interesse
          alla sicurezza e al miglioramento del servizio nei limiti consentiti dalla
          normativa e, quando necessario, sul consenso espresso.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-retention">
        <h2 id="privacy-section-retention" style={styles.h2}>
          5. Conservazione dei dati
        </h2>

        <p style={styles.p}>
          I dati sono conservati per il tempo strettamente necessario alle finalità
          per cui sono stati raccolti, salvo obblighi di legge, richieste dell’utente
          o esigenze documentate di sicurezza, tutela dei diritti, prevenzione di
          abusi, gestione di pagamenti, rimborsi o controversie.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-providers">
        <h2 id="privacy-section-providers" style={styles.h2}>
          6. Fornitori tecnici e destinatari
        </h2>

        <p style={styles.p}>
          Per erogare il servizio possono essere coinvolti fornitori tecnici e
          piattaforme specializzate, limitatamente a quanto necessario al
          funzionamento di LoveMatch360.
        </p>

        <ul style={styles.list}>
          <li>Supabase, per autenticazione, database, storage e servizi backend;</li>
          <li>Vercel, per hosting, deployment e infrastruttura frontend;</li>
          <li>Stripe, per pagamenti, checkout e gestione amministrativa dei pagamenti, se attivi;</li>
          <li>eventuali strumenti analytics o email, solo se realmente configurati e necessari.</li>
        </ul>

        <p style={styles.p}>
          I fornitori possono trattare dati come responsabili, autonomi titolari o
          sub-responsabili secondo le rispettive condizioni, policy e configurazioni
          tecniche applicabili.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-rights">
        <h2 id="privacy-section-rights" style={styles.h2}>
          7. Diritti dell’utente
        </h2>

        <p style={styles.p}>
          L’utente può esercitare i diritti previsti dalla normativa applicabile,
          inclusi accesso, rettifica, cancellazione, limitazione del trattamento,
          opposizione, revoca del consenso e, ove previsto, portabilità dei dati.
          Le richieste possono essere inviate ai contatti indicati in questa
          informativa.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-complaint">
        <h2 id="privacy-section-complaint" style={styles.h2}>
          8. Reclamo all’autorità di controllo
        </h2>

        <p style={styles.p}>
          Se ritiene che il trattamento dei dati personali violi la normativa
          applicabile, l’utente può rivolgersi all’autorità di controllo competente,
          incluso il Garante per la protezione dei dati personali in Italia, secondo
          le modalità previste dall’autorità.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-security">
        <h2 id="privacy-section-security" style={styles.h2}>
          9. Sicurezza
        </h2>

        <p style={styles.p}>
          LoveMatch360 adotta misure tecniche e organizzative proporzionate per
          ridurre i rischi di accessi non autorizzati, perdita, uso improprio o
          alterazione dei dati. Il servizio viene migliorato progressivamente con
          controlli su permessi, RLS, logging e minimizzazione dei dati.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-updates">
        <h2 id="privacy-section-updates" style={styles.h2}>
          10. Aggiornamenti
        </h2>

        <p style={styles.p}>
          Questa informativa può essere aggiornata quando cambiano funzionalità,
          fornitori, basi giuridiche o processi operativi. Fa fede la versione
          pubblicata in questa sezione del sito.
        </p>
      </section>

      <aside style={styles.note} aria-label="Nota informativa">
        Gli account interni del personale possono avere funzioni di gestione del
        sito solo in base ai permessi associati al ruolo dell’account autenticato.
        I contatti pubblici mostrati in questa pagina servono per informazioni,
        assistenza e richieste privacy, non come prova di autorizzazione
        amministrativa.
      </aside>
    </main>
  );
}
