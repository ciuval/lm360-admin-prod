import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function FAQ() {
  return (
    <InfoPageTemplate
      eyebrow="FAQ"
      title="Domande frequenti."
      lead="Pagina viva per orientarsi subito: account, profilo, scoperta, match, admin e Premium. Ogni risposta porta a un percorso utile."
      cta={{ label: "Vai alle funzioni", href: "#/funzioni" }}
      secondaryCta={{ label: "Contatta supporto", href: "#/contatti" }}
      sections={[
        {
          label: "Account",
          title: "Come inizio a usare il sito?",
          text: "Crea un account, accedi, completa il profilo e poi usa Scopri. Se non ci sono ancora profili reali, vedrai uno stato vuoto chiaro.",
          actions: [{ label: "Profilo", href: "#/profilo" }, { label: "Come funziona", href: "#/come-funziona" }],
        },
        {
          label: "Match",
          title: "Perche non vedo match?",
          text: "I match compaiono solo quando c e interesse reciproco. In fase iniziale il sito puo essere vuoto perche non ci sono ancora clienti reali.",
          actions: [{ label: "Vai a Match", href: "#/match" }, { label: "Vai a Scopri", href: "#/scopri" }],
        },
        {
          label: "Premium",
          title: "Premium non e admin",
          text: "Premium e Super Premium sono stati commerciali. Non danno permessi admin e non avviano Stripe durante lo sviluppo.",
          actions: [{ label: "Premium", href: "#/premium" }, { label: "Sicurezza", href: "#/sicurezza" }],
        },
        {
          label: "Admin",
          title: "Admin e responsabilita operativa",
          text: "Admin e owner servono per gestire il progetto. Le azioni reali richiedono procedura, audit, conferma e postcheck.",
          actions: [{ label: "Admin", href: "#/admin" }, { label: "Log admin", href: "#/log-admin" }],
        },
      ]}
      quickLinks={[
        { label: "Contatti", href: "#/contatti", text: "Canale supporto e richieste." },
        { label: "Sicurezza", href: "#/sicurezza", text: "Regole operative e protezione." },
        { label: "Funzioni", href: "#/funzioni", text: "Mappa delle aree vive." },
      ]}
    />
  );
}
