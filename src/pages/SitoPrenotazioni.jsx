import InfoPageTemplate from "./InfoPageTemplate.jsx";

export default function SitoPrenotazioni() {
  return (
    <InfoPageTemplate
      eyebrow="Prenotazioni"
      title="Un sito per organizzare appuntamenti senza caos."
      lead="Per chi lavora su appuntamento e vuole ridurre messaggi manuali, richieste sparse e confusione sugli orari, senza attivare pagamenti o automazioni non pronte."
      cta={{ label: "Racconta il tuo flusso", href: "#/contatti" }}
      secondaryCta={{ label: "Base clienti locali", href: "#/sito-clienti-locali" }}
      sections={[
        {
          label: "A chi serve",
          title: "Servizi su appuntamento",
          text: "Saloni, consulenti, studi, corsi, trattamenti, tecnici e professionisti che devono gestire tempi, disponibilita e richieste in modo piu chiaro.",
          actions: [{ label: "Vedi clienti locali", href: "#/sito-clienti-locali" }],
        },
        {
          label: "Beneficio",
          title: "Meno messaggi, piu ordine",
          text: "La pagina deve spiegare servizi, orari, regole e passaggi. Il cliente capisce cosa puo prenotare e cosa deve comunicare prima dell appuntamento.",
        },
        {
          label: "Funzioni future",
          title: "Calendario e promemoria",
          text: "Calendario, disponibilita, conferme e promemoria sono funzioni utili, ma vanno collegate solo quando la procedura tecnica e sicura.",
        },
        {
          label: "Pagamenti",
          title: "Acconto solo piu avanti",
          text: "Un eventuale acconto online richiede pagamenti configurati e testati. In questa fase nessun checkout parte da queste pagine.",
          actions: [{ label: "Sicurezza", href: "#/sicurezza" }],
        },
      ]}
      quickLinks={[
        { label: "Soluzioni", href: "#/soluzioni", text: "Torna alla mappa dei percorsi." },
        { label: "Contatti", href: "#/contatti", text: "Racconta orari, servizi e regole." },
        { label: "Sicurezza", href: "#/sicurezza", text: "Niente pagamenti non pronti." },
      ]}
    />
  );
}
