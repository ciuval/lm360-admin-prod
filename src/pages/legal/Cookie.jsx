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
          Questa pagina descrive in modo sintetico e trasparente l’uso di cookie,
          localStorage e tecnologie analoghe all’interno di LoveMatch360. Gli
          analytics non essenziali vengono attivati solo dopo consenso esplicito.
        </p>
      </header>

      <section style={styles.section} aria-labelledby="cookie-section-1">
        <h2 id="cookie-section-1" style={styles.h2}>
          1. Cosa sono cookie e tecnologie analoghe
        </h2>

        <p style={styles.p}>
          Cookie, localStorage e tecnologie analoghe possono essere usati per far
          funzionare correttamente il sito, ricordare alcune preferenze, proteggere
          la sessione e, solo quando l’utente lo accetta, misurare in forma
          minimizzata l’utilizzo del servizio.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-2">
        <h2 id="cookie-section-2" style={styles.h2}>
          2. Tipologie utilizzate
        </h2>

        <ul style={styles.ul}>
          <li style={styles.li}>
            <strong>Cookie e tecnologie tecniche:</strong> necessari al
            funzionamento essenziale della piattaforma, alla sicurezza e alla
            navigazione.
          </li>

          <li style={styles.li}>
            <strong>Preferenze locali:</strong> alcune scelte possono essere
            salvate nel browser tramite localStorage, per esempio la chiave
            <code> cmp.analytics </code> che ricorda la scelta sugli analytics.
          </li>

          <li style={styles.li}>
            <strong>Analytics opzionali:</strong> Vercel Analytics e gli eventi
            analytics custom di LoveMatch360 vengono attivati solo se l’utente
            accetta gli analytics.
          </li>

          <li style={styles.li}>
            <strong>Terze parti:</strong> alcuni fornitori tecnici, come Vercel e
            Supabase, possono essere coinvolti solo per le funzionalità realmente
            attive e necessarie.
          </li>
        </ul>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-3">
        <h2 id="cookie-section-3" style={styles.h2}>
          3. Consenso analytics
        </h2>

        <p style={styles.p}>
          Quando non è presente una scelta salvata, LoveMatch360 mostra un banner
          con due azioni: <strong>Rifiuta</strong> e <strong>Accetta</strong>.
        </p>

        <ul style={styles.ul}>
          <li style={styles.li}>
            Se l’utente clicca <strong>Rifiuta</strong>, viene salvato
            <code> cmp.analytics = false </code> e gli analytics opzionali non
            vengono montati.
          </li>

          <li style={styles.li}>
            Se l’utente clicca <strong>Accetta</strong>, viene salvato
            <code> cmp.analytics = true </code> e gli analytics opzionali possono
            essere attivati.
          </li>

          <li style={styles.li}>
            Se la scelta viene rimossa dal browser, il banner può essere mostrato
            nuovamente.
          </li>
        </ul>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-4">
        <h2 id="cookie-section-4" style={styles.h2}>
          4. Analytics custom e minimizzazione
        </h2>

        <p style={styles.p}>
          Gli eventi analytics custom vengono inviati solo dopo consenso e sono
          progettati per ridurre il rischio di dati personali: nomi evento, percorso
          e proprietà vengono sanitizzati, limitati e filtrati per evitare email,
          token, URL sensibili, messaggi, dati pagamento, foto o altri contenuti
          personali.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-5">
        <h2 id="cookie-section-5" style={styles.h2}>
          5. Cosa non usiamo in questa fase
        </h2>

        <p style={styles.p}>
          In questa fase LoveMatch360 non dichiara l’uso di cookie marketing,
          remarketing o profilazione pubblicitaria personalizzata. Se verranno
          introdotte integrazioni di questo tipo, la Cookie Policy e i controlli di
          consenso dovranno essere aggiornati prima dell’attivazione.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-6">
        <h2 id="cookie-section-6" style={styles.h2}>
          6. Gestione delle preferenze
        </h2>

        <p style={styles.p}>
          L’utente può gestire o cancellare le preferenze tramite gli strumenti del
          browser. La cancellazione della chiave <code>cmp.analytics</code> può far
          riapparire il banner di consenso. La disattivazione degli analytics non
          impedisce l’uso delle funzioni principali del sito.
        </p>
      </section>

      <section style={styles.section} aria-labelledby="cookie-section-7">
        <h2 id="cookie-section-7" style={styles.h2}>
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
        I contatti pubblici mostrati in questa pagina sono destinati a informazioni
        e assistenza. Le funzioni di gestione del sito restano disponibili solo per
        account autenticati con ruolo e permessi adeguati.
      </aside>
    </main>
  );
}
