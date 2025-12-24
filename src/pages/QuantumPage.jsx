import styles from "./QuantumPage.module.css";

const STATUS = {
  READY: "ready",
  READY_BETA: "ready-beta",
  COMING_SOON: "coming-soon",
};

const BLOCKS = [
  {
    intro:
      "Genera nuovi contatti e costruisci una presenza che vende anche quando non lavori.",
    items: [
      {
        title: "QUANTUM EMAIL™",
        desc: "Campagne persuasive automatizzate.",
        status: STATUS.READY,
      },
      {
        title: "QUANTUM ADS™",
        desc: "Copy pubblicitari testati e ottimizzati dall’AI.",
        status: STATUS.READY,
      },
      {
        title: "QUANTUM SMM SYSTEM™",
        desc: "Creazione e pubblicazione automatica di contenuti su tutti i social.",
        status: STATUS.COMING_SOON,
      },
      {
        title: "QUANTUM FUNNELS™",
        desc: "Sistemi di creazione contatti ad alte performance chiavi in mano.",
        status: STATUS.READY,
      },
    ],
    objective: "Generare un flusso costante di clienti qualificati ogni giorno.",
  },
  {
    intro:
      "Trasforma i contatti in clienti e riempi la tua agenda con appuntamenti di vendita automatizzati.",
    items: [
      {
        title: "QUANTUM CLOSING SYSTEM™",
        desc:
          "Sistemi di outreach e contatti che convertono i lead generati dal marketing in appuntamenti reali nel calendario.",
        status: STATUS.READY_BETA,
      },
      {
        title: "QUANTUM SCRIPTS™",
        desc:
          "Script di vendita e gestione obiezioni ottimizzati per chiudere con naturalezza.",
        status: STATUS.READY,
      },
      {
        title: "QUANTUM CLONE AI™",
        desc: "Produzione video e webinar con il tuo clone AI.",
        status: STATUS.COMING_SOON,
      },
    ],
    objective:
      "Aumentare le conversioni e rendere ogni contatto un potenziale cliente pagante.",
  },
  {
    intro: "Automatizza la gestione quotidiana e libera tempo prezioso.",
    items: [
      {
        title: "QUANTUM EXECUTIVE ASSISTANT™",
        desc: "Invio promemoria, contratti, follow-up ai clienti e invio fatture.",
        status: STATUS.READY,
      },
      {
        title: "QUANTUM CHATTER SYSTEM™",
        desc: "Chat AI che gestisce clienti e conversazioni in autonomia.",
        status: STATUS.READY,
      },
      {
        title: "QUANTUM DATA & DECISIONS™",
        desc: "Dashboard AI che analizza risultati e suggerisce azioni.",
        status: STATUS.READY,
      },
    ],
    objective:
      "Ridurre la complessità e permetterti di concentrarti su ciò che conta davvero.",
  },
];

function CheckSquareIcon({ className }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7 12.2l3 3.1L17.5 8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 3.5h11A2 2 0 0 1 19.5 5.5v13A2 2 0 0 1 17.5 20.5h-11A2 2 0 0 1 4.5 18.5v-13A2 2 0 0 1 6.5 3.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        opacity="0.9"
      />
    </svg>
  );
}

function StatusIcon({ status }) {
  if (status === STATUS.COMING_SOON) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 7v6l4 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        />
      </svg>
    );
  }

  // READY / READY-BETA
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 6L9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusBadge({ status }) {
  const label =
    status === STATUS.READY
      ? "READY"
      : status === STATUS.READY_BETA
      ? "READY-BETA"
      : "COMING SOON";

  const cls =
    status === STATUS.COMING_SOON
      ? styles.statusSoon
      : status === STATUS.READY_BETA
      ? styles.statusBeta
      : styles.statusReady;

  return (
    <span className={`${styles.status} ${cls}`}>
      <StatusIcon status={status} />
      {label}
    </span>
  );
}

