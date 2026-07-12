import React from "react";
import { Link } from "react-router-dom";

const messages = [
  {
    lang: "Română",
    tag: "Economie reale",
    title: "Matematica nu este o opinie",
    subtitle: "Despre nivelul de trai, muncă, producție și responsabilitate.",
    text:
      "Când vorbim despre ridicarea nivelului de trai, trebuie să vorbim serios: nu cu strigăte, nu cu promisiuni goale, ci cu cifre, muncă, producție și reguli corecte.",
  },
  {
    lang: "Italiano",
    tag: "Metodo",
    title: "Non serve urlare. Serve costruire.",
    subtitle: "Il cambiamento reale parte da ordine, lavoro e verifiche.",
    text:
      "Le promesse facili fanno rumore. I risultati veri nascono da una cosa alla volta: capire il problema, scegliere gli strumenti, controllare i passaggi e correggere.",
  },
  {
    lang: "Italiano",
    tag: "AI responsabile",
    title: "La tecnologia aiuta. Il controllo resta umano.",
    subtitle: "AI come assistente, non come pilota automatico.",
    text:
      "LoveMatch360 usa strumenti moderni per ragionare, scrivere e organizzare, ma la responsabilità finale resta nella persona che decide.",
  },
];

const frequent = [
  "Libro e progetto: sito, libro, AI, controlli, errori corretti e pubblicazione reale.",
  "Premium senza fuffa: risorse, ordine e continuità solo quando il valore è reale.",
  "Cambiamento possibile: metodo, esempi, strumenti e passaggi chiari.",
  "Moldova e lavoro: più produzione, concorrenza, meno corruzione e rispetto per chi lavora.",
];

const rules = [
  "Nessuna promessa falsa",
  "Nessun insulto",
  "Nessuna accusa personale senza fonte",
  "Nessun invio automatico non richiesto",
  "Autore chiaro: Valerius / LoveMatch360",
];

