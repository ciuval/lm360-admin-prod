import React from "react";
import { Link } from "react-router-dom";

const articleSlug = "/scopri/matematica-nu-este-o-opinie";
const matematicaShareUrl = "https://www.lovematch360.com/matematica-nu-este-o-opinie/";

const messages = [
  {
    lang: "Rom\u00e2n\u0103",
    tag: "Economie reale",
    title: "Matematica nu este o opinie",
    subtitle: "Despre nivelul de trai, munc\u0103, produc\u021bie \u0219i responsabilitate.",
    text:
      "C\u00e2nd vorbim despre ridicarea nivelului de trai, trebuie s\u0103 vorbim serios: nu cu strig\u0103te, nu cu promisiuni goale, ci cu cifre, munc\u0103, produc\u021bie \u0219i reguli corecte.",
    href: articleSlug,
    cta: "Deschide pagina complet\u0103",
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
      "LoveMatch360 usa strumenti moderni per ragionare, scrivere e organizzare, ma la responsabilit\u00e0 finale resta nella persona che decide.",
  },
];

const frequent = [
  "Libro e progetto: sito, libro, AI, controlli, errori corretti e pubblicazione reale.",
  "Premium senza fuffa: risorse, ordine e continuit\u00e0 solo quando il valore \u00e8 reale.",
  "Cambiamento possibile: metodo, esempi, strumenti e passaggi chiari.",
  "Moldova e lavoro: pi\u00f9 produzione, concorrenza, meno corruzione e rispetto per chi lavora.",
];

const rules = [
  "Nessuna promessa falsa",
  "Nessun insulto",
  "Nessuna accusa personale senza fonte",
  "Nessun invio automatico non richiesto",
  "Autore chiaro: Valerius / LoveMatch360",
];

const matematicaParagraphs = [
  "C\u00e2nd vorbim despre ridicarea nivelului de trai, trebuie s\u0103 vorbim serios: nu cu strig\u0103te, nu cu h\u0103m\u0103ial\u0103, nu cu promisiuni goale, ci cu cifre, munc\u0103, produc\u021bie \u0219i reguli corecte.",
  "Ridicarea nivelului de trai \u00eenseamn\u0103 ca omul s\u0103 poat\u0103 cump\u0103ra mai mult din salariul lui. \u00censeamn\u0103 salarii reale mai mari, locuri de munc\u0103 stabile, pensii decente, pre\u021buri corecte prin concuren\u021b\u0103 \u0219i servicii publice care func\u021bioneaz\u0103.",
  "Pre\u021bul nu trebuie stabilit din birou politic. Pre\u021bul trebuie s\u0103 arate realitatea pie\u021bei: c\u00e2t se produce, c\u00e2t se cere, c\u00e2t cost\u0103 transportul, energia, munca \u0219i materia prim\u0103. C\u00e2nd statul se amestec\u0103 brutal \u00een pre\u021buri, pia\u021ba se blocheaz\u0103, marfa dispare, investi\u021biile fug \u0219i omul simplu pl\u0103te\u0219te nota.",
  "Rolul statului este altul: s\u0103 apere concuren\u021ba, s\u0103 lupte cu monopolurile, corup\u021bia, schemele \u0219i abuzurile. Statul trebuie s\u0103 creeze reguli clare, drumuri bune, justi\u021bie corect\u0103, educa\u021bie profesional\u0103 \u0219i condi\u021bii pentru produc\u021bie.",
  "De ce \u00een Germania nivelul de trai este considerat mai \u00eenalt? Pentru c\u0103 acolo matematica economiei este respectat\u0103: productivitate mare, munc\u0103 calificat\u0103, industrie puternic\u0103, exporturi, disciplin\u0103, reguli clare \u0219i respect pentru contribuabil.",
  "Acolo nu se tr\u0103ie\u0219te mai bine din vorbe, ci din organizare, produc\u021bie \u0219i responsabilitate. O \u021bar\u0103 nu devine bogat\u0103 pentru c\u0103 promite mai mult, ci pentru c\u0103 produce mai mult, munce\u0219te mai bine \u0219i \u00ee\u0219i respect\u0103 regulile.",
  "\u0218i Moldova poate merge \u00eenainte. Dar nu prin populism. Nu prin zgomot. Nu prin legi f\u0103cute \u00eempotriva pie\u021bei. Avem nevoie de mai mult\u0103 produc\u021bie, mai mult\u0103 concuren\u021b\u0103, mai pu\u021bin\u0103 corup\u021bie, mai pu\u021bin\u0103 birocra\u021bie \u0219i mai mult respect pentru omul care munce\u0219te.",
  "Nu este vorba despre ur\u0103. Este vorba despre ordine, responsabilitate \u0219i adev\u0103r economic.",
];

