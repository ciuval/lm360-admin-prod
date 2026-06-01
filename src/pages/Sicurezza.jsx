import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function Sicurezza() {
  return (
    <InfoPageTemplate
      eyebrow="Sicurezza"
      title="Sicurezza prima delle funzioni."
      lead="LoveMatch360 viene costruito con controlli progressivi: pagine protette, niente dati finti in produzione, nessun pagamento attivo finche il percorso non e pronto."
      sections={[
        {
          label: "Accesso",
          title: "Pagine protette",
          text: "Profilo, Scopri, Match, Billing, Quantum e Admin richiedono accesso. Chi non e autenticato viene rimandato al login.",
        },
        {
          label: "Admin",
          title: "Azioni controllate",
          text: "Le modifiche reali su ruoli, account o Premium devono passare da audit, conferma, postcheck e notifica operativa.",
        },
        {
          label: "Pagamenti",
          title: "Stripe dormiente",
          text: "Checkout e pagamenti restano sospesi durante lo sviluppo. Nessun pagamento parte dalle pagine informative.",
        },
      ]}
    />
  );
}
