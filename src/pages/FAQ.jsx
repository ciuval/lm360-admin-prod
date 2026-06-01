import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function FAQ() {
  return (
    <InfoPageTemplate
      eyebrow="FAQ"
      title="Domande frequenti."
      lead="Risposte semplici per capire lo stato attuale di LoveMatch360 mentre il prodotto viene costruito e migliorato con una base pulita."
      sections={[
        {
          label: "Account",
          title: "Come inizio a usare il sito?",
          text: "Crea un account, accedi, completa il profilo e poi usa Scopri. Se non ci sono ancora profili reali, vedrai uno stato vuoto chiaro.",
        },
        {
          label: "Match",
          title: "Perche non vedo match?",
          text: "I match compaiono solo quando ci sara interesse reciproco. In fase iniziale il sito puo essere vuoto perche non ci sono ancora clienti reali.",
        },
        {
          label: "Premium",
          title: "Premium e gia attivo?",
          text: "No. Premium e Super Premium sono stati commerciali separati dai ruoli admin. Stripe resta dormiente finche il prodotto non sara pronto.",
        },
        {
          label: "Admin",
          title: "Admin e un abbonamento?",
          text: "No. Admin e una responsabilita operativa. Premium e Super Premium non danno accesso admin.",
        },
      ]}
    />
  );
}
