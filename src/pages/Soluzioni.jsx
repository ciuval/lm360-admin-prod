import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function Soluzioni() {
  return (
    <InfoPageTemplate
      eyebrow="Soluzioni"
      title="Siti utili, non solo belli."
      lead="Scegli il percorso piu adatto prima di costruire: clienti locali, prenotazioni e, piu avanti, e-commerce avanzato. Il punto non e avere pagine in piu, ma una presenza che risolve un problema reale."
      cta={{ label: "Parti dai clienti locali", href: "#/sito-clienti-locali" }}
      secondaryCta={{ label: "Organizza prenotazioni", href: "#/sito-prenotazioni" }}
      sections={[
        {
          label: "Percorso 1",
          title: "Clienti locali",
          text: "Per professionisti e attivita che vogliono farsi trovare, spiegare cosa fanno e ricevere richieste piu ordinate. Non promette risultati automatici: costruisce una base seria per fiducia, chiarezza e contatti migliori.",
          actions: [{ label: "Apri clienti locali", href: "#/sito-clienti-locali" }],
        },
        {
          label: "Percorso 2",
          title: "Prenotazioni",
          text: "Per chi lavora su appuntamento e vuole meno messaggi sparsi, orari piu chiari e richieste raccolte in modo ordinato.",
          actions: [{ label: "Apri prenotazioni", href: "#/sito-prenotazioni" }],
        },
        {
          label: "Percorso futuro",
          title: "E-commerce avanzato",
          text: "Vendere online puo avere valore, ma richiede catalogo, pagamenti, spedizioni, resi, sicurezza e responsabilita. Per questo resta un percorso futuro, da preparare con piu calma.",
        },
        {
          label: "Metodo",
          title: "Prima capire, poi costruire",
          text: "Ogni sito utile parte da una domanda concreta: quale problema risolve? Solo dopo arrivano pagine, testi, contatti, privacy, mobile e verifiche.",
          actions: [{ label: "Come funziona", href: "#/come-funziona" }],
        },
      ]}
      quickLinks={[
        { label: "Come funziona", href: "#/come-funziona", text: "Il metodo generale prima delle funzioni." },
        { label: "Contatti", href: "#/contatti", text: "Per raccontare il tuo caso senza caos." },
        { label: "Sicurezza", href: "#/sicurezza", text: "Regole, limiti e niente scorciatoie." },
      ]}
    />
  );
}
