import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function ComeFunziona() {
  return (
    <InfoPageTemplate
      eyebrow="Come funziona"
      title="Un percorso semplice: profilo, scoperta, match."
      lead="Pagina viva per capire il flusso del prodotto: prima completi il profilo, poi scopri persone, poi arrivano i match reciproci."
      cta={{ label: "Inizia dal profilo", href: "#/profilo" }}
      secondaryCta={{ label: "Vedi funzioni", href: "#/funzioni" }}
      sections={[
        {
          label: "1",
          title: "Completa il profilo",
          text: "Nome, bio, interessi e foto aiutano a rendere il profilo comprensibile. Il percorso parte sempre da qui.",
          actions: [{ label: "Profilo", href: "#/profilo" }],
        },
        {
          label: "2",
          title: "Vai su Scopri",
          text: "Scopri mostra profili reali quando saranno presenti. Se il sito e vuoto, lo stato vuoto spiega cosa succede.",
          actions: [{ label: "Scopri", href: "#/scopri" }, { label: "Profili pubblici", href: "#/profili-pubblici" }],
        },
        {
          label: "3",
          title: "Aspetta il match reciproco",
          text: "I match compaiono quando l interesse e reciproco. La chat deve restare collegata al principio del match.",
          actions: [{ label: "Match", href: "#/match" }],
        },
        {
          label: "4",
          title: "Cresci senza forzare",
          text: "Premium e funzioni avanzate arriveranno solo quando daranno valore reale e non confusione.",
          actions: [{ label: "FAQ", href: "#/faq" }, { label: "Sicurezza", href: "#/sicurezza" }],
        },
      ]}
      quickLinks={[
        { label: "Funzioni", href: "#/funzioni", text: "Mappa aree del sito." },
        { label: "FAQ", href: "#/faq", text: "Domande frequenti." },
        { label: "Contatti", href: "#/contatti", text: "Supporto e informazioni." },
      ]}
    />
  );
}
