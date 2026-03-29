export default function CookiePage() {
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
    ul: {
      marginTop: 12,
      marginBottom: 0,
      paddingLeft: 20,
      lineHeight: 1.75,
      opacity: 0.92,
    },
    li: {
      marginBottom: 8,
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
    <main style={styles.page} aria-labelledby="cookie-title">
      <header style={styles.header}>
        <span style={styles.eyebrow}>LoveMatch360</span>
        <h1 id="cookie-title" style={styles.h1}>
          Cookie Policy
        </h1>
        <p style={styles.intro}>
          Questa pagina descrive in modo sintetico l’uso dei cookie e di tecnologie
          simili all’interno di LoveMatch360. Il testo completo ufficiale può essere
          reinserito dalla versione canonica senza modificare la struttura della pagina.
        </p>
      </header>

      <section style={styles.section} aria-labelledby="cookie-section-1">
        <h2 id="cookie-section-1" style={styles.h2}>
          1. Cosa sono i cookie
        </h2>
        <p style={styles.p}>
          I cookie sono piccoli file o identificatori tecnici che possono essere
          utilizzati per far funzionare correttamente il sito, ricordare preferenze,
          migliorare l’esperienza d’uso e raccogliere informazioni aggregate sul
          funzionamento del servizio.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-2">
        <h2 id="cookie-section-2" style={styles.h2}>
          2. Tipologie di cookie
        </h2>
        <ul style={styles.ul}>
          <li style={styles.li}>
            Cookie tecnici, necessari al funzionamento essenziale della piattaforma.
          </li>
          <li style={styles.li}>
            Cookie funzionali, utili a ricordare preferenze e impostazioni.
          </li>
          <li style={styles.li}>
            Cookie analitici, ove utilizzati, per comprendere in forma aggregata come
            viene usato il servizio.
          </li>
          <li style={styles.li}>
            Eventuali cookie di terze parti, nei limiti delle integrazioni attive e
            realmente presenti nel prodotto.
          </li>
        </ul>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-3">
        <h2 id="cookie-section-3" style={styles.h2}>
          3. Finalità dell’utilizzo
        </h2>
        <p style={styles.p}>
          I cookie possono essere impiegati per garantire sessioni stabili, sicurezza,
          continuità di navigazione, memorizzazione di preferenze e analisi tecniche
          aggregate finalizzate al miglioramento del prodotto.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-4">
        <h2 id="cookie-section-4" style={styles.h2}>
          4. Gestione delle preferenze
        </h2>
        <p style={styles.p}>
          L’utente può gestire o limitare i cookie attraverso le impostazioni del proprio
          browser o tramite gli eventuali strumenti di consenso presenti sul sito, quando
          applicabili. La disattivazione di alcuni cookie può influire su determinate
          funzionalità della piattaforma.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-5">
        <h2 id="cookie-section-5" style={styles.h2}>
          5. Terze parti
        </h2>
        <p style={styles.p}>
          Alcune funzionalità possono coinvolgere servizi terzi realmente attivi nel
          progetto. In tali casi, il trattamento tramite tecnologie analoghe ai cookie
          dipende anche dalle rispettive policy dei fornitori coinvolti.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-6">
        <h2 id="cookie-section-6" style={styles.h2}>
          6. Contatti e aggiornamenti
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
        I contatti pubblici mostrati in questa pagina sono destinati a informazioni e
        assistenza. Le funzioni di gestione del sito restano disponibili solo per gli
        account autenticati con ruolo e permessi adeguati.
      </aside>
    </main>
  );
}