export default function ScopriEditoriale() {
  return (
    <main className="scopri-page" aria-labelledby="scopri-title">
      <style>{css}</style>

      <section className="hero">
        <p className="eyebrow">LoveMatch360 · Scopri</p>
        <h1 id="scopri-title">
          Idee per chi vuole cambiare, ma non sa da dove iniziare.
        </h1>

        <p className="lead">
          Qui non trovi solo funzioni tecniche. Trovi messaggi, percorsi e idee
          pratiche per trasformare confusione in ordine: lavoro, metodo, AI,
          responsabilità, libro e comunicazioni pubbliche.
        </p>

        <div className="actions">
          <a href="#messaggi" className="btn primary">Leggi i messaggi</a>
          <Link to="/libro/da-zero-a-lovematch360" className="btn secondary">
            Vai al libro
          </Link>
          <Link to="/scopri-profili" className="btn ghost">
            Area profili
          </Link>
        </div>

        <p className="note">
          Nessuna promessa facile. Nessun risultato garantito. Solo percorso,
          metodo e verifiche reali.
        </p>
      </section>

      <section id="messaggi" className="panel">
        <p className="eyebrow">Messaggi pubblici</p>
        <h2>Parole forti, ma pulite.</h2>
        <p className="section-lead">
          Messaggi pensati per un pubblico che sente il bisogno di cambiamento,
          ma vuole capire come si costruisce davvero: senza odio, senza fuffa,
          senza scorciatoie.
        </p>

        <div className="grid">
          {messages.map((item) => (
            <article className="card message" key={item.title}>
              <div className="meta">
                <span>{item.lang}</span>
                <span>{item.tag}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="subtitle">{item.subtitle}</p>
              <p>{item.text}</p>
              <strong>— Valerius · LoveMatch360</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Messaggi frequenti</p>
        <h2>Testi pronti da trasformare in comunicazioni.</h2>
        <p className="section-lead">
          Questa è la prima libreria editoriale pubblica. In seguito potrà
          diventare una vera area admin per salvare bozze, pubblicare messaggi
          e copiare testi per WhatsApp, social o aggiornamenti.
        </p>

        <div className="grid compact">
          {frequent.map((item, index) => (
            <article className="card" key={item}>
              <span className="num">{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel split">
        <div>
          <p className="eyebrow">Metodo</p>
          <h2>Il pubblico non ha bisogno di una pagina fredda.</h2>
          <p className="section-lead">
            Le pagine semitecniche devono diventare percorsi leggibili: prima il
            messaggio, poi il metodo, poi l’azione possibile. La tecnologia resta
            dietro. Davanti c’è una persona che capisce dove andare.
          </p>
        </div>

        <div className="quote">
          <p>“Non serve partire perfetti. Serve partire con ordine.”</p>
          <span>Regola LoveMatch360: una cosa alla volta.</span>
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Regola editoriale</p>
        <h2>Ogni messaggio pubblico deve proteggere fiducia.</h2>

        <div className="grid compact">
          {rules.map((item) => (
            <article className="rule" key={item}>
              <span>OK</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const css = `
.scopri-page{
  min-height:100vh;
  padding:34px 16px 80px;
  color:#f7f7fb;
  background:
    radial-gradient(circle at 8% 4%, rgba(240,143,192,.18), transparent 34%),
    radial-gradient(circle at 90% 10%, rgba(86,148,255,.12), transparent 30%),
    #07080c;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.hero,.panel{
  max-width:1180px;
  margin:0 auto 24px;
  border:1px solid rgba(255,255,255,.09);
  border-radius:30px;
  background:linear-gradient(135deg,rgba(255,255,255,.085),rgba(255,255,255,.035));
  box-shadow:0 28px 90px rgba(0,0,0,.32);
}
.hero{padding:44px 28px}
.panel{padding:28px}
.eyebrow{
  margin:0;
  color:#f08fc0;
  font-size:13px;
  font-weight:900;
  letter-spacing:.12em;
  text-transform:uppercase;
}
h1{
  margin:18px 0 0;
  max-width:980px;
  font-size:clamp(2.7rem,7vw,6rem);
  line-height:.94;
  letter-spacing:-.06em;
}
h2{
  margin:10px 0 0;
  font-size:clamp(1.7rem,3.8vw,3rem);
  line-height:1.05;
  letter-spacing:-.04em;
}
h3{
  margin:18px 0 0;
  font-size:28px;
  line-height:1.08;
}
.lead,.section-lead{
  max-width:880px;
  color:rgba(255,255,255,.80);
  line-height:1.72;
  font-size:17px;
}
.lead{
  margin:24px 0 0;
  font-size:clamp(1.06rem,2.1vw,1.36rem);
}
.actions{
  display:flex;
  flex-wrap:wrap;
  gap:12px;
  margin-top:28px;
}
.btn{
  min-height:48px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:0 18px;
  border-radius:999px;
  text-decoration:none;
  font-weight:900;
}
.primary{background:#f08fc0;color:#111}
.secondary{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.12)}
.ghost{background:transparent;color:#ffd7ea;border:1px solid rgba(240,143,192,.35)}
.note{
  margin:22px 0 0;
  color:rgba(255,255,255,.68);
  line-height:1.65;
}
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
  gap:16px;
  margin-top:24px;
}
.grid.compact{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.card,.rule,.quote{
  padding:20px;
  border-radius:24px;
  border:1px solid rgba(255,255,255,.09);
  background:rgba(0,0,0,.24);
}
.message:first-child{background:rgba(240,143,192,.11)}
.message:nth-child(3){background:rgba(86,148,255,.09)}
.meta{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}
.meta span,.rule span{
  padding:6px 10px;
  border-radius:999px;
  background:rgba(240,143,192,.15);
  color:#ffd7ea;
  font-size:12px;
  font-weight:900;
}
.subtitle{
  color:#ffd7ea;
  font-weight:800;
}
.card p,.rule p{
  color:rgba(255,255,255,.78);
  line-height:1.68;
}
.card strong{
  display:block;
  margin-top:18px;
  color:rgba(255,255,255,.68);
}
.num{
  color:#f08fc0;
  font-weight:900;
  letter-spacing:.08em;
}
.split{
  display:grid;
  grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);
  gap:18px;
}
.quote{
  background:rgba(240,143,192,.10);
  border-color:rgba(240,143,192,.28);
}
.quote p{
  margin:0;
  font-size:28px;
  line-height:1.15;
  font-weight:950;
}
.quote span{
  display:block;
  margin-top:14px;
  color:rgba(255,255,255,.72);
}
.rule span{
  background:rgba(74,222,128,.14);
  color:#baf7c8;
}
@media(max-width:760px){
  .hero,.panel{padding:22px}
  .split{grid-template-columns:1fr}
}
`;