import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function Contatti() {
  return (
    <InfoPageTemplate
      eyebrow="Contatti"
      title="Parla con LoveMatch360."
      lead="Questa pagina raccoglie i contatti pubblici del progetto. Per assistenza account, richieste amministrative e informazioni operative usa sempre i canali indicati."
      cta={{ label: "Scrivi a servizioclienti", href: "mailto:servizioclienti@lovematch360.com" }}
      sections={[
        {
          label: "Assistenza",
          title: "Supporto account e richieste utenti",
          text: "Per account, accesso, richieste amministrative e informazioni sul servizio scrivi a servizioclienti@lovematch360.com.",
        },
        {
          label: "Informazioni",
          title: "Informazioni generali",
          text: "Per comunicazioni generali puoi usare info@lovematch360.com. Non inviare password, token o dati sensibili non necessari.",
        },
        {
          label: "Sicurezza",
          title: "Segnalazioni e attenzione",
          text: "Se noti comportamenti strani o problemi di accesso, descrivi il problema senza condividere password o chiavi private.",
        },
      ]}
    />
  );
}
