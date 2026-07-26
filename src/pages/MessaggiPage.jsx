import React from "react";
import { Link } from "react-router-dom";

const shareUrl = "https://www.lovematch360.com/matematica-nu-este-o-opinie/";

const whatsappText = encodeURIComponent(
  "Matematica nu este o opinie.\n\nCând vorbim despre nivelul de trai, trebuie să vorbim serios: cu muncă, producție, concurență, reguli clare și responsabilitate.\n\nText complet:\n" +
    shareUrl
);

const whatsappHref = `https://wa.me/?text=${whatsappText}`;

const highlights = [
  {
    label: "Messaggi vivi",
    title: "Ti prendono con dolcezza.",
    text:
      "Messaggi brevi, curati e piacevoli da leggere. Parlano chiaro, fanno buona impressione e restano in mente.",
  },
  {
    label: "Pronti da inviare",
    title: "Si inviano in un attimo.",
    text:
      "Ogni messaggio è pensato per viaggiare bene tra WhatsApp, Facebook e link diretti, senza perdere fascino.",
  },
  {
    label: "Presenza umana",
    title: "Fanno sentire a casa.",
    text:
      "Chi apre una pagina trova un tono caldo, uno spazio chiaro e il desiderio di fare il passo successivo.",
  },
];

const messageCards = [
  {
    tag: "Română",
    title: "Matematica nu este o opinie",
    text:
      "Nivel de trai, muncă, producție, concurență și responsabilitate. Un messaggio pubblico già pronto per essere letto e condiviso.",
    to: "/scopri/matematica-nu-este-o-opinie",
    cta: "Apri il testo completo",
  },
  {
    tag: "Metodo",
    title: "Non serve urlare. Serve costruire.",
    text:
      "Il cambiamento vero nasce da ordine, lavoro, verifiche, correzioni e responsabilità. Una cosa alla volta.",
    to: "/scopri",
    cta: "Vai a Scopri",
  },
  {
    tag: "Libro",
    title: "Da Zero a LoveMatch360",
    text:
      "Il libro racconta un progetto reale: sito, AI, controlli, errori corretti, pubblicazione e metodo.",
    to: "/libro/da-zero-a-lovematch360",
    cta: "Vedi il libro",
  },
];

const principles = [
  "Più calore, meno confusione.",
  "Più verità, meno frasi vuote.",
  "Più eleganza, meno pressione.",
  "Più fiducia, meno fretta.",
  "Più bellezza, più desiderio di tornare.",
];

