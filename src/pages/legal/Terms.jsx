export default function TermsPage() {
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
    <main style={styles.page} aria-labelledby="terms-title">
      <header style={styles.header}>
        <span style={styles.eyebrow}>LoveMatch360</span>
        <h1 id="terms-title" style={styles.h1}>
          Termini e Condizioni
        </h1>
        <p style={styles.intro}>
          Questa pagina riassume in forma sintetica le principali condizioni di utilizzo
          di LoveMatch360. Il testo completo ufficiale può essere reinserito dalla
          versione canonica senza modificare la struttura della pagina.
        </p>
      </header>

      <section style={styles.section} aria-labelledby="terms-section-1">
        <h2 id="terms-section-1" style={styles.h2}>
          1. Oggetto del servizio
        </h2>
        <p style={styles.p}>
          LoveMatch360 offre funzionalità digitali dedicate alla creazione del profilo,
          alla scoperta di altri profili, alle interazioni tra utenti e alle ulteriori
          funzioni disponibili in base allo stato del servizio e al livello di accesso.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="terms-section-2">
        <h2 id="terms-section-2" style={styles.h2}>
          2. Accesso e responsabilità dell’utente
        </h2>
        <p style={styles.p}>
          L’utente è responsabile delle informazioni inserite nel proprio account,
          dell’uso corretto delle funzionalità disponibili e del rispetto delle regole
          di comportamento applicabili alla piattaforma.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="terms-section-3">
        <h2 id="terms-section-3" style={styles.h2}>
          3. Uso consentito della piattaforma
        </h2>
        <ul style={styles.ul}>
          <li style={styles.li}>
            È richiesto un utilizzo lecito, corretto e non lesivo dei diritti altrui.
          </li>
          <li style={styles.li}>
            Non è consentito usare il servizio per finalità abusive, fraudolente o
            contrarie alla normativa applicabile.
          </li>
          <li style={styles.li}>
            Contenuti, messaggi e informazioni condivise devono rispettare il contesto
            della piattaforma e gli standard minimi di sicurezza e rispetto reciproco.
          </li>
        </ul>
      </section>

      <section style={styles.section} aria-labelledby="terms-section-4">
        <h2 id="terms-section-4" style={styles.h2}>
          4. Account, limitazioni e sospensione
        </h2>
        <p style={styles.p}>
          L’accesso ad alcune funzioni può dipendere dallo stato dell’account, dal
          livello di abilitazione disponibile e dalle policy interne di sicurezza. In
          presenza di violazioni, anomalie o uso improprio, il servizio può limitare,
          sospendere o interrompere l’accesso nei limiti consentiti.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="terms-section-5">
        <h2 id="terms-section-5" style={styles.h2}>
          5. Funzionalità premium e servizi collegati
        </h2>
        <p style={styles.p}>
          Alcune funzionalità possono essere accessibili solo in presenza di specifici
          livelli di abilitazione o servizi collegati. L’effettiva disponibilità delle
          funzioni dipende dalla configurazione attiva del prodotto al momento dell’uso.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="terms-section-6">
        <h2 id="terms-section-6" style={styles.h2}>
          6. Disponibilità del servizio
        </h2>
        <p style={styles.p}>
          LoveMatch360 può aggiornare, modificare o ottimizzare il servizio nel tempo.
          Potrebbero verificarsi sospensioni temporanee, manutenzioni, variazioni tecniche
          o aggiornamenti funzionali senza che ciò alteri la validità generale delle
          presenti condizioni.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="terms-section-7">
        <h2 id="terms-section-7" style={styles.h2}>
          7. Limitazione di responsabilità
        </h2>
        <p style={styles.p}>
          Nei limiti consentiti dalla legge applicabile, il servizio viene fornito secondo
          le condizioni operative disponibili al momento dell’utilizzo. Restano ferme le
          tutele inderogabili previste dalla normativa vigente.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="terms-section-8">
        <h2 id="terms-section-8" style={styles.h2}>
          8. Contatti e aggiornamenti
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