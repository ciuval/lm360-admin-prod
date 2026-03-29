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
      maxWidth: 760,
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
          Questa pagina descrive, in modo sintetico e trasparente, come vengono trattati
          i dati personali all’interno di LoveMatch360. Il testo completo ufficiale può
          essere aggiornato dalla versione canonica senza alterare la struttura della pagina.
        </p>
      </header>

      <section style={styles.section} aria-labelledby="privacy-section-1">
        <h2 id="privacy-section-1" style={styles.h2}>
          1. Finalità del trattamento
        </h2>
        <p style={styles.p}>
          I dati personali possono essere trattati per consentire l’accesso alla piattaforma,
          la gestione del profilo, le funzionalità di matching, la sicurezza dell’account,
          il supporto tecnico e gli adempimenti amministrativi o legali applicabili.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-2">
        <h2 id="privacy-section-2" style={styles.h2}>
          2. Dati trattati
        </h2>
        <p style={styles.p}>
          I dati trattati dipendono dalle funzionalità utilizzate dall’utente e possono
          includere informazioni anagrafiche di base, dati di accesso, contenuti del profilo
          e dati strettamente necessari al funzionamento del servizio.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-3">
        <h2 id="privacy-section-3" style={styles.h2}>
          3. Base giuridica
        </h2>
        <p style={styles.p}>
          Il trattamento può basarsi sull’esecuzione del servizio richiesto dall’utente,
          sull’adempimento di obblighi di legge, sul legittimo interesse del titolare nei
          limiti consentiti dalla normativa e, quando necessario, sul consenso espresso.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-4">
        <h2 id="privacy-section-4" style={styles.h2}>
          4. Conservazione dei dati
        </h2>
        <p style={styles.p}>
          I dati sono conservati per il tempo strettamente necessario alle finalità per cui
          sono stati raccolti, salvo obblighi di legge o esigenze documentate di sicurezza,
          tutela dei diritti o prevenzione di abusi.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-5">
        <h2 id="privacy-section-5" style={styles.h2}>
          5. Diritti dell’utente
        </h2>
        <p style={styles.p}>
          L’utente può esercitare i diritti previsti dalla normativa applicabile, inclusi
          accesso, rettifica, cancellazione, limitazione del trattamento, opposizione e,
          ove previsto, portabilità dei dati.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-6">
        <h2 id="privacy-section-6" style={styles.h2}>
          6. Sicurezza
        </h2>
        <p style={styles.p}>
          LoveMatch360 adotta misure tecniche e organizzative proporzionate per ridurre i
          rischi di accessi non autorizzati, perdita, uso improprio o alterazione dei dati.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="privacy-section-7">
        <h2 id="privacy-section-7" style={styles.h2}>
          7. Contatti e aggiornamenti
        </h2>
        <p style={styles.p}>
          In caso di necessità puoi contattarci attraverso i riferimenti qui sotto.
          Fa fede la versione pubblicata in questa sezione del sito.
        </p>

        <div style={styles.contactList}>
          <div style={styles.contactCard}>
            <span style={styles.contactLabel}>Informazioni generali</span>
            <a href="mailto:info@lovematch360.com" style={styles.contactLink}>
              info@lovematch360.com
            </a>
          </div>

          <div style={styles.contactCard}>
            <span style={styles.contactLabel}>Assistenza account e supporto utenti</span>
            <a href="mailto:servizioclienti@lovematch360.com" style={styles.contactLink}>
              servizioclienti@lovematch360.com
            </a>
          </div>
        </div>
      </section>

      <aside style={styles.note} aria-label="Nota informativa">
        Gli account interni del personale possono avere funzioni di gestione del sito solo
        in base ai permessi associati al ruolo dell’account autenticato. I contatti pubblici
        mostrati in questa pagina servono per informazioni e assistenza, non come prova di
        autorizzazione amministrativa.
      </aside>
    </main>
  );
}