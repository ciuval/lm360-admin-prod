import React from "react";
import { Link } from "react-router-dom";
import { track } from "../lib/analytics.js";

const metricsHref = "#metrics-preview";
const playbookHref = "#playbook-preview";

const contentEngine = [
  "Usa la tab Top ER per scegliere i 3 temi/giorno.",
  "Δ/h ≥ 50 e ER Δ% ≥ 3 → produce.",
  "Pipeline: trends → fetch-niche → script → TTS → CapCut → upload.",
];

const doubleFormat = [
  { title: "Shorts", text: "3-5 al giorno per testare hook, payoff e risposta reale del pubblico." },
  { title: "Long 6-10 minuti", text: "Si costruiscono solo sui temi che superano la soglia: script espanso, B-roll e stock coerenti." },
  { title: "Riutilizzo intelligente", text: "Un segnale forte diventa short, poi long, poi risorsa, poi prodotto digitale." },
];

const monetization = [
  "Affiliazione con disclosure chiara e UTM.",
  "Lead magnet: Checklist Red Flags PDF.",
  "Mailing list per non perdere il pubblico caldo.",
  "Mini-corso solo dopo segnali reali.",
  "Ebook/prodotto proprio: LoveMatch360 - Riconoscere, Uscire, Ricostruire.",
  "Sponsorizzazioni solo coerenti: psicologia, coaching, crescita personale.",
];

const channelRules = [
  "Titolo = keyword + outcome.",
  "Thumbnail = volto + 1-3 parole.",
  "Retention: cold open 5-8 secondi.",
  "Ritmo 150-170 parole al minuto.",
  "Pattern interrupt ogni 20-30 secondi.",
  "A/B test entro 48 ore.",
];

const scaleSteps = [
  "Se un tema resta caldo 7-14 giorni, creare variazione su secondo canale.",
  "Deleghe progressive: script, editor, publisher.",
  "La dashboard Metrics guida le priorità, non l’istinto del momento.",
];

const decisions = [
  { icon: "🔥", title: "PRODUCI SHORT", text: "Δ/h alto + ER alto", tone: "ok" },
  { icon: "📌", title: "OSSERVA", text: "ER life alto ma crescita bassa", tone: "warn" },
  { icon: "🧪", title: "TESTA HOOK", text: "views alte ma ER basso", tone: "test" },
  { icon: "❌", title: "SCARTA", text: "crescita bassa + ER basso", tone: "danger" },
];

async function trackClick(target) {
  try {
    await track("youtube_news_cta_click", { target });
  } catch {
    // La pagina resta informativa anche se il tracking non parte.
  }
}