export default function MessaggiPage() {
  return (
    <main className="lm-messages" aria-labelledby="messaggi-title">
      <style>{css}</style>

      <section className="hero-wrap">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-card">
          <p className="eyebrow">LoveMatch360 · Messaggi</p>
          <h1 id="messaggi-title">
            Parole che accendono curiosità e fanno restare.
          </h1>
          <p className="lead">
            Qui ogni messaggio nasce per attirare con eleganza, farsi leggere con piacere e lasciare una sensazione bella. Si entra per curiosità e si resta perché tutto parla con calore, chiarezza e stile.
          </p>

          <div className="hero-actions">
            <Link className="btn primary" to="/scopri/matematica-nu-este-o-opinie">
              Leggi il primo messaggio
            </Link>
            <a className="btn whatsapp" href={whatsappHref} target="_blank" rel="noreferrer">
              Condividi su WhatsApp
            </a>
            <Link className="btn ghost" to="/libro/da-zero-a-lovematch360">
              Apri il libro
            </Link>
          </div>

          <div className="trust-line">
            <span>Nessuna promessa facile</span>
            <span>Nessuna fuffa</span>
            <span>Una cosa alla volta</span>
          </div>
        </div>
      </section>

      <section className="soft-panel">
        <p className="eyebrow">ATMOSFERA NUOVA</p>
        <h2>Pagine che fanno sentire bene al primo sguardo.</h2>
        <p className="section-lead">
          Chi arriva qui non deve incontrare parole fredde o pesanti. Deve sentire ordine, calore e il desiderio di scoprire qualcosa di bello.
        </p>

        <div className="highlight-grid">
          {highlights.map((item) => (
            <article className="soft-card" key={item.title}>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="soft-panel message-panel">
        <div className="panel-head">
          <div>
            <p className="eyebrow">DA LEGGERE SUBITO</p>
            <h2>Messaggi da leggere e condividere con piacere.</h2>
          </div>
          <a className="mini-share" href={whatsappHref} target="_blank" rel="noreferrer">
            Pronti da inviare
          </a>
        </div>

        <div className="message-grid">
          {messageCards.map((item) => (
            <Link className="message-card" to={item.to} key={item.title}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong>{item.cta}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="soft-panel split">
        <div>
          <p className="eyebrow">SENSAZIONE GIUSTA</p>
          <h2>Qui si respira meglio.</h2>
          <p className="section-lead">
            Non serve alzare la voce per farsi ricordare. Bastano pagine belle, parole sincere e una presenza che fa stare bene. Quando il tono è giusto, la differenza si sente subito.
          </p>
        </div>

        <div className="principles">
          {principles.map((item) => (
            <div className="principle" key={item}>
              <span>OK</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="final-card">
        <p className="eyebrow">IL PASSO CHE INVITA</p>
        <h2>Prima l’attenzione, poi la fiducia, poi l’incontro.</h2>
        <p>
          La strada più bella parte da qui: conquistare interesse, creare un legame e accompagnare il visitatore verso qualcosa di sempre più ricco, esclusivo e desiderabile.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/scopri">
            Torna a Scopri
          </Link>
          <Link className="btn ghost" to="/premium">
            Scopri l’area premium
          </Link>
        </div>
      </section>
    </main>
  );
}

const css = `
.lm-messages{
  position:relative;
  min-height:100vh;
  overflow:hidden;
  padding:34px 16px 90px;
  color:#f8f7fb;
  background:
    radial-gradient(circle at 8% 0%, rgba(240,143,192,.22), transparent 32%),
    radial-gradient(circle at 92% 8%, rgba(65,128,255,.15), transparent 34%),
    linear-gradient(180deg,#07080c,#0b0d12 56%,#07080c);
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.lm-messages:before{
  content:"";
  position:absolute;
  width:460px;
  height:460px;
  right:-180px;
  top:120px;
  border-radius:999px;
  background:radial-gradient(circle,rgba(240,143,192,.18),transparent 70%);
  filter:blur(6px);
  animation:floatOne 9s ease-in-out infinite;
}
.lm-messages:after{
  content:"";
  position:absolute;
  width:360px;
  height:360px;
  left:-120px;
  bottom:120px;
  border-radius:999px;
  background:radial-gradient(circle,rgba(74,222,128,.10),transparent 72%);
  filter:blur(8px);
  animation:floatTwo 11s ease-in-out infinite;
}
.hero-wrap,.soft-panel,.final-card{
  position:relative;
  z-index:1;
  max-width:1180px;
  margin:0 auto 24px;
}
.hero-card,.soft-panel,.final-card{
  border:1px solid rgba(255,255,255,.10);
  background:linear-gradient(135deg,rgba(255,255,255,.10),rgba(255,255,255,.035));
  box-shadow:0 28px 95px rgba(0,0,0,.38);
  backdrop-filter:blur(14px);
}
.hero-card{
  position:relative;
  overflow:hidden;
  padding:46px 30px;
  border-radius:34px;
}
.hero-card:before{
  content:"";
  position:absolute;
  inset:0;
  background:linear-gradient(115deg,transparent,rgba(255,255,255,.10),transparent);
  transform:translateX(-100%);
  animation:shine 6s ease-in-out infinite;
}
.hero-card > *{position:relative;z-index:1}
.eyebrow{
  margin:0;
  color:#f08fc0;
  font-size:13px;
  font-weight:950;
  letter-spacing:.13em;
  text-transform:uppercase;
}
h1{
  margin:18px 0 0;
  max-width:1000px;
  font-size:clamp(3rem,7.2vw,6.8rem);
  line-height:.90;
  letter-spacing:-.07em;
}
h2{
  margin:12px 0 0;
  font-size:clamp(2rem,4.6vw,4.2rem);
  line-height:.98;
  letter-spacing:-.055em;
}
h3{
  margin:12px 0 0;
  font-size:clamp(1.35rem,2.6vw,2rem);
  line-height:1.06;
}
.lead,.section-lead{
  max-width:880px;
  color:rgba(255,255,255,.80);
  line-height:1.75;
}
.lead{
  margin:24px 0 0;
  font-size:clamp(1.08rem,2.2vw,1.42rem);
}
.section-lead{
  margin:18px 0 0;
  font-size:17px;
}
.hero-actions{
  display:flex;
  flex-wrap:wrap;
  gap:12px;
  margin-top:30px;
}
.btn{
  min-height:50px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:0 20px;
  border-radius:999px;
  text-decoration:none;
  font-weight:950;
  transition:transform .16s ease,filter .16s ease,border-color .16s ease;
}
.btn:hover{transform:translateY(-2px);filter:brightness(1.08)}
.primary{background:#f08fc0;color:#111}
.whatsapp{
  color:#102116;
  background:linear-gradient(135deg,#baf7c8,#74e79a);
}
.ghost{
  color:#ffd7ea;
  border:1px solid rgba(240,143,192,.36);
  background:rgba(240,143,192,.06);
}
.trust-line{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:26px;
}
.trust-line span,.soft-card span,.message-card span,.principle span,.mini-share{
  display:inline-flex;
  padding:7px 11px;
  border-radius:999px;
  color:#ffd7ea;
  background:rgba(240,143,192,.14);
  font-size:12px;
  font-weight:950;
}
.soft-panel,.final-card{
  padding:30px;
  border-radius:30px;
}
.highlight-grid,.message-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
  gap:16px;
  margin-top:24px;
}
.soft-card,.message-card,.principle{
  border:1px solid rgba(255,255,255,.09);
  background:rgba(0,0,0,.24);
}
.soft-card,.message-card{
  min-height:230px;
  padding:22px;
  border-radius:26px;
  transition:transform .18s ease,border-color .18s ease,background .18s ease;
}
.soft-card:hover,.message-card:hover{
  transform:translateY(-5px);
  border-color:rgba(240,143,192,.42);
  background:rgba(240,143,192,.10);
}
.soft-card p,.message-card p,.principle p,.final-card p{
  color:rgba(255,255,255,.78);
  line-height:1.68;
}
.message-card{
  color:#fff;
  text-decoration:none;
  position:relative;
  overflow:hidden;
}
.message-card:before{
  content:"";
  position:absolute;
  width:170px;
  height:170px;
  right:-70px;
  top:-70px;
  border-radius:999px;
  background:rgba(240,143,192,.13);
}
.message-card strong{
  display:inline-flex;
  margin-top:12px;
  color:#ffd7ea;
}
.panel-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:18px;
  flex-wrap:wrap;
}
.mini-share{
  color:#102116;
  background:linear-gradient(135deg,#baf7c8,#74e79a);
  text-decoration:none;
}
.split{
  display:grid;
  grid-template-columns:minmax(0,1.1fr) minmax(280px,.9fr);
  gap:20px;
}
.principles{
  display:grid;
  gap:10px;
}
.principle{
  display:flex;
  align-items:center;
  gap:12px;
  padding:14px;
  border-radius:18px;
}
.principle span{
  color:#baf7c8;
  background:rgba(74,222,128,.13);
}
.final-card{
  border-color:rgba(240,143,192,.28);
  background:
    radial-gradient(circle at top right,rgba(240,143,192,.18),transparent 32%),
    linear-gradient(135deg,rgba(240,143,192,.11),rgba(255,255,255,.035));
}
@keyframes shine{
  0%,55%{transform:translateX(-120%)}
  75%,100%{transform:translateX(120%)}
}
@keyframes floatOne{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(26px)}
}
@keyframes floatTwo{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-22px)}
}
@media(max-width:760px){
  .hero-card,.soft-panel,.final-card{padding:24px}
  .split{grid-template-columns:1fr}
}
`;