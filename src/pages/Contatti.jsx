import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function Contatti() {
  return (
    <InfoPageTemplate
      eyebrow="Contatti e segnalazioni"
      title="Dall'altra parte c'e un recapito reale."
      lead="Per richieste sull'account, segnalazioni o chiarimenti puoi scrivere all'assistenza anche senza registrarti. Non inviare password, token, documenti d'identita o dati completi della carta."
      cta={{ label: "Scrivi all'assistenza", href: "mailto:servizioclienti@lovematch360.com" }}
      secondaryCta={{ label: "Sicurezza e fiducia", href: "#/sicurezza" }}
      sections={[
        {
          label: "Assistenza",
          title: "Account e richieste sui dati",
          text: "Per problemi di accesso, chiusura dell'account, richieste privacy o chiarimenti su un addebito scrivi a servizioclienti@lovematch360.com. Descrivi la richiesta senza comunicare credenziali o dettagli finanziari completi.",
          actions: [
            { label: "Apri Privacy", href: "#/privacy" },
            { label: "Leggi FAQ", href: "#/faq" },
          ],
        },
        {
          label: "Segnalazioni",
          title: "Comportamenti e contenuti da segnalare",
          text: "Per molestie, impersonificazione, possibili truffe o sospetta presenza di minori, indica la natura del problema, il profilo o contenuto coinvolto e una data indicativa. Non inoltrare materiale illecito o immagini intime non necessarie. Le segnalazioni sono ricevute via email; non e disponibile un servizio di emergenza.",
          actions: [
            { label: "Invia segnalazione", href: "mailto:servizioclienti@lovematch360.com" },
            { label: "Regole di utilizzo", href: "#/uso-accettabile" },
          ],
        },
        {
          label: "Informazioni",
          title: "Domande generali e attivita professionali",
          text: "Per informazioni generali e richieste sui servizi web puoi usare info@lovematch360.com. Le eventuali attivita professionali sono distinte dal servizio di incontri e non comportano l'attivazione automatica di un abbonamento Premium.",
          actions: [{ label: "Servizi per attivita locali", href: "#/sito-clienti-locali" }],
        },
        {
          label: "Emergenze",
          title: "Un'email non sostituisce i soccorsi",
          text: "Se una persona e in pericolo immediato contatta le autorita o i servizi di emergenza competenti. Non fare affidamento su una risposta immediata alle email: non viene promessa un'assistenza continuativa 24 ore su 24.",
          actions: [{ label: "Consigli di sicurezza", href: "#/sicurezza" }],
        },
      ]}
      quickLinks={[
        { label: "Sicurezza", href: "#/sicurezza", text: "Precauzioni e limiti del servizio." },
        { label: "FAQ", href: "#/faq", text: "Risposte alle domande piu frequenti." },
        { label: "Privacy", href: "#/privacy", text: "Diritti sui dati e contatto." },
      ]}
    />
  );
}
