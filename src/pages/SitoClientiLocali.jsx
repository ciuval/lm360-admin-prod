import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function SitoClientiLocali() {
  return (
    <InfoPageTemplate
      eyebrow="Clienti locali"
      title="Un sito per essere trovati e contattati meglio."
      lead="Per professionisti, artigiani e attivita locali che vogliono farsi capire in pochi secondi, spiegare il proprio valore e ricevere richieste piu ordinate."
      cta={{ label: "Racconta la tua attivita", href: "#/contatti" }}
      secondaryCta={{ label: "Organizza appuntamenti", href: "#/sito-prenotazioni" }}
      sections={[
        {
          label: "A chi serve",
          title: "Professionisti e attivita reali",
          text: "Consulenti, artigiani, tecnici, servizi locali, piccoli studi e attivita che hanno bisogno di spiegare bene cosa fanno e come possono essere contattati.",
          actions: [{ label: "Vedi soluzioni", href: "#/soluzioni" }],
        },
        {
          label: "Cosa conta",
          title: "Fiducia prima della vendita",
          text: "Una pagina chiara, servizi comprensibili, contatti visibili, domande frequenti, segnali di serieta e testi senza promesse esagerate.",
        },
        {
          label: "Richieste",
          title: "Contatti piu ordinati",
          text: "Il sito deve aiutare una persona a capire se sei adatto al suo problema e a scriverti nel modo giusto: email, modulo, telefono o canale diretto, quando saranno configurati in sicurezza.",
          actions: [{ label: "Contatti", href: "#/contatti" }],
        },
        {
          label: "Regola",
          title: "Nessuna promessa facile",
          text: "Un sito serio non promette risultati automatici. Crea una base credibile, misurabile e migliorabile: poi si osserva cosa funziona e si corregge.",
          actions: [{ label: "FAQ", href: "#/faq" }],
        },
      ]}
      quickLinks={[
        { label: "Soluzioni", href: "#/soluzioni", text: "Torna alla mappa dei percorsi." },
        { label: "Prenotazioni", href: "#/sito-prenotazioni", text: "Utile se lavori su appuntamento." },
        { label: "Privacy", href: "#/privacy", text: "Prima fiducia, poi contatti." },
      ]}
    />
  );
}
