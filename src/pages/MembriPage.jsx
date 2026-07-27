import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { track } from "../lib/analytics.js";

const principles = [
  {
    label: "Calma",
    title: "Per chi cerca un posto meno rumoroso.",
    text: "Uno spazio pensato per leggere, capire e scegliere senza pressione.",
  },
  {
    label: "Fiducia",
    title: "Per chi vuole sentirsi al sicuro prima di entrare.",
    text: "Prima chiarezza, poi relazione. Nessuna promessa facile, nessuna corsa.",
  },
  {
    label: "Presenza",
    title: "Per chi vuole tornare, non solo passare.",
    text: "Un percorso che cresce piano: messaggi, profili, idee e valore reale.",
  },
];

const valueCards = [
  {
    title: "Parole che orientano",
    text: "Messaggi pubblici, letture brevi e contenuti che aiutano a capire il tono del progetto prima di esporsi.",
  },
  {
    title: "Un cerchio più vicino",
    text: "La futura area membri nasce per chi sente che LoveMatch360 non deve essere una piazza qualunque.",
  },
  {
    title: "Crescita con prudenza",
    text: "Nessun acquisto oggi. Prima misuriamo interesse, fiducia e utilità reale.",
  },
];

const noPromises = [
  "Non promettiamo amore garantito.",
  "Non promettiamo risultati automatici.",
  "Non vendiamo illusioni o scorciatoie.",
  "Non forziamo nessuno a restare.",
  "Non chiediamo pagamenti in questa prima versione.",
];

function hasAnalyticsConsent() {
  try {
    return window.localStorage.getItem("cmp.analytics") === "true";
  } catch {
    return false;
  }
}

function countLocalInterestClick() {
  if (!hasAnalyticsConsent()) return null;

  try {
    const key = "lm360:membri_interest_clicks";
    const current = Number(window.localStorage.getItem(key) || "0");
    const next = Number.isFinite(current) ? current + 1 : 1;
    window.localStorage.setItem(key, String(next));
    return next;
  } catch {
    return null;
  }
}

