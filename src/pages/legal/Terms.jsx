export default function Terms() {
  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Termini e Condizioni</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          Usando LoveMatch360 accetti questi termini. L’obiettivo è un ambiente sicuro, responsabile e senza contenuti espliciti.
        </p>

        <h2>Regole base</h2>
        <ul>
          <li>Niente contenuti pornografici o nudità esplicita.</li>
          <li>Niente molestie, minacce, spam o frodi.</li>
          <li>Rispetta privacy: non condividere dati sensibili pubblicamente.</li>
        </ul>

        <h2>Account</h2>
        <p className="lead">
          Sei responsabile di ciò che pubblichi. Possiamo sospendere o chiudere account che violano le regole.
        </p>

        <h2>Premium</h2>
        <p className="lead">
          Le funzioni Premium sono a pagamento. L’accesso può essere limitato o revocato in caso di violazioni.
        </p>

        <h2>Limitazione responsabilità</h2>
        <p className="lead">
          LoveMatch360 facilita connessioni tra utenti ma non garantisce esiti, compatibilità o comportamento di terzi.
        </p>

        <p className="mini" style={{ marginTop: 14 }}>
          Ultimo aggiornamento: {new Date().toISOString().slice(0,10)}
        </p>
      </div>
    </main>
  );
}

