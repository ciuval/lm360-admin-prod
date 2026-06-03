import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function Soluzioni() {
  return (
    <InfoPageTemplate
      eyebrow="Soluzioni"
      title="Siti utili, non solo belli."
      lead="Una mappa semplice per capire quale sito puo dare valore reale: clienti locali, prenotazioni e, piu avanti, e-commerce avanzato."
      cta={{ label: "Sito clienti locali", href: "#/sito-clienti-locali" }}
      secondaryCta={{ label: "Sito prenotazioni", href: "#/sito-prenotazioni" }}
      sections={[
        {
          label: "Percorso 1",
          title: "Clienti locali",
          text: "Per professionisti e attivita che vogliono farsi trovare, spiegare cosa fanno e ricevere richieste ordinate. Non promette risultati automatici: costruisce una base seria per fiducia, chiarezza e contatti migliori.",
        },
        {
          label: "Percorso 2",
          title: "Prenotazioni",
          text: "Per chi lavora su appuntamento e vuole meno messaggi sparsi, orari piu chiari e richieste raccolte in modo ordinato.",
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
        },
      ]}
      quickLinks={[
        { label: "Come funziona", href: "#/come-funziona" },
        { label: "Contatti", href: "#/contatti" },
        { label: "Sicurezza", href: "#/sicurezza" },
      ]}
    />
  );
}
