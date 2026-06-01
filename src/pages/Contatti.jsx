import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function Contatti() {
  return (
    <InfoPageTemplate
      eyebrow="Contatti"
      title="Parla con LoveMatch360."
      lead="Pagina viva per assistenza, informazioni e segnalazioni. Qui trovi i percorsi corretti senza esporre password, token o dati non necessari."
      cta={{ label: "Scrivi a servizioclienti", href: "mailto:servizioclienti@lovematch360.com" }}
      secondaryCta={{ label: "Leggi FAQ", href: "#/faq" }}
      sections={[
        {
          label: "Assistenza",
          title: "Supporto account e richieste utenti",
          text: "Per account, accesso, stati e richieste operative usa servizioclienti@lovematch360.com. Descrivi il problema in modo chiaro e senza segreti.",
          actions: [{ label: "Apri FAQ", href: "#/faq" }, { label: "Sicurezza", href: "#/sicurezza" }],
        },
        {
          label: "Informazioni",
          title: "Informazioni generali",
          text: "Per comunicazioni generali puoi usare info@lovematch360.com. Per richieste operative resta preferibile servizioclienti.",
          actions: [{ label: "Come funziona", href: "#/come-funziona" }, { label: "Chi siamo", href: "#/chi-siamo" }],
        },
        {
          label: "Percorso",
          title: "Prima orientati, poi scrivi",
          text: "Molti dubbi si risolvono passando da FAQ, sicurezza e funzioni. Se il problema resta, contatta il supporto con una nota precisa.",
          actions: [{ label: "Funzioni", href: "#/funzioni" }, { label: "Profilo", href: "#/profilo" }],
        },
      ]}
      quickLinks={[
        { label: "FAQ", href: "#/faq", text: "Risposte rapide e stato del servizio." },
        { label: "Sicurezza", href: "#/sicurezza", text: "Regole per accesso e protezione." },
        { label: "Privacy", href: "#/privacy", text: "Dati, consenso e fiducia." },
      ]}
    />
  );
}
