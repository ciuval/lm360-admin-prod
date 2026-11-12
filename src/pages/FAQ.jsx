import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function FAQ() {
  return (
    <InfoPageTemplate
      eyebrow="Domande frequenti"
      title="Risposte chiare, prima di iscriverti."
      lead="Come funziona LoveMatch360, cosa puoi aspettarti e cosa non promettiamo. Se manca una risposta puoi contattare l'assistenza senza avere un account."
      cta={{ label: "Come funziona", href: "#/come-funziona" }}
      secondaryCta={{ label: "Scrivi all'assistenza", href: "mailto:servizioclienti@lovematch360.com" }}
      sections={[
        {
          label: "Registrazione",
          title: "Come comincio?",
          text: "Crea un account con email e password, conferma l'email quando richiesto e completa nome, bio, interessi e almeno una foto. Un profilo è completo solo quando tutti e quattro i requisiti sono soddisfatti.",
          actions: [{ label: "Registrati", href: "#/register" }, { label: "Profilo", href: "#/profilo" }],
        },
        {
          label: "Eta",
          title: "Le persone sono verificate?",
          text: "Per registrarsi bisogna dichiarare di avere almeno 18 anni. Questa autodichiarazione e la conferma email non sono una verifica documentale dell'identità o dell'età. Non presentiamo gli altri profili come identità certificate.",
          actions: [{ label: "Sicurezza", href: "#/sicurezza" }, { label: "Termini", href: "/legal/termini" }],
        },
        {
          label: "Scoperta",
          title: "Perché potrei vedere pochi profili?",
          text: "Scopri persone mostra i profili disponibili che soddisfano i requisiti del percorso. Non inventiamo utenti per riempire la lista e non promettiamo un numero minimo di persone o di incontri.",
          actions: [{ label: "Scopri persone", href: "#/scopri-profili" }],
        },
        {
          label: "Match",
          title: "Quando posso conversare?",
          text: "Il percorso è progettato per mostrare un match quando l'interesse è reciproco. La verifica delle autorizzazioni sul backend è ancora in corso. Un match non garantisce una risposta, un incontro o la compatibilità reale tra due persone.",
          actions: [{ label: "Vai ai match", href: "#/match" }, { label: "Come funziona", href: "#/come-funziona" }],
        },
        {
          label: "Segnalazioni",
          title: "Come segnalo un profilo o un abuso?",
          text: "Scrivi a servizioclienti@lovematch360.com indicando il problema e, se possibile, il riferimento al profilo o al contenuto. Non inviare password, codici o documenti personali. Non dichiariamo una moderazione automatica di ogni messaggio.",
          actions: [{ label: "Segnala via email", href: "mailto:servizioclienti@lovematch360.com" }, { label: "Policy di utilizzo", href: "/legal/uso-accettabile" }],
        },
        {
          label: "Premium",
          title: "Devo pagare per usare il sito?",
          text: "I nuovi acquisti Premium sono attualmente sospesi. Le pagine Premium e checkout non avviano nuovi acquisti. Non è previsto l'acquisto di crediti per leggere o inviare ogni singolo messaggio.",
          actions: [{ label: "Stato Premium", href: "#/premium" }],
        },
        {
          label: "Dati",
          title: "Come chiedo la chiusura del mio account?",
          text: "Invia la richiesta a servizioclienti@lovematch360.com. Il supporto dovra verificarla e gestirla nel rispetto degli obblighi applicabili; non è promessa una cancellazione automatica immediata.",
          actions: [{ label: "Contatti", href: "#/contatti" }, { label: "Privacy", href: "#/privacy" }],
        },
      ]}
      quickLinks={[
        { label: "Sicurezza", href: "#/sicurezza", text: "Consigli pratici e canale di segnalazione." },
        { label: "Regole di utilizzo", href: "/legal/uso-accettabile", text: "Comportamenti consentiti e vietati." },
        { label: "Contatti", href: "#/contatti", text: "Supporto e richieste senza account." },
      ]}
    />
  );
}
