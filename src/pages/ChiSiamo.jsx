import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function ChiSiamo() {
  return (
    <InfoPageTemplate
      eyebrow="Chi siamo"
      title="Un progetto costruito con ordine."
      lead="LoveMatch360 cresce con metodo: base pulita, pagine chiare, ruoli controllati, niente scorciatoie e nessuna attivazione commerciale prima del momento giusto."
      cta={{ label: "Vedi come funziona", href: "#/come-funziona" }}
      secondaryCta={{ label: "Mappa funzioni", href: "#/funzioni" }}
      sections={[
        {
          label: "Visione",
          title: "Prima il valore",
          text: "Il sito deve essere utile anche quando la base clienti e vuota. Ogni pagina deve orientare e non creare caos.",
          actions: [{ label: "Come funziona", href: "#/come-funziona" }],
        },
        {
          label: "Metodo",
          title: "Sviluppo controllato",
          text: "Ogni blocco passa da audit, patch, build, commit, push, deploy e smoke production. Questo riduce regressioni.",
          actions: [{ label: "Sicurezza", href: "#/sicurezza" }, { label: "Log admin", href: "#/log-admin" }],
        },
        {
          label: "Futuro",
          title: "Crescita graduale",
          text: "Premium, Super Premium, notifiche reali e funzioni admin avanzate arriveranno solo quando saranno pronte e sicure.",
          actions: [{ label: "Premium", href: "#/premium" }, { label: "Notifiche", href: "#/notifiche" }],
        },
      ]}
      quickLinks={[
        { label: "Funzioni", href: "#/funzioni", text: "Cosa esiste e cosa arrivera." },
        { label: "Contatti", href: "#/contatti", text: "Canali ufficiali." },
        { label: "FAQ", href: "#/faq", text: "Risposte rapide." },
      ]}
    />
  );
}