export default function MembriPage() {
  const [interested, setInterested] = useState(false);
  const [localCount, setLocalCount] = useState(null);

  const statusText = useMemo(() => {
    if (!interested) {
      return "Primo passo: raccogliere interesse vero, senza aprire pagamenti."; 
    }

    if (localCount) {
      return "Grazie. Il tuo interesse è stato registrato su questo dispositivo con consenso analytics attivo."; 
    }

    return "Grazie. Il tuo interesse è stato segnato in questa sessione. Se il consenso analytics è attivo, il click viene contato in modo anonimo."; 
  }, [interested, localCount]);

  async function handleInterestClick() {
    setInterested(true);
    setLocalCount(countLocalInterestClick());

    try {
      await track("members_interest_click", { page: "membri", intent: "waitlist" });
    } catch {
      // Nessun errore visibile: la pagina deve restare calma.
    }
  }

  return (
    <main className="membri-page" aria-labelledby="membri-title">
      <style>{css}</style>

      <section className="membri-hero">
        <p className="eyebrow">LoveMatch360 · Membri</p>
        <h1 id="membri-title">Uno spazio dove tornare volentieri.</h1>
        <p className="lead">
          Non una chat piena di rumore. Non una promessa facile. Uno spazio più umano, più curato e più ordinato, dove parole, profili e percorsi iniziano a costruire fiducia.
        </p>

        <div className="actions">
          <button type="button" className="btn primary" onClick={handleInterestClick}>
            Sono interessato
          </button>
          <Link to="/messaggi" className="btn secondary">
            Leggi i messaggi
          </Link>
          <Link to="/premium" className="btn ghost">
            Premium con calma
          </Link>
        </div>

        <div className="trust-row" aria-label="Regole di fiducia">
          <span>Nessuna promessa falsa</span>
          <span>Nessun acquisto oggi</span>
          <span>Prima fiducia, poi decisione</span>
        </div>
      </section>

      <section className="panel glow">
        <p className="eyebrow">Per chi è</p>
        <h2>Per persone che vogliono entrare con più calma.</h2>
        <p className="section-lead">
          Membri non nasce per fare numero. Nasce per capire se esiste un gruppo di persone che vuole un ambiente più chiaro, più rispettoso e più piacevole da vivere.
        </p>
        <div className="grid">
          {principles.map((item) => (
            <article className="card" key={item.title}>
              <span className="pill">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Valore prima del prezzo</p>
        <h2>Non stai comprando una funzione. Stai scegliendo un luogo più curato.</h2>
        <div className="grid">
          {valueCards.map((item) => (
            <article className="card soft" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split">
        <div>
          <p className="eyebrow">Promessa prudente</p>
          <h2>La fiducia cresce quando diciamo anche cosa non facciamo.</h2>
          <p className="section-lead">
            LoveMatch360 deve restare umano e credibile. Per questo la prima versione della pagina Membri non apre pagamenti e non vende accessi. Misura solo interesse reale.
          </p>
        </div>
        <div className="rule-list">
          {noPromises.map((item) => (
            <div className="rule" key={item}>
              <span>OK</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="interesse" className="panel interest">
        <p className="eyebrow">Lista d’attesa leggera</p>
        <h2>Prima ascoltiamo il segnale. Poi decidiamo il passo giusto.</h2>
        <p className="section-lead">
          Il pulsante non iscrive a pagamenti, non apre abbonamenti e non chiede dati personali. Serve solo a misurare se questa direzione interessa davvero.
        </p>
        <div className="interest-box">
          <button type="button" className={interested ? "btn primary done" : "btn primary"} onClick={handleInterestClick}>
            {interested ? "Interesse ricevuto" : "Sono interessato"}
          </button>
          <p>{statusText}</p>
        </div>
      </section>

      <section className="panel final">
        <p className="eyebrow">Decisione dopo la prova</p>
        <h2>Se le persone tornano, allora potremo costruire il cerchio.</h2>
        <p className="section-lead">
          La strada corretta resta semplice: pagina bella, messaggio chiaro, interesse misurabile, nessuna promessa falsa. Solo dopo si decide se creare accesso membri, valore Premium o pagamento.
        </p>
        <div className="actions">
          <Link to="/messaggi" className="btn secondary">Torna ai messaggi</Link>
          <Link to="/scopri" className="btn ghost">Vai a Scopri</Link>
        </div>
      </section>
    </main>
  );
}

const css = `
.membri-page{
  min-height:100vh;
  padding:32px 16px 78px;
  color:#f8f7fb;
  background:
    radial-gradient(circle at 12% 0%, rgba(240,143,192,.20), transparent 33%),
    radial-gradient(circle at 88% 12%, rgba(81,137,255,.16), transparent 30%),
    radial-gradient(circle at 50% 100%, rgba(74,222,128,.08), transparent 28%),
    #07080c;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.membri-hero,.panel{
  max-width:1120px;
  margin:0 auto 22px;
  border:1px solid rgba(255,255,255,.10);
  border-radius:30px;
  background:linear-gradient(135deg,rgba(255,255,255,.085),rgba(255,255,255,.035));
  box-shadow:0 28px 90px rgba(0,0,0,.34);
}
.membri-hero{padding:46px 28px}
.panel{padding:30px 28px}
.glow{background:linear-gradient(135deg,rgba(240,143,192,.11),rgba(255,255,255,.035))}
.eyebrow{margin:0;color:#f08fc0;font-size:12px;font-weight:950;letter-spacing:.13em;text-transform:uppercase}
h1{margin:18px 0 0;max-width:930px;font-size:clamp(3rem,8vw,6.4rem);line-height:.92;letter-spacing:-.065em}
h2{margin:10px 0 0;max-width:900px;font-size:clamp(2rem,4.2vw,3.6rem);line-height:1.02;letter-spacing:-.055em}
h3{margin:14px 0 0;font-size:24px;line-height:1.12}
.lead,.section-lead{max-width:870px;color:rgba(255,255,255,.80);line-height:1.72;font-size:17px}
.lead{margin:24px 0 0;font-size:clamp(1.08rem,2.1vw,1.38rem)}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.btn{min-height:48px;display:inline-flex;align-items:center;justify-content:center;border:0;padding:0 18px;border-radius:999px;text-decoration:none;font-weight:950;cursor:pointer}
.primary{background:#f08fc0;color:#111}
.primary.done{background:#9af0b7}
.secondary{background:rgba(255,255,255,.09);color:#fff;border:1px solid rgba(255,255,255,.13)}
.ghost{background:transparent;color:#ffd7ea;border:1px solid rgba(240,143,192,.38)}
.trust-row{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.trust-row span,.pill{display:inline-flex;border-radius:999px;padding:7px 11px;background:rgba(240,143,192,.14);color:#ffd7ea;font-size:12px;font-weight:900}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;margin-top:22px}
.card,.rule,.interest-box{padding:18px;border-radius:24px;border:1px solid rgba(255,255,255,.09);background:rgba(0,0,0,.24)}
.card.soft{background:rgba(255,255,255,.045)}
.card p,.rule p,.interest-box p{color:rgba(255,255,255,.76);line-height:1.68}
.split{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(280px,.9fr);gap:18px;align-items:start}
.rule-list{display:grid;gap:10px}
.rule{display:flex;gap:12px;align-items:flex-start}
.rule span{flex:0 0 auto;border-radius:999px;padding:5px 8px;background:rgba(74,222,128,.15);color:#baf7c8;font-size:12px;font-weight:950}
.rule p{margin:0}
.interest{border-color:rgba(240,143,192,.25);background:linear-gradient(135deg,rgba(240,143,192,.12),rgba(255,255,255,.035))}
.interest-box{display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-top:20px}
.interest-box p{margin:0;max-width:720px}
.final{background:linear-gradient(135deg,rgba(74,222,128,.08),rgba(240,143,192,.08))}
@media(max-width:760px){
  .membri-hero,.panel{padding:23px}
  .split{grid-template-columns:1fr}
  .interest-box{align-items:flex-start}
}
`;
