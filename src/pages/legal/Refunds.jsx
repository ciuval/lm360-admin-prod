export default function RefundsPage() {
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
    <main style={styles.page} aria-labelledby="refunds-title">
      <header style={styles.header}>
        <span style={styles.eyebrow}>LoveMatch360</span>
        <h1 id="refunds-title" style={styles.h1}>
          Rimborsi
        </h1>
        <p style={styles.intro}>
          Questa pagina riassume in forma sintetica i principi generali relativi a
          rimborsi, annullamenti e richieste amministrative collegate a servizi a
          pagamento eventualmente attivi su LoveMatch360. Il testo completo ufficiale
          può essere reinserito dalla versione canonica senza modificare la struttura
          della pagina.
        </p>
      </header>

      <section style={styles.section} aria-labelledby="refunds-section-1">
        <h2 id="refunds-section-1" style={styles.h2}>
          1. Ambito
        </h2>
        <p style={styles.p}>
          Le presenti informazioni si applicano esclusivamente ai servizi o alle
          funzionalità effettivamente offerte a pagamento nel momento in cui vengono
          rese disponibili all’utente. La disponibilità di opzioni premium dipende
          dalla configurazione attiva del prodotto.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="refunds-section-2">
        <h2 id="refunds-section-2" style={styles.h2}>
          2. Valutazione delle richieste
        </h2>
        <p style={styles.p}>
          Eventuali richieste di rimborso vengono valutate caso per caso, tenendo conto
          della normativa applicabile, dello stato del servizio, della natura della
          richiesta e delle condizioni operative effettivamente in vigore al momento
          dell’acquisto o dell’attivazione.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="refunds-section-3">
        <h2 id="refunds-section-3" style={styles.h2}>
          3. Casi che possono incidere sulla valutazione
        </h2>
        <ul style={styles.ul}>
          <li style={styles.li}>
            problemi tecnici documentati che abbiano impedito l’accesso al servizio;
          </li>
          <li style={styles.li}>
            attivazioni duplicate o errori materiali verificabili;
          </li>
          <li style={styles.li}>
            obblighi specifici previsti dalla normativa applicabile;
          </li>
          <li style={styles.li}>
            ulteriori circostanze amministrative o legali valutate in buona fede.
          </li>
        </ul>
      </section>

      <section style={styles.section} aria-labelledby="refunds-section-4">
        <h2 id="refunds-section-4" style={styles.h2}>
          4. Tempistiche e modalità
        </h2>
        <p style={styles.p}>
          Le tempistiche di gestione possono variare in base al metodo di pagamento,
          alla verifica amministrativa necessaria e agli eventuali controlli tecnici.
          L’eventuale accredito, quando dovuto, segue i tempi del circuito o del
          fornitore coinvolto.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="refunds-section-5">
        <h2 id="refunds-section-5" style={styles.h2}>
          5. Limitazioni
        </h2>
        <p style={styles.p}>
          La semplice interruzione volontaria dell’uso del servizio, in assenza di
          presupposti specifici o di obblighi di legge, potrebbe non comportare il
          diritto automatico a un rimborso. Restano ferme le tutele inderogabili
          previste dalla normativa applicabile.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="refunds-section-6">
        <h2 id="refunds-section-6" style={styles.h2}>
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
            <span style={styles.contactLabel}>Assistenza account, attivazioni e richieste amministrative</span>
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