export default function YoutubeNewsPage() {
  return (
    <main className="youtube-news-page" aria-labelledby="youtube-news-title">
      <style>{css}</style>

      <section className="hero">
        <p className="eyebrow">LoveMatch360 ? YouTube News</p>
        <h1 id="youtube-news-title">YouTube News: dalla nicchia ai contenuti che convertono</h1>
        <p className="lead">
          Una sezione operativa per trasformare segnali, metriche e trend in video, lead e prodotti digitali.
        </p>

        <div className="actions">
          <a className="btn primary" href={metricsHref} onClick={() => trackClick("metrics")}>
            Apri Metrics
          </a>
          <a className="btn secondary" href={playbookHref} onClick={() => trackClick("playbook")}>
            Leggi il Playbook
          </a>
          <Link className="btn ghost" to="/membri">
            Entra nel percorso Membri
          </Link>
        </div>

        <div className="hero-tags" aria-label="Regole principali">
          <span>Nessuna promessa di guadagno</span>
          <span>Dati prima delle decisioni</span>
          <span>Una cosa alla volta</span>
        </div>
      </section>

      <section className="panel intro">
        <p className="eyebrow">Motivo per restare</p>
        <h2>Il libro racconta il metodo. YouTube mostra il percorso vivo. I membri non perdono il filo.</h2>
        <p className="section-lead">
          Questa pagina collega LoveMatch360 al lavoro editoriale e video: non una promessa facile, ma un laboratorio ordinato dove capire quali idee meritano attenzione, quali contenuti produrre e quali decisioni rimandare.
        </p>
      </section>

      <section className="panel">
        <p className="eyebrow">Motore contenuti</p>
        <h2>Dalla nicchia al video pubblicabile.</h2>
        <div className="grid three">
          {contentEngine.map((item) => (
            <article className="card" key={item}>
              <span className="badge">Regola</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split">
        <div>
          <p className="eyebrow">Doppio formato</p>
          <h2>Shorts per testare. Long per costruire valore.</h2>
          <p className="section-lead">
            Lo short serve a capire se un tema accende curiosità. Il long serve solo quando il segnale ha dimostrato di meritare tempo, struttura e spiegazione.
          </p>
        </div>
        <div className="stack">
          {doubleFormat.map((item) => (
            <article className="mini-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Monetizzazione prudente</p>
        <h2>Entrate possibili solo dopo fiducia, contenuto e prova.</h2>
        <div className="grid two">
          {monetization.map((item) => (
            <article className="card soft" key={item}>
              <span className="dot" />
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Ottimizzazione canale</p>
        <h2>Ogni video deve promettere un risultato chiaro, non rumore.</h2>
        <div className="grid three">
          {channelRules.map((item) => (
            <article className="card rule" key={item}>
              <span>OK</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split">
        <div>
          <p className="eyebrow">Scala</p>
          <h2>Si scala solo ciò che resta caldo.</h2>
          <p className="section-lead">
            La crescita non deve essere caos. Se un tema funziona davvero, si crea una variazione, si delega il passaggio ripetibile e si usa la dashboard per decidere le priorità.
          </p>
        </div>
        <div className="stack">
          {scaleSteps.map((item, index) => (
            <article className="mini-card numbered" key={item}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel decision">
        <p className="eyebrow">Decisione operativa</p>
        <h2>Quattro esiti, zero improvvisazione.</h2>
        <div className="grid four">
          {decisions.map((item) => (
            <article className={"decision-card " + item.tone} key={item.title}>
              <span className="decision-icon">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="metrics-preview" className="panel preview">
        <p className="eyebrow">Metrics</p>
        <h2>Il collegamento Metrics è preparato.</h2>
        <p className="section-lead">
          In questo ciclo Metrics non risulta ancora integrato nel router o come pagina standalone. Il pulsante resta interno e aggiornabile: quando /metrics o /metrics.html sarà disponibile, basterà aggiornare la costante metricsHref.
        </p>
      </section>

      <section id="playbook-preview" className="panel preview">
        <p className="eyebrow">Playbook</p>
        <h2>Il Playbook diventerà la guida pratica.</h2>
        <p className="section-lead">
          La pagina già contiene il metodo operativo: soglie, formati, monetizzazione prudente, ottimizzazione e scala. Quando /playbook o /playbook.html sarà disponibile, il pulsante sarà collegato direttamente.
        </p>
      </section>

      <section className="panel note">
        <p>
          Questa pagina ha scopo educativo e operativo. Non garantisce guadagni. Le decisioni vanno validate con dati reali.
        </p>
      </section>
    </main>
  );
}

const css = `
.youtube-news-page{
  --bg:#0b0d10;
  --card:#161a20;
  --text:#e6e8ef;
  --muted:#aab1bf;
  --border:#242a32;
  --brand:#8b5cf6;
  --ok:#22c55e;
  --warn:#f59e0b;
  --danger:#ef4444;
  min-height:100vh;
  padding:34px 16px 82px;
  color:var(--text);
  background:
    radial-gradient(circle at 10% 0%, rgba(139,92,246,.24), transparent 32%),
    radial-gradient(circle at 90% 12%, rgba(34,197,94,.12), transparent 28%),
    radial-gradient(circle at 50% 100%, rgba(245,158,11,.08), transparent 32%),
    var(--bg);
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.hero,.panel{
  max-width:1180px;
  margin:0 auto 22px;
  border:1px solid var(--border);
  border-radius:12px;
  background:linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.032));
  box-shadow:0 28px 90px rgba(0,0,0,.34);
}
.hero{padding:46px 30px}
.panel{padding:30px}
.intro{border-color:rgba(139,92,246,.45);background:linear-gradient(135deg,rgba(139,92,246,.16),rgba(255,255,255,.035))}
.eyebrow{margin:0;color:#c4b5fd;font-size:12px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}
h1{margin:18px 0 0;max-width:980px;font-size:clamp(3rem,7.6vw,6.2rem);line-height:.92;letter-spacing:-.065em;color:#fff}
h2{margin:10px 0 0;max-width:920px;font-size:clamp(2rem,4.3vw,3.35rem);line-height:1.02;letter-spacing:-.05em;color:#fff}
h3{margin:12px 0 0;font-size:24px;line-height:1.12;color:#fff}
.lead,.section-lead{max-width:880px;color:var(--muted);line-height:1.72;font-size:17px}
.lead{margin:22px 0 0;font-size:clamp(1.08rem,2.1vw,1.32rem)}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.btn{min-height:48px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:0 18px;text-decoration:none;font-weight:950;border:1px solid transparent}
.primary{background:var(--brand);color:#fff}
.secondary{background:rgba(255,255,255,.08);color:#fff;border-color:var(--border)}
.ghost{background:transparent;color:#c4b5fd;border-color:rgba(139,92,246,.45)}
.hero-tags{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.hero-tags span,.badge{display:inline-flex;border-radius:999px;padding:7px 11px;background:rgba(139,92,246,.16);border:1px solid rgba(139,92,246,.28);color:#ddd6fe;font-size:12px;font-weight:900}
.grid{display:grid;gap:14px;margin-top:22px}
.two{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
.three{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.four{grid-template-columns:repeat(auto-fit,minmax(190px,1fr))}
.card,.mini-card,.decision-card{padding:18px;border-radius:12px;border:1px solid var(--border);background:var(--card)}
.card.soft{display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,.045)}
.card p,.mini-card p,.decision-card p{color:var(--muted);line-height:1.65}
.dot{width:10px;height:10px;border-radius:999px;background:var(--brand);margin-top:8px;flex:0 0 auto}
.split{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(280px,.95fr);gap:18px;align-items:start}
.stack{display:grid;gap:12px}
.numbered{display:flex;gap:14px;align-items:flex-start}
.numbered strong{color:#c4b5fd;letter-spacing:.08em}
.rule{display:flex;gap:12px;align-items:flex-start}
.rule span{flex:0 0 auto;padding:5px 8px;border-radius:999px;background:rgba(34,197,94,.14);color:#bbf7d0;font-size:12px;font-weight:950}
.rule p{margin:0}
.decision{border-color:rgba(139,92,246,.35)}
.decision-card{position:relative;overflow:hidden}
.decision-card:before{content:"";position:absolute;inset:0 auto 0 0;width:4px;background:var(--brand)}
.decision-card.ok:before{background:var(--ok)}
.decision-card.warn:before{background:var(--warn)}
.decision-card.test:before{background:var(--brand)}
.decision-card.danger:before{background:var(--danger)}
.decision-icon{font-size:28px}
.preview{background:rgba(255,255,255,.04)}
.note{border-color:rgba(245,158,11,.30);background:rgba(245,158,11,.08)}
.note p{margin:0;color:#fde68a;line-height:1.7;font-weight:800}
@media(max-width:760px){
  .hero,.panel{padding:23px}
  .split{grid-template-columns:1fr}
  h1{font-size:clamp(2.45rem,13vw,3.6rem)}
}
`;
