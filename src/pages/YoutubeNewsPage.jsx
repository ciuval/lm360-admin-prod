import React from "react";
import { Link } from "react-router-dom";
import { track } from "../lib/analytics.js";

const topVideos = [
  {
    rank: "01",
    badge: "Top visualizzazioni",
    title: "Red flags nelle relazioni: segnali da non ignorare",
    category: "Relazioni",
    views: "18.400",
    points: 92,
    growth: "+126/h",
    format: "Short",
    why: "Tema forte, immediato e utile per chi vuole capire prima di fidarsi.",
    hook: "Non tutte le attenzioni sono interesse vero.",
  },
  {
    rank: "02",
    badge: "Molto richiesto",
    title: "Usare ChatGPT senza copiare: metodo semplice",
    category: "AI utile",
    views: "13.100",
    points: 84,
    growth: "+88/h",
    format: "Video breve",
    why: "Aiuta chi crea contenuti a usare l'AI come assistente, non come pilota.",
    hook: "L'AI non sostituisce la scelta. La rende piu ordinata.",
  },
  {
    rank: "03",
    badge: "Da trasformare",
    title: "Profilo piu umano, meno caos",
    category: "LoveMatch360",
    views: "9.400",
    points: 78,
    growth: "+62/h",
    format: "Long",
    why: "Collega il cuore del sito: identita, fiducia e presenza personale.",
    hook: "Un profilo non deve impressionare. Deve far capire.",
  },
  {
    rank: "04",
    badge: "Lead utile",
    title: "Checklist che fa tornare le persone",
    category: "Blogger",
    views: "7.800",
    points: 73,
    growth: "+51/h",
    format: "Short + Blog",
    why: "Una checklist diventa motivo per salvare, condividere e tornare.",
    hook: "Se una pagina non lascia niente, nessuno torna.",
  },
];

const channels = [
  {
    label: "YouTube",
    title: "Video o Short",
    text: "Titolo chiaro, gancio iniziale, tre punti forti e invito a continuare.",
    sample: "Perche questo tema interessa adesso?",
  },
  {
    label: "Facebook",
    title: "Post pubblico",
    text: "Una frase forte, spiegazione breve e domanda finale per commenti puliti.",
    sample: "Ti e mai capitato di vedere questo segnale?",
  },
  {
    label: "WhatsApp",
    title: "Messaggio condivisibile",
    text: "Testo corto, umano, senza pressione. Utile per gruppi e contatti diretti.",
    sample: "Guarda questa idea, secondo me fa riflettere.",
  },
  {
    label: "Blog",
    title: "Articolo utile",
    text: "Titolo, introduzione, elenco punti, conclusione e collegamento al percorso.",
    sample: "Da un video nasce una guida da leggere.",
  },
];

async function trackClick(target) {
  try {
    await track("youtube_news_click", { target });
  } catch {
    // Nessun errore visibile al visitatore.
  }
}

