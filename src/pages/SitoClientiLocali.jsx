import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function SitoClientiLocali() {
  return (
    <InfoPageTemplate
      eyebrow="Clienti locali"
      title="Un sito per essere trovati e contattati meglio."
      lead="Per professionisti, artigiani e attivita locali che vogliono presentarsi con chiarezza, fiducia e richieste piu ordinate."
      cta={{ label: "Parla del progetto", href: "#/contatti" }}
      secondaryCta={{ label: "Vedi prenotazioni", href: "#/sito-prenotazioni" }}
      sections={[
        {
          label: "A chi serve",
          title: "Professionisti e attivita reali",
          text: "Consulenti, artigiani, tecnici, servizi locali, piccoli studi e attivita che hanno bisogno di spiegare bene cosa fanno e come possono essere contattati.",
        },
        {
          label: "Cosa conta",
          title: "Fiducia prima della vendita",
          text: "Una pagina chiara, servizi comprensibili, contatti visibili, domande frequenti, segnali di serieta e testi senza promesse esagerate.",
        },
        {
          label: "Richieste",
          title: "Contatti piu ordinati",
          text: "Il sito deve aiutare una persona a capire se sei adatto al suo problema e a scriverti nel modo giusto: email, modulo, telefono o WhatsApp, quando saranno configurati in sicurezza.",
        },
        {
          label: "Regola",
          title: "Nessuna promessa facile",
          text: "Un sito serio non promette risultati automatici. Crea una base credibile, misurabile e migliorabile: poi si osserva cosa funziona e si corregge.",
        },
      ]}
      quickLinks={[
        { label: "Soluzioni", href: "#/soluzioni" },
        { label: "FAQ", href: "#/faq" },
        { label: "Privacy", href: "#/privacy" },
      ]}
    />
  );
}
