export default function Cookie() {
  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Cookie Policy</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          Utilizziamo cookie/tecnologie simili per funzionalità essenziali e, se attivati, per misurazione/analytics.
        </p>

        <h2>Cookie essenziali</h2>
        <p className="lead">
          Necessari per login, sicurezza e funzionamento del sito. Non possono essere disattivati.
        </p>

        <h2>Cookie analitici</h2>
        <p className="lead">
          Se attivati, ci aiutano a capire performance e utilizzo (in modo aggregato). Dove richiesto, chiediamo consenso.
        </p>

        <h2>Gestione</h2>
        <p className="lead">
          Puoi gestire i cookie dalle impostazioni del browser. La disattivazione di cookie essenziali può impedire il funzionamento del sito.
        </p>

        <p className="mini" style={{ marginTop: 14 }}>
          Ultimo aggiornamento: {new Date().toISOString().slice(0,10)}
        </p>
      </div>
    </main>
  );
}
