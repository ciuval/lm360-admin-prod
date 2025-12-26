export default function Refunds() {
  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Politica Rimborsi</h1>
        <p className="lead" style={{ marginTop: 10 }}>
          I pagamenti Premium sono gestiti tramite Stripe. In caso di problemi tecnici o addebiti non dovuti,
          valuteremo richieste di rimborso secondo la normativa applicabile e le regole Stripe.
        </p>

        <h2>Quando puoi richiedere un rimborso</h2>
        <ul>
          <li>Addebito duplicato o non autorizzato.</li>
          <li>Premium non attivato per errore tecnico verificato.</li>
        </ul>

        <h2>Come richiederlo</h2>
        <p className="lead">
          Contatta l’assistenza indicando data e importo (non inviare dati carta). Ti rispondiamo con esito e tempi stimati.
        </p>

        <p className="mini" style={{ marginTop: 14 }}>
          Ultimo aggiornamento: {new Date().toISOString().slice(0,10)}
        </p>
      </div>
    </main>
  );
}
