import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function ChiSiamo() {
  return (
    <InfoPageTemplate
      eyebrow="Chi siamo"
      title="Un progetto costruito con ordine."
      lead="LoveMatch360 nasce come prodotto digitale in sviluppo. La priorita attuale e costruire una base chiara, sicura e utile prima della crescita commerciale."
      sections={[
        {
          label: "Visione",
          title: "Prima il valore",
          text: "Il sito deve essere comprensibile anche quando non ci sono ancora clienti reali. Ogni pagina deve spiegare il percorso.",
        },
        {
          label: "Metodo",
          title: "Sviluppo controllato",
          text: "Le funzioni vengono aggiunte a blocchi: audit, patch, build, commit, push, deploy e smoke production.",
        },
        {
          label: "Futuro",
          title: "Crescita graduale",
          text: "Premium, Super Premium, notifiche e funzioni admin avanzate arriveranno solo quando saranno pronte e sicure.",
        },
      ]}
    />
  );
}
