import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-grid">
          <div className="card card-pad">
            <h1 className="h1">Match seri. Scelte chiare. Zero rumore.</h1>
            <p className="lead">
              LoveMatch360 è dove il desiderio smette di essere confusione e diventa direzione.
              Profili veri, connessioni responsabili, e un flusso semplice: scopri → match → chat.
            </p>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <NavLink className="btn primary" to="/scopri">Inizia a scoprire</NavLink>
              <NavLink className="btn" to="/premium">Vedi Premium</NavLink>
            </div>

            <div className="kpi">
              <span className="pill"><strong>Dark</strong> elegante</span>
              <span className="pill"><strong>GDPR</strong> minded</span>
              <span className="pill"><strong>Chat</strong> solo match</span>
              <span className="pill"><strong>Premium</strong> reale</span>
            </div>
          </div>

          <div className="card card-pad">
            <div className="notice ok">
              <strong style={{ color: "var(--text)" }}>Stato:</strong>{" "}
              sito online, SEO base, routing stabile.
            </div>
            <div className="notice" style={{ marginTop: 10 }}>
              <strong style={{ color: "var(--text)" }}>Pro tip:</strong>{" "}
              completa il profilo: aumenta la qualità dei match.
            </div>
            <div className="notice" style={{ marginTop: 10 }}>
              <strong style={{ color: "var(--text)" }}>Sicurezza:</strong>{" "}
              moderazione e regole chiare. Niente caos.
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="card card-pad">
          <h2 style={{ margin: 0 }}>Come funziona</h2>
          <p className="lead" style={{ marginTop: 8 }}>
            1) Scopri profili → 2) Metti like → 3) Match reciproco → 4) Chat.
            Premium sblocca funzioni avanzate (senza cambiare le regole del rispetto).
          </p>
        </div>
      </section>
    </main>
  );
}
