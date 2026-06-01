import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function ComeFunziona() {
  return (
    <InfoPageTemplate
      eyebrow="Come funziona"
      title="Un percorso semplice: profilo, scoperta, match."
      lead="LoveMatch360 accompagna l utente passo dopo passo. Prima il profilo, poi la scoperta, poi i match reciproci. Premium arrivera solo quando avra senso reale."
      cta={{ label: "Inizia dal profilo", href: "#/profilo" }}
      sections={[
        {
          label: "1",
          title: "Completa il profilo",
          text: "Il profilo e il centro del percorso. Bio, interessi e presenza aiutano a rendere piu chiara la scoperta.",
        },
        {
          label: "2",
          title: "Vai su Scopri",
          text: "Scopri mostra profili reali quando saranno presenti. Se il sito e vuoto, lo stato vuoto spiega cosa succede.",
        },
        {
          label: "3",
          title: "Aspetta il match reciproco",
          text: "I match compaiono quando l interesse e reciproco. La chat deve restare legata a questo principio.",
        },
      ]}
    />
  );
}