function QuantumBlock({ intro, items, objective }) {
  return (
    <section className={styles.darkBlock}>
      <p className={styles.blockIntro}>{intro}</p>

      <ul className={styles.items}>
        {items.map((it) => (
          <li key={it.title} className={styles.item}>
            <div className={styles.itemLeft}>
              <div className={styles.checkBox}>
                <CheckSquareIcon className={styles.checkIcon} />
              </div>
              <StatusBadge status={it.status} />
            </div>

            <div className={styles.itemBody}>
              <h3 className={styles.itemTitle}>{it.title}</h3>
              <p className={styles.itemDesc}>{it.desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.objective} role="note" aria-label="Obiettivo">
        <div className={styles.objectiveLabel}>OBIETTIVO:</div>
        <p className={styles.objectiveText}>{objective}</p>
      </div>
    </section>
  );
}

export default function QuantumPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.h1}>MASTER LEAD SYSTEM</h1>
          <p className={styles.sub}>
            Una suite modulare: contatti, conversioni, automazioni. Tutto nello stesso ritmo.
          </p>
        </header>

        {BLOCKS.map((b, idx) => (
          <QuantumBlock
            key={idx}
            intro={b.intro}
            items={b.items}
            objective={b.objective}
          />
        ))}

        <section className={styles.scenarioSection} aria-label="Bivio imprenditoriale">
          <div className={styles.scenarioHero}>
            <h2>Il bivio imprenditoriale: gestirti tutto da solo o continuare con supporto e ottimizzazione</h2>
            <p>
              Ora che il <span className={styles.heroStrong}>MASTER LEAD SYSTEM</span> è installato, puoi manifestare uno di questi due scenari…
            </p>
          </div>

          <div className={styles.scenarioBody}>
            <div className={styles.scenarioGrid}>
              <article className={styles.card}>
                <h3 className={styles.cardTitle}>SCENARIO 1: Gestirti il sistema in autonomia</h3>
                <p className={styles.cardText}>
                  Puoi farlo, ed è una scelta perfettamente legittima.
                  <br />
                  <span className={styles.muted}>Ma va considerato cosa significa, in pratica.</span>
                </p>

                <ol className={styles.cardList}>
                  <li>
                    <span className={styles.emph}>Dovrai sostenere i costi della forza lavoro AI.</span>
                    <div className={styles.muted}>(+€1.500 al mese tra agenti e strumenti)</div>
                  </li>
                  <li>
                    <span className={styles.emph}>Dovrai occuparti tu della gestione tecnica e degli aggiornamenti.</span>
                    <div className={styles.muted}>
                      Gli agenti AI richiedono sincronizzazione, piccoli aggiustamenti, manutenzione e controllo periodico.
                      Ogni ottimizzazione, test o problema ricade sulle tue spalle.
                    </div>
                  </li>
                  <li>
                    <span className={styles.emph}>Dovrai investire tempo ed energia per mantenere la stessa fluidità che hai ora.</span>
                    <div className={styles.muted}>
                      Niente di impossibile, ma sicuramente più impegnativo. È un’opzione valida se ami gestire personalmente il sistema
                      o se vuoi prenderti carico della parte tecnica <span className={styles.emph}>INVESTENDO TEMPO</span> nel gestire la tua presenza digitale.
                    </div>
                  </li>
                </ol>
              </article>

              <article className={styles.card}>
                <h3 className={styles.cardTitle}>SCENARIO 2: Confermare il tuo AI Manager</h3>

                <p className={styles.cardText}>
                  In questo scenario tutto ciò che hai costruito continua ad evolvere, migliorare e funzionare senza che tu debba toccare nulla.
                </p>

                <p className={styles.cardText}>
                  <span className={styles.emph}>Confermando l’AI Manager:</span>
                </p>

                <ul className={styles.cardList}>
                  <li>tu investi solo nel suo supporto</li>
                  <li><span className={styles.emph}>noi paghiamo per te tutta la forza lavoro AI</span></li>
                  <li>gli aggiornamenti vengono installati in automatico</li>
                  <li>il sistema rimane collegato al codice madre</li>
                  <li>il tuo business continua a scalare mentre tu resti focalizzato sulla strategia</li>
                  <li>non devi assumere né formare collaboratori tecnici</li>
                  <li>mantieni la stessa fluidità e facilità delle ultime 12 settimane</li>
                </ul>

                <p className={styles.cardText}>
                  Non è una scelta “necessaria”.<br />
                  <span className={styles.emph}>È una scelta estremamente vantaggiosa.</span>
                </p>

                <p className={styles.cardText}>
                  È la differenza tra avere un ottimo sistema…<br />
                  e avere un sistema che continua a migliorare mese dopo mese mentre tu pensi solo alla crescita.
                </p>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
