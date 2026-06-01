import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function Sicurezza() {
  return (
    <InfoPageTemplate
      eyebrow="Sicurezza"
      title="Sicurezza prima delle funzioni."
      lead="Pagina viva per capire come LoveMatch360 protegge il percorso: pagine protette, niente dati finti, niente invii email dal browser e Stripe dormiente."
      cta={{ label: "Apri privacy", href: "#/privacy" }}
      secondaryCta={{ label: "Leggi FAQ", href: "#/faq" }}
      sections={[
        {
          label: "Accesso",
          title: "Pagine protette",
          text: "Profilo, Scopri, Match, Billing, Quantum e Admin richiedono accesso. Chi non entra viene rimandato al login.",
          actions: [{ label: "Profilo", href: "#/profilo" }, { label: "Match", href: "#/match" }],
        },
        {
          label: "Admin",
          title: "Azioni controllate",
          text: "Ruoli, account, notifiche e stati operativi non si cambiano con pulsanti rapidi. Prima audit, poi conferma, poi postcheck.",
          actions: [{ label: "Manuale admin", href: "#/admin" }, { label: "Log admin", href: "#/log-admin" }],
        },
        {
          label: "Pagamenti",
          title: "Stripe dormiente",
          text: "Checkout e pagamenti restano sospesi durante lo sviluppo. Nessun pagamento parte dalle pagine informative.",
          actions: [{ label: "Premium", href: "#/premium" }, { label: "Billing", href: "#/billing" }],
        },
        {
          label: "Email",
          title: "Niente invii dal browser",
          text: "Le notifiche operative saranno inviate solo server-side. Il browser non contiene chiavi email o segreti.",
          actions: [{ label: "Notifiche", href: "#/notifiche" }, { label: "Contatti", href: "#/contatti" }],
        },
      ]}
      quickLinks={[
        { label: "Privacy", href: "#/privacy", text: "Dati e consenso." },
        { label: "Cookie", href: "#/cookies", text: "Alias cookie e cookies." },
        { label: "Contatti", href: "#/contatti", text: "Supporto senza segreti." },
      ]}
    />
  );
}
