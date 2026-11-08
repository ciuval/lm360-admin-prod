import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function SitoClientiLocali() {
  return (
    <InfoPageTemplate
      eyebrow="Servizi web · Richieste reali"
      title="Un sito chiaro per chi lavora davvero."
      lead="Realizzazione e miglioramento di siti essenziali per artigiani, professionisti e piccole attività. L'obiettivo è presentare servizi, orari e contatti in modo semplice, leggibile da smartphone e facile da aggiornare. Prima valutiamo il lavoro: nessun acquisto o abbonamento automatico."
      cta={{ label: "Richiedi una valutazione gratuita", href: "mailto:info@lovematch360.com?subject=Richiesta%20valutazione%20sito%20web" }}
      secondaryCta={{ label: "Scopri come lavoriamo", href: "#/come-funziona" }}
      sections={[
        {
          label: "Il risultato",
          title: "Una presenza online utilizzabile",
          text: "Una pagina di presentazione dei servizi, informazioni essenziali, contatti diretti e navigazione adatta al cellulare. Le funzionalità vengono definite prima del lavoro, non promesse dopo.",
        },
        {
          label: "Da dove partiamo",
          title: "Anche da un sito già esistente",
          text: "Se il sito esiste già, si parte da un controllo di leggibilità, contenuti, navigazione mobile e chiarezza delle richieste di contatto. Si interviene soltanto dove serve.",
        },
        {
          label: "Come lavoriamo",
          title: "Prima accordo, poi sviluppo",
          text: "Riceviamo una descrizione dell'attività e del problema. Proponiamo uno scopo preciso, tempi indicativi e preventivo scritto. Nessun pagamento è richiesto da questa pagina.",
        },
        {
          label: "Fiducia",
          title: "Niente risultati inventati",
          text: "Non promettiamo primi posti su Google, clienti garantiti o vendite automatiche. Ci impegniamo a fornire lavoro verificabile e comunicazione trasparente.",
          actions: [{ label: "Leggi la sicurezza", href: "#/sicurezza" }],
        },
      ]}
      quickLinks={[
        { label: "Prenotazioni", href: "#/sito-prenotazioni", text: "Per attività che lavorano su appuntamento." },
        { label: "Soluzioni", href: "#/soluzioni", text: "Altri percorsi per attività locali." },
        { label: "Contatti", href: "#/contatti", text: "Scrivici senza inviare password o dati riservati." },
      ]}
    />
  );
}
