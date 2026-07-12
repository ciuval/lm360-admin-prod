import React from "react";
import { Link } from "react-router-dom";

const articleSlug = "/scopri/matematica-nu-este-o-opinie";
const matematicaShareUrl = "https://www.lovematch360.com/links/matematica-nu-este-o-opinie.html";

const messages = [
  {
    lang: "RomÃƒÂ¢nÃ„Æ’",
    tag: "Economie reale",
    title: "Matematica nu este o opinie",
    subtitle: "Despre nivelul de trai, muncÃ„Æ’, producÃˆâ€ºie Ãˆâ„¢i responsabilitate.",
    text:
      "CÃƒÂ¢nd vorbim despre ridicarea nivelului de trai, trebuie sÃ„Æ’ vorbim serios: nu cu strigÃ„Æ’te, nu cu promisiuni goale, ci cu cifre, muncÃ„Æ’, producÃˆâ€ºie Ãˆâ„¢i reguli corecte.",
    href: articleSlug,
    cta: "Deschide pagina completÃ„Æ’",
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
      "LoveMatch360 usa strumenti moderni per ragionare, scrivere e organizzare, ma la responsabilitÃƒÂ  finale resta nella persona che decide.",
  },
];

const frequent = [
  "Libro e progetto: sito, libro, AI, controlli, errori corretti e pubblicazione reale.",
  "Premium senza fuffa: risorse, ordine e continuitÃƒÂ  solo quando il valore ÃƒÂ¨ reale.",
  "Cambiamento possibile: metodo, esempi, strumenti e passaggi chiari.",
  "Moldova e lavoro: piÃƒÂ¹ produzione, concorrenza, meno corruzione e rispetto per chi lavora.",
];

const rules = [
  "Nessuna promessa falsa",
  "Nessun insulto",
  "Nessuna accusa personale senza fonte",
  "Nessun invio automatico non richiesto",
  "Autore chiaro: Valerius / LoveMatch360",
];

const matematicaParagraphs = [
  "CÃƒÂ¢nd vorbim despre ridicarea nivelului de trai, trebuie sÃ„Æ’ vorbim serios: nu cu strigÃ„Æ’te, nu cu hÃ„Æ’mÃ„Æ’ialÃ„Æ’, nu cu promisiuni goale, ci cu cifre, muncÃ„Æ’, producÃˆâ€ºie Ãˆâ„¢i reguli corecte.",
  "Ridicarea nivelului de trai ÃƒÂ®nseamnÃ„Æ’ ca omul sÃ„Æ’ poatÃ„Æ’ cumpÃ„Æ’ra mai mult din salariul lui. ÃƒÅ½nseamnÃ„Æ’ salarii reale mai mari, locuri de muncÃ„Æ’ stabile, pensii decente, preÃˆâ€ºuri corecte prin concurenÃˆâ€ºÃ„Æ’ Ãˆâ„¢i servicii publice care funcÃˆâ€ºioneazÃ„Æ’.",
  "PreÃˆâ€ºul nu trebuie stabilit din birou politic. PreÃˆâ€ºul trebuie sÃ„Æ’ arate realitatea pieÃˆâ€ºei: cÃƒÂ¢t se produce, cÃƒÂ¢t se cere, cÃƒÂ¢t costÃ„Æ’ transportul, energia, munca Ãˆâ„¢i materia primÃ„Æ’. CÃƒÂ¢nd statul se amestecÃ„Æ’ brutal ÃƒÂ®n preÃˆâ€ºuri, piaÃˆâ€ºa se blocheazÃ„Æ’, marfa dispare, investiÃˆâ€ºiile fug Ãˆâ„¢i omul simplu plÃ„Æ’teÃˆâ„¢te nota.",
  "Rolul statului este altul: sÃ„Æ’ apere concurenÃˆâ€ºa, sÃ„Æ’ lupte cu monopolurile, corupÃˆâ€ºia, schemele Ãˆâ„¢i abuzurile. Statul trebuie sÃ„Æ’ creeze reguli clare, drumuri bune, justiÃˆâ€ºie corectÃ„Æ’, educaÃˆâ€ºie profesionalÃ„Æ’ Ãˆâ„¢i condiÃˆâ€ºii pentru producÃˆâ€ºie.",
  "De ce ÃƒÂ®n Germania nivelul de trai este considerat mai ÃƒÂ®nalt? Pentru cÃ„Æ’ acolo matematica economiei este respectatÃ„Æ’: productivitate mare, muncÃ„Æ’ calificatÃ„Æ’, industrie puternicÃ„Æ’, exporturi, disciplinÃ„Æ’, reguli clare Ãˆâ„¢i respect pentru contribuabil.",
  "Acolo nu se trÃ„Æ’ieÃˆâ„¢te mai bine din vorbe, ci din organizare, producÃˆâ€ºie Ãˆâ„¢i responsabilitate. O Ãˆâ€ºarÃ„Æ’ nu devine bogatÃ„Æ’ pentru cÃ„Æ’ promite mai mult, ci pentru cÃ„Æ’ produce mai mult, munceÃˆâ„¢te mai bine Ãˆâ„¢i ÃƒÂ®Ãˆâ„¢i respectÃ„Æ’ regulile.",
  "ÃˆËœi Moldova poate merge ÃƒÂ®nainte. Dar nu prin populism. Nu prin zgomot. Nu prin legi fÃ„Æ’cute ÃƒÂ®mpotriva pieÃˆâ€ºei. Avem nevoie de mai multÃ„Æ’ producÃˆâ€ºie, mai multÃ„Æ’ concurenÃˆâ€ºÃ„Æ’, mai puÃˆâ€ºinÃ„Æ’ corupÃˆâ€ºie, mai puÃˆâ€ºinÃ„Æ’ birocraÃˆâ€ºie Ãˆâ„¢i mai mult respect pentru omul care munceÃˆâ„¢te.",
  "Nu este vorba despre urÃ„Æ’. Este vorba despre ordine, responsabilitate Ãˆâ„¢i adevÃ„Æ’r economic.",
];