export function MatematicaNuEsteOpiniePage() {
  const articleLead =
    "Despre nivelul de trai, munc\u0103, produc\u021bie, pre\u021buri, concuren\u021b\u0103 \u0219i responsabilitate. Un text pentru oameni care vor schimbare, dar vor s\u0103 \u00een\u021beleag\u0103 cum se construie\u0219te schimbarea real\u0103.";

  const centralIdeaText =
    "Nivelul de trai nu cre\u0219te din scandal, ci din produc\u021bie, reguli clare, concuren\u021b\u0103, munc\u0103 calificat\u0103 \u0219i respect pentru omul care munce\u0219te.";

  const shareText =
    "Pentru WhatsApp, Facebook, LinkedIn sau mesaje directe, folose\u0219te linkul public de mai jos. Deschide o pagin\u0103 simpl\u0103, u\u0219or de distribuit, apoi trimite cititorul la textul complet.";

  return (
    <main className="scopri-page article-page" aria-labelledby="article-title">
      <style>{css}</style>

      <article className="article-shell">
        <div className="article-top">
          <Link to="/scopri" className="back-link">
            {"\u2190 \u00cenapoi la Scopri"}
          </Link>

          <div className="meta">
            <span>{"Rom\u00e2n\u0103"}</span>
            <span>Economie reale</span>
            <span>{"Valerius \u00b7 LoveMatch360"}</span>
          </div>
        </div>

        <header className="article-hero">
          <p className="eyebrow">Mesaj public</p>
          <h1 id="article-title">Matematica nu este o opinie.</h1>
          <p className="lead">{articleLead}</p>
        </header>

        <section className="article-body">
          {matematicaParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <div className="signature">
            <strong>{"\u2014 Valerius"}</strong>
            <span>LoveMatch360</span>
          </div>
        </section>

        <section className="article-box">
          <h2>{"Ideea central\u0103"}</h2>
          <p>{centralIdeaText}</p>
        </section>

        <section className="article-box share-box">
          <h2>Link util de distribuit</h2>
          <p>{shareText}</p>
          <a className="btn primary" href={matematicaShareUrl}>
            Deschide linkul public
          </a>
        </section>

        <div className="actions">
          <Link to="/scopri" className="btn secondary">
            {"\u00cenapoi la mesaje"}
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
  const heroLead =
    "Qui non trovi solo funzioni tecniche. Trovi messaggi, percorsi e idee pratiche per trasformare confusione in ordine: lavoro, metodo, AI, responsabilit\u00e0, libro e comunicazioni pubbliche.";

  const messagesLead =
    "Ogni card \u00e8 solo l'inizio. I messaggi importanti devono aprirsi in una pagina completa, leggibile e condivisibile.";

  const frequentLead =
    "Questa \u00e8 la prima libreria editoriale pubblica. In seguito potr\u00e0 diventare una vera area admin per salvare bozze, pubblicare messaggi e copiare testi per WhatsApp, social o aggiornamenti.";

  const methodLead =
    "Le pagine semitecniche devono diventare percorsi leggibili: prima il messaggio, poi il metodo, poi l'azione possibile. La tecnologia resta dietro. Davanti c'\u00e8 una persona che capisce dove andare.";

  return (
    <main className="scopri-page" aria-labelledby="scopri-title">
      <style>{css}</style>

      <section className="hero">
        <p className="eyebrow">{"LoveMatch360 \u00b7 Scopri"}</p>
        <h1 id="scopri-title">
          Idee per chi vuole cambiare, ma non sa da dove iniziare.
        </h1>

        <p className="lead">{heroLead}</p>

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
        <p className="section-lead">{messagesLead}</p>

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
                <strong>{"\u2014 Valerius \u00b7 LoveMatch360"}</strong>
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
        <p className="section-lead">{frequentLead}</p>

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
          <p className="section-lead">{methodLead}</p>
        </div>

        <div className="quote">
          <p>{"\u201cNon serve partire perfetti. Serve partire con ordine.\u201d"}</p>
          <span>{"Regola LoveMatch360: una cosa alla volta."}</span>
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