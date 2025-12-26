export default function Privacy() {
  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Informativa Privacy</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          Questa informativa descrive come LoveMatch360 tratta i dati personali secondo GDPR (Reg. UE 2016/679).
        </p>

        <h2>Dati trattati</h2>
        <ul>
          <li>Dati account (email, ID utente).</li>
          <li>Dati profilo (bio, preferenze, foto caricate).</li>
          <li>Dati tecnici (log di sicurezza essenziali, eventi di sistema). Non logghiamo PII inutili.</li>
        </ul>

        <h2>Finalità</h2>
        <ul>
          <li>Fornire il servizio (profilo, match, chat).</li>
          <li>Sicurezza e prevenzione abusi.</li>
          <li>Gestione Premium e pagamenti (tramite Stripe).</li>
        </ul>

        <h2>Basi giuridiche</h2>
        <ul>
          <li>Esecuzione del contratto (erogazione servizio).</li>
          <li>Consenso (ove richiesto, es. marketing).</li>
          <li>Legittimo interesse (sicurezza, prevenzione frodi).</li>
        </ul>

        <h2>Conservazione</h2>
        <p className="lead">
          Conserviamo i dati per il tempo necessario alle finalità. Puoi chiedere cancellazione dell’account e dei dati,
          salvo obblighi legali.
        </p>

        <h2>Condivisione</h2>
        <ul>
          <li>Stripe per pagamenti (dati transazione secondo i loro termini).</li>
          <li>Supabase come infrastruttura dati (DB/Storage/Auth) con policy di accesso (RLS).</li>
        </ul>

        <h2>Diritti</h2>
        <p className="lead">
          Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione.
        </p>

        <h2>Contatti</h2>
        <p className="lead">
          Per richieste privacy: usa il canale di contatto indicato nel sito. (Consigliato: email dedicata privacy@lovematch360.com)
        </p>

        <p className="mini" style={{ marginTop: 14 }}>
          Ultimo aggiornamento: {new Date().toISOString().slice(0,10)}
        </p>
      </div>
    </main>
  );
}