export function MatematicaNuEsteOpiniePage() {
  return (
    <main className="scopri-page article-page" aria-labelledby="article-title">
      <style>{css}</style>

      <article className="article-shell">
        <div className="article-top">
          <Link to="/scopri" className="back-link">
            Ã¢â€ Â ÃƒÅ½napoi la Scopri
          </Link>

          <div className="meta">
            <span>RomÃƒÂ¢nÃ„Æ’</span>
            <span>Economie reale</span>
            <span>Valerius Ã‚Â· LoveMatch360</span>
          </div>
        </div>

        <header className="article-hero">
          <p className="eyebrow">Mesaj public</p>
          <h1 id="article-title">Matematica nu este o opinie.</h1>
          <p className="lead">
            Despre nivelul de trai, muncÃ„Æ’, producÃˆâ€ºie, preÃˆâ€ºuri, concurenÃˆâ€ºÃ„Æ’ Ãˆâ„¢i
            responsabilitate. Un text pentru oameni care vor schimbare, dar vor
            sÃ„Æ’ ÃƒÂ®nÃˆâ€ºeleagÃ„Æ’ cum se construieÃˆâ„¢te schimbarea realÃ„Æ’.
          </p>
        </header>

        <section className="article-body">
          {matematicaParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="signature">
            <strong>Ã¢â‚¬â€ Valerius</strong>
            <span>LoveMatch360</span>
          </div>
        </section>

        <section className="article-box">
          <h2>Ideea centralÃ„Æ’</h2>
          <p>
            Nivelul de trai nu creÃˆâ„¢te din scandal, ci din producÃˆâ€ºie, reguli
            clare, concurenÃˆâ€ºÃ„Æ’, muncÃ„Æ’ calificatÃ„Æ’ Ãˆâ„¢i respect pentru omul care
            munceÃˆâ„¢te.
          </p>
        </section>

                <section className="article-box share-box">
          <h2>Link util de distribuit</h2>
          <p>
            Pentru WhatsApp, Facebook, LinkedIn sau mesaje directe, folosește
            linkul public de mai jos. Deschide o pagină simplă, ușor de
            distribuit, apoi trimite cititorul la textul complet.
          </p>
          <a className="btn primary" href={matematicaShareUrl}>
            Deschide linkul public
          </a>
        </section>
<div className="actions">
          <Link to="/scopri" className="btn secondary">
            ÃƒÅ½napoi la mesaje
          </Link>
          <Link to="/libro/da-zero-a-lovematch360" className="btn ghost">
            Vezi cartea
          </Link>
        </div>
      </article>
    </main>
  );
}

export default function ScopriEditoriale() {
  return (
    <main className="scopri-page" aria-labelledby="scopri-title">
      <style>{css}</style>

      <section className="hero">
        <p className="eyebrow">LoveMatch360 Ã‚Â· Scopri</p>
        <h1 id="scopri-title">
          Idee per chi vuole cambiare, ma non sa da dove iniziare.
        </h1>

        <p className="lead">
          Qui non trovi solo funzioni tecniche. Trovi messaggi, percorsi e idee
          pratiche per trasformare confusione in ordine: lavoro, metodo, AI,
          responsabilitÃƒÂ , libro e comunicazioni pubbliche.
        </p>

        <div className="actions">
          <Link to={articleSlug} className="btn primary">
            Apri il primo messaggio
          </Link>
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
          Ogni card ÃƒÂ¨ solo lÃ¢â‚¬â„¢inizio. I messaggi importanti devono aprirsi in una
          pagina completa, leggibile e condivisibile.
        </p>

        <div className="grid">
          {messages.map((item) => {
            const content = (
              <>
                <div className="meta">
                  <span>{item.lang}</span>
                  <span>{item.tag}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="subtitle">{item.subtitle}</p>
                <p>{item.text}</p>
                <strong>Ã¢â‚¬â€ Valerius Ã‚Â· LoveMatch360</strong>
                {item.cta ? <em>{item.cta}</em> : null}
              </>
            );

            if (item.href) {
              return (
                <Link className="card message clickable-card" key={item.title} to={item.href}>
                  {content}
                </Link>
              );
            }

            return (
              <article className="card message" key={item.title}>
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel">
        <p className="eyebrow">Messaggi frequenti</p>
        <h2>Testi pronti da trasformare in comunicazioni.</h2>
        <p className="section-lead">
          Questa ÃƒÂ¨ la prima libreria editoriale pubblica. In seguito potrÃƒÂ 
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
            messaggio, poi il metodo, poi lÃ¢â‚¬â„¢azione possibile. La tecnologia resta
            dietro. Davanti cÃ¢â‚¬â„¢ÃƒÂ¨ una persona che capisce dove andare.
          </p>
        </div>

        <div className="quote">
          <p>Ã¢â‚¬Å“Non serve partire perfetti. Serve partire con ordine.Ã¢â‚¬Â</p>
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
.hero,.panel,.article-shell{
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
.clickable-card{
  color:#fff;
  text-decoration:none;
  display:block;
  transition:transform .16s ease, border-color .16s ease, background .16s ease;
}
.clickable-card:hover{
  transform:translateY(-3px);
  border-color:rgba(240,143,192,.45);
  background:rgba(240,143,192,.16);
  text-decoration:none;
}
.clickable-card em{
  display:inline-flex;
  margin-top:18px;
  color:#111;
  background:#f08fc0;
  padding:9px 12px;
  border-radius:999px;
  font-style:normal;
  font-weight:900;
}
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
.article-page{
  padding-top:34px;
}
.article-shell{
  padding:28px;
  max-width:980px;
}
.article-top{
  display:flex;
  flex-wrap:wrap;
  gap:14px;
  justify-content:space-between;
  align-items:center;
}
.back-link{
  color:#ffd7ea;
  text-decoration:none;
  font-weight:900;
}
.article-hero{
  margin-top:34px;
  padding-bottom:26px;
  border-bottom:1px solid rgba(255,255,255,.10);
}
.article-body{
  max-width:780px;
  margin:28px auto 0;
}
.article-body p{
  color:rgba(255,255,255,.86);
  font-size:clamp(1.08rem,2.1vw,1.32rem);
  line-height:1.82;
  margin:0 0 22px;
}
.signature{
  margin-top:34px;
  display:grid;
  gap:4px;
  color:#ffd7ea;
  font-size:18px;
}
.article-box{
  max-width:780px;
  margin:34px auto 0;
  padding:22px;
  border-radius:24px;
  background:rgba(240,143,192,.10);
  border:1px solid rgba(240,143,192,.28);
}
.article-box p{
  color:rgba(255,255,255,.82);
  line-height:1.7;
}
@media(max-width:760px){
  .hero,.panel,.article-shell{padding:22px}
  .split{grid-template-columns:1fr}
}
`;