function scrollToTopVideo() {
  document.getElementById("top-video")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function VideoCard({ item }) {
  return (
    <article className="yn-card">
      <div className="yn-card-top">
        <span className="yn-rank">{item.rank}</span>
        <span className="yn-badge">{item.badge}</span>
      </div>

      <div className="yn-screen" aria-label="Anteprima video editoriale">
        <div className="yn-play">▶</div>
        <div className="yn-screen-text">
          <strong>{item.format}</strong>
          <span>{item.category}</span>
        </div>
      </div>

      <h3>{item.title}</h3>
      <p>{item.why}</p>

      <div className="yn-stats">
        <span><strong>{item.views}</strong> visualizzazioni</span>
        <span><strong>{item.points}</strong> punti</span>
        <span><strong>{item.growth}</strong> crescita</span>
      </div>

      <div className="yn-hook">
        <small>Gancio</small>
        <p>{item.hook}</p>
      </div>
    </article>
  );
}

export default function YoutubeNewsPage() {
  return (
    <main className="yn-page" aria-labelledby="youtube-news-title">
      <style>{css}</style>

      <section className="yn-hero">
        <div>
          <p className="yn-eyebrow">LoveMatch360 - YouTube News</p>
          <h1 id="youtube-news-title">Video richiesti, idee pronte.</h1>
          <p className="yn-lead">
            Una vetrina per blogger e creator: temi forti, visualizzazioni, punti e contenuti da trasformare.
          </p>
        </div>

        <div className="yn-actions">
          <button
            type="button"
            className="yn-btn primary"
            onClick={() => {
              trackClick("top-video");
              scrollToTopVideo();
            }}
          >
            Vedi top video
          </button>

          <Link className="yn-btn secondary" to="/membri" onClick={() => trackClick("membri")}>
            Sono interessato
          </Link>
        </div>

        <div className="yn-note">
          Selezione editoriale iniziale: i dati reali YouTube non sono ancora collegati.
          Prima costruiamo valore, poi automazione.
        </div>
      </section>

      <section id="top-video" className="yn-panel">
        <div className="yn-section-head">
          <div>
            <p className="yn-eyebrow">Top richiesti</p>
            <h2>Video piu interessanti da trasformare.</h2>
            <p>
              Ogni scheda mostra tema, visualizzazioni, punti, crescita e gancio.
              L'obiettivo e scegliere cosa pubblicare, non inseguire rumore.
            </p>
          </div>

          <div className="yn-mini">
            <strong>4 idee</strong>
            <span>YouTube + Facebook + WhatsApp + Blog</span>
          </div>
        </div>

        <div className="yn-video-grid">
          {topVideos.map((item) => (
            <VideoCard item={item} key={item.rank} />
          ))}
        </div>
      </section>

      <section className="yn-panel">
        <p className="yn-eyebrow">Da una idea a quattro contenuti</p>
        <h2>Una sola idea deve viaggiare bene.</h2>

        <div className="yn-channel-grid">
          {channels.map((item) => (
            <article className="yn-channel" key={item.label}>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="yn-sample">{item.sample}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="yn-panel yn-accent">
        <p className="yn-eyebrow">Dietro le quinte</p>
        <h2>Le pagine tecniche restano dietro link intuitivi.</h2>
        <p>
          Chi vuole capire il metodo puo aprire gli strumenti. Chi visita la pagina pubblica
          vede prima esempi, utilita e direzione.
        </p>

        <div className="yn-actions">
          <Link className="yn-btn ghost" to="/metrics" onClick={() => trackClick("metrics")}>
            Come scegliamo i temi
          </Link>
          <Link className="yn-btn ghost" to="/playbook" onClick={() => trackClick("playbook")}>
            Metodo editoriale
          </Link>
          <Link className="yn-btn primary" to="/membri" onClick={() => trackClick("membri-bottom")}>
            Segui il progetto
          </Link>
        </div>
      </section>
    </main>
  );
}

const css = `
.yn-page{
  min-height:100vh;
  padding:24px 16px 70px;
  color:#e6e8ef;
  background:
    radial-gradient(circle at 8% 0%, rgba(139,92,246,.18), transparent 32%),
    radial-gradient(circle at 92% 8%, rgba(34,197,94,.10), transparent 28%),
    #0b0d10;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.yn-hero,.yn-panel{
  max-width:1120px;
  margin:0 auto 16px;
  border:1px solid #242a32;
  border-radius:22px;
  background:linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.032));
  box-shadow:0 24px 70px rgba(0,0,0,.28);
}
.yn-hero{
  padding:26px;
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:18px;
  align-items:end;
}
.yn-panel{padding:24px}
.yn-accent{border-color:rgba(139,92,246,.38)}
.yn-eyebrow{
  margin:0;
  color:#c4b5fd;
  font-size:11px;
  font-weight:950;
  letter-spacing:.14em;
  text-transform:uppercase;
}
.yn-hero h1{
  margin:10px 0 0;
  max-width:760px;
  font-size:clamp(2rem,4.4vw,3.55rem);
  line-height:1;
  letter-spacing:-.055em;
  color:#fff;
}
.yn-panel h2{
  margin:8px 0 0;
  max-width:760px;
  font-size:clamp(1.45rem,3vw,2.35rem);
  line-height:1.08;
  letter-spacing:-.04em;
  color:#fff;
}
.yn-lead,.yn-panel p{
  max-width:790px;
  color:#aab1bf;
  line-height:1.58;
  font-size:15px;
}
.yn-lead{margin:10px 0 0}
.yn-actions{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  align-items:center;
}
.yn-btn{
  min-height:40px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  border-radius:999px;
  padding:0 15px;
  border:1px solid #242a32;
  background:#1a1f27;
  color:#fff;
  text-decoration:none;
  font-weight:900;
  white-space:nowrap;
  cursor:pointer;
  font:inherit;
}
.yn-btn.primary{background:#8b5cf6;border-color:transparent}
.yn-btn.secondary{background:rgba(255,255,255,.08)}
.yn-btn.ghost{background:transparent;color:#c4b5fd;border-color:rgba(139,92,246,.45)}
.yn-note{
  grid-column:1 / -1;
  padding:12px 14px;
  border-radius:14px;
  border:1px solid rgba(245,158,11,.35);
  background:rgba(245,158,11,.09);
  color:#fde68a;
  line-height:1.45;
  font-weight:850;
}
.yn-section-head{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:16px;
  align-items:end;
}
.yn-mini{
  display:grid;
  gap:4px;
  min-width:210px;
  padding:14px 16px;
  border-radius:16px;
  border:1px solid rgba(139,92,246,.38);
  background:rgba(139,92,246,.12);
}
.yn-mini strong{color:#fff;font-size:24px;line-height:1}
.yn-mini span{color:#aab1bf;font-weight:800}
.yn-video-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
  gap:14px;
  margin-top:18px;
}
.yn-card{
  padding:16px;
  border-radius:18px;
  border:1px solid #242a32;
  background:linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.025));
}
.yn-card-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:12px;
}
.yn-rank{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:42px;
  height:34px;
  border-radius:12px;
  background:rgba(139,92,246,.18);
  border:1px solid rgba(139,92,246,.40);
  color:#fff;
  font-weight:950;
}
.yn-badge{
  display:inline-flex;
  padding:7px 10px;
  border-radius:999px;
  border:1px solid rgba(34,197,94,.32);
  background:rgba(34,197,94,.11);
  color:#bbf7d0;
  font-size:12px;
  font-weight:950;
}
.yn-screen{
  min-height:118px;
  border-radius:16px;
  border:1px solid rgba(255,255,255,.10);
  background:
    linear-gradient(135deg,rgba(139,92,246,.34),rgba(16,20,26,.86)),
    radial-gradient(circle at 82% 18%,rgba(34,197,94,.20),transparent 32%);
  display:flex;
  align-items:end;
  justify-content:space-between;
  gap:12px;
  padding:14px;
  margin-bottom:14px;
}
.yn-play{
  width:46px;
  height:46px;
  display:grid;
  place-items:center;
  border-radius:999px;
  background:#fff;
  color:#111;
  font-weight:950;
}
.yn-screen-text strong{display:block;color:#fff;font-size:18px}
.yn-screen-text span{display:block;color:#d8dcec;font-size:13px}
.yn-card h3{
  margin:0;
  color:#fff;
  font-size:22px;
  line-height:1.12;
}
.yn-card p{color:#aab1bf;line-height:1.52}
.yn-stats{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:8px;
  margin-top:12px;
}
.yn-stats span{
  padding:10px;
  border-radius:13px;
  background:rgba(16,20,26,.78);
  border:1px solid #242a32;
  color:#aab1bf;
  font-size:12px;
  font-weight:850;
}
.yn-stats strong{
  display:block;
  color:#fff;
  font-size:18px;
  line-height:1.1;
}
.yn-hook{
  margin-top:12px;
  padding:12px;
  border-radius:14px;
  background:rgba(245,158,11,.08);
  border:1px solid rgba(245,158,11,.25);
}
.yn-hook small{
  color:#fde68a;
  text-transform:uppercase;
  letter-spacing:.10em;
  font-weight:950;
}
.yn-hook p{
  margin:6px 0 0;
  color:#fde68a;
  font-weight:850;
}
.yn-channel-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:12px;
  margin-top:16px;
}
.yn-channel{
  padding:16px;
  border-radius:16px;
  border:1px solid #242a32;
  background:#161a20;
}
.yn-channel small{
  color:#c4b5fd;
  text-transform:uppercase;
  letter-spacing:.10em;
  font-weight:950;
}
.yn-channel h3{
  margin:10px 0 0;
  color:#fff;
  font-size:21px;
}
.yn-sample{
  margin-top:12px;
  padding:12px;
  border-radius:13px;
  background:rgba(139,92,246,.12);
  color:#ddd6fe;
  font-weight:850;
}
@media(max-width:880px){
  .yn-hero,.yn-section-head{grid-template-columns:1fr}
}
@media(max-width:760px){
  .yn-page{padding:18px 12px 56px}
  .yn-hero,.yn-panel{padding:18px}
  .yn-stats{grid-template-columns:1fr}
}
`;