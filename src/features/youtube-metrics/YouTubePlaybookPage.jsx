
import React from "react";
import { Link } from "react-router-dom";
import "./brand-dark.css";

const steps = [
  { label: "01", title: "Apri Metrics", text: "Guarda quali idee sono calde, da osservare o da migliorare." },
  { label: "02", title: "Scegli una sola idea", text: "Non pubblicare tutto. Parti da un contenuto chiaro." },
  { label: "03", title: "Crea contenuto utile", text: "Short se vuoi testare. Video lungo se vuoi spiegare." },
  { label: "04", title: "Porta al percorso", text: "Libro, YouTube News, Membri e risorse devono restare collegati." },
];

const rules = [
  "Nessuna promessa di guadagno.",
  "Nessun upload automatico.",
  "Nessuna vendita prima della fiducia.",
  "Dati reali solo dopo audit dedicato.",
  "Prima valore reale. Poi monetizzazione.",
];

export function YouTubePlaybookPage() {
  return (
    <main className="ytm-page" aria-labelledby="playbook-title">
      <div className="ytm-wrap">
        <section className="ytm-hero">
          <p className="ytm-eyebrow">LoveMatch360 - Playbook</p>
          <h1 id="playbook-title" className="ytm-title">Come usare le idee.</h1>
          <p className="ytm-lead">
            Una guida semplice: scegli un tema, crea un contenuto, misura interesse e porta le persone verso un percorso utile.
          </p>

          <div className="ytm-actions">
            <Link className="ytm-btn ytm-primary" to="/metrics">Apri Metrics</Link>
            <Link className="ytm-btn ytm-soft" to="/youtube-news">YouTube News</Link>
            <Link className="ytm-btn ytm-ghost" to="/membri">Membri</Link>
          </div>
        </section>

        <section className="ytm-panel">
          <p className="ytm-eyebrow">Metodo semplice</p>
          <h2 className="ytm-h2">Dal tema al valore, senza confusione.</h2>

          <div className="ytm-steps">
            {steps.map((item) => (
              <article className="ytm-step" key={item.title}>
                <strong>{item.label}</strong>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ytm-panel">
          <p className="ytm-eyebrow">Regole</p>
          <h2 className="ytm-h2">La fiducia viene prima.</h2>

          <div className="ytm-list">
            {rules.map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="ytm-panel ytm-note">
          <p>Questa pagina ha scopo educativo e operativo. Non garantisce guadagni. Le decisioni vanno validate con dati reali.</p>
        </section>
      </div>
    </main>
  );
}

export default YouTubePlaybookPage;
