import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function Sicurezza() {
  return (
    <InfoPageTemplate
      eyebrow="Sicurezza e fiducia"
      title="La fiducia comincia dalla trasparenza."
      lead="LoveMatch360 aiuta le persone a conoscersi, ma non garantisce l'identità degli altri utenti, la sincerità di un profilo o un incontro sicuro. Qui trovi le regole, i limiti attuali e un contatto umano per chiedere aiuto."
      cta={{ label: "Segnala un problema", href: "mailto:servizioclienti@lovematch360.com" }}
      secondaryCta={{ label: "Leggi le regole d'uso", href: "/legal/uso-accettabile" }}
      sections={[
        {
          label: "Segnalazioni",
          title: "Molestie, truffe o profili sospetti",
          text: "Scrivi a servizioclienti@lovematch360.com con una breve descrizione, il riferimento al profilo o al contenuto e, se possibile, la data. Non inviare password, codici, documenti d'identità o numeri completi di carte. Le segnalazioni passano per email: non promettiamo il monitoraggio automatico di ogni conversazione.",
          actions: [
            { label: "Scrivi all'assistenza", href: "mailto:servizioclienti@lovematch360.com" },
            { label: "Policy di utilizzo", href: "/legal/uso-accettabile" },
          ],
        },
        {
          label: "18+",
          title: "Età dichiarata, non identità verificata",
          text: "Per registrarsi è necessario dichiarare di avere almeno 18 anni. La conferma dell'email e questa dichiarazione non equivalgono a una verifica documentale dell'età o dell'identità. Se sospetti la presenza di un minore, contatta l'assistenza.",
          actions: [{ label: "Termini", href: "/legal/termini" }],
        },
        {
          label: "Account",
          title: "Accessi e conversazioni",
          text: "Il profilo personale richiede l'accesso. Per entrare in Scopri persone occorrono nome, bio, interessi e almeno una foto. Il percorso di scoperta è progettato attorno all'interesse reciproco. Le autorizzazioni dei messaggi sono ancora in revisione tecnica; un match non certifica l'identità di nessuno.",
          actions: [
            { label: "Come funziona", href: "#/come-funziona" },
            { label: "Profilo", href: "#/profilo" },
          ],
        },
        {
          label: "Pagamenti",
          title: "Nuovi acquisti Premium sospesi",
          text: "In questa fase le pagine Premium e checkout non avviano nuovi acquisti. Non pagare altri utenti per ottenere un match o una conversazione. Per chiarire eventuali addebiti preesistenti contatta l'assistenza, senza comunicare dati completi della carta.",
          actions: [{ label: "Premium", href: "#/premium" }, { label: "Contatti", href: "#/contatti" }],
        },
        {
          label: "Privacy",
          title: "Richieste su account e dati",
          text: "Per chiedere la chiusura dell'account, informazioni sui dati o esercitare un diritto privacy usa il contatto di assistenza. Una richiesta via email non equivale a una cancellazione automatica: il supporto dovrà verificare e gestire il caso.",
          actions: [
            { label: "Privacy", href: "#/privacy" },
            { label: "Scrivi all'assistenza", href: "mailto:servizioclienti@lovematch360.com" },
          ],
        },
        {
          label: "Prudenza",
          title: "Proteggi la tua vita fuori dallo schermo",
          text: "Non condividere password, codici o informazioni finanziarie con persone conosciute online. Evita trasferimenti di denaro e verifica con cautela le richieste insolite. In caso di pericolo immediato contatta i servizi di emergenza, non aspettare una risposta via email.",
          actions: [{ label: "FAQ", href: "#/faq" }],
        },
      ]}
      quickLinks={[
        { label: "Segnalazioni e contatti", href: "#/contatti", text: "Recapito di assistenza accessibile senza account." },
        { label: "Policy di utilizzo", href: "/legal/uso-accettabile", text: "Comportamenti vietati e procedura di segnalazione." },
        { label: "Termini", href: "/legal/termini", text: "Requisiti, limiti del servizio e diritti." },
        { label: "Privacy", href: "#/privacy", text: "Informazioni sul trattamento dei dati." },
      ]}
    />
  );
}
