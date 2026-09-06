import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { track } from "../lib/analytics.js";

const nf = new Intl.NumberFormat("it-IT");

const fallbackVideos = [
  {
    id: "sXtbY973PT8",
    rank: "01",
    source: "Selezione ponte",
    title: "Red Flag nelle relazioni: come riconoscere i segnali di allarme",
    channel: "YouTube",
    theme: "Relazioni",
    url: "https://www.youtube.com/watch?v=sXtbY973PT8",
    thumb: "https://i.ytimg.com/vi/sXtbY973PT8/hqdefault.jpg",
    views: null,
    score: null,
    why: "Tema forte per LoveMatch360: fiducia, segnali, attenzione e relazioni più consapevoli.",
    transform: "Da video a Short, post, messaggio e articolo.",
  },
  {
    id: "Ay1QY64Y16A",
    rank: "02",
    source: "Selezione ponte",
    title: "Ho Testato i MIGLIORI Strumenti AI per Creator",
    channel: "YouTube",
    theme: "AI per creator",
    url: "https://www.youtube.com/watch?v=Ay1QY64Y16A",
    thumb: "https://i.ytimg.com/vi/Ay1QY64Y16A/hqdefault.jpg",
    views: null,
    score: null,
    why: "Utile per blogger e creator: strumenti, metodo e scelta pratica.",
    transform: "Da video a post guida e checklist semplice.",
  },
  {
    id: "mkLkx2-fIps",
    rank: "03",
    source: "Selezione ponte",
    title: "CHAT GPT COME SCRIVERE UN ARTICOLO | del tuo blog o sito",
    channel: "YouTube",
    theme: "Blog",
    url: "https://www.youtube.com/watch?v=mkLkx2-fIps",
    thumb: "https://i.ytimg.com/vi/mkLkx2-fIps/hqdefault.jpg",
    views: null,
    score: null,
    why: "Collega ChatGPT, scrittura, blog e contenuti utili per il sito.",
    transform: "Da video a struttura articolo.",
  },
  {
    id: "oSl-HCECogE",
    rank: "04",
    source: "Selezione ponte",
    title: "Trasforma Video YouTube in Articoli di Blog con Python e ChatGPT",
    channel: "YouTube",
    theme: "Video → Blog",
    url: "https://www.youtube.com/watch?v=oSl-HCECogE",
    thumb: "https://i.ytimg.com/vi/oSl-HCECogE/hqdefault.jpg",
    views: null,
    score: null,
    why: "Mostra il passaggio centrale: un video può diventare contenuto scritto.",
    transform: "Da video a blog, Facebook e WhatsApp.",
  },
];

const channels = [
  {
    label: "YouTube",
    title: "Video o Short",
    text: "Il tema forte diventa un contenuto da guardare: chiaro, breve, diretto.",
  },
  {
    label: "Facebook",
    title: "Post breve",
    text: "Una frase forte, un esempio e una domanda per aprire conversazione.",
  },
  {
    label: "WhatsApp",
    title: "Messaggio condivisibile",
    text: "Versione corta e umana, facile da leggere e inoltrare.",
  },
  {
    label: "Blog",
    title: "Articolo utile",
    text: "Il video diventa guida: titolo, punti chiari, esempio e conclusione.",
  },
];

async function trackClick(target) {
  try {
    await track("youtube_news_click", { target });
  } catch {
    // Nessun errore visibile al visitatore.
  }
}

function viewsLabel(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return "in attesa";
  }

  return nf.format(value);
}

function scoreLabel(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return "—";
  }

  return String(value);
}

function VideoCard({ item, active, onPlay, onOpenYoutube }) {
  const embed = `https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <article className={active ? "yn-card yn-card-active" : "yn-card"}>
      <div className="yn-card-top">
        <span className="yn-rank">{item.rank}</span>
        <span className={item.source === "Top YouTube" ? "yn-badge yn-badge-live" : "yn-badge"}>
          {item.source}
        </span>
      </div>

      {active ? (
        <div className="yn-player-wrap">
          <button
            type="button"
            className="yn-open-youtube"
            onClick={() => onOpenYoutube(item)}
            title="Apri questo video su YouTube"
          >
            Apri su YouTube
          </button>

          <iframe
            className="yn-player"
            src={embed}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <button
            type="button"
            className="yn-secondary-open"
            onClick={() => onOpenYoutube(item)}
          >
            Apri questo video su YouTube
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="yn-thumb"
          onClick={() => onPlay(item)}
          aria-label={`Avvia video: ${item.title}`}
        >
          <img src={item.thumb || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`} alt={item.title} loading="lazy" />
          <span className="yn-play">▶</span>
          <span className="yn-click-help">1 clic: guarda qui</span>
        </button>
      )}

      <h3>{item.title}</h3>
      <p className="yn-card-text">{item.why}</p>

      <div className="yn-stats">
        <span><strong>{viewsLabel(item.views)}</strong> visualizzazioni pubbliche</span>
        <span><strong>{scoreLabel(item.score)}</strong> punteggio LM360</span>
        <span><strong>{item.theme}</strong> tema</span>
      </div>

      <p className="yn-transform">{item.transform}</p>
    </article>
  );
}

export default function YoutubeNewsPage() {
  const [videos, setVideos] = useState(fallbackVideos);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [loadingTop, setLoadingTop] = useState(true);
  const [feedState, setFeedState] = useState("Caricamento top video...");

  useEffect(() => {
    let alive = true;

    async function loadTopVideos() {
      try {
        setLoadingTop(true);

        const response = await fetch("/api/youtube-top-videos?regionCode=IT&categoryIds=28,22,0&maxResults=8", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error("Endpoint non disponibile");

        const data = await response.json();

        if (data?.ok && Array.isArray(data.videos) && data.videos.length) {
          if (!alive) return;
          setVideos(data.videos);
          setFeedState(`Top YouTube aggiornati: ${new Date(data.updatedAt).toLocaleString("it-IT")}`);
          return;
        }

        if (!alive) return;
        setVideos(fallbackVideos);
        setFeedState("Top automatici non disponibili in locale: uso selezione ponte verificabile.");
      } catch {
        if (!alive) return;
        setVideos(fallbackVideos);
        setFeedState("Top automatici non disponibili in locale: uso selezione ponte verificabile.");
      } finally {
        if (alive) setLoadingTop(false);
      }
    }

    loadTopVideos();

    return () => {
      alive = false;
    };
  }, []);

  function handlePlay(item) {
    setActiveVideoId(item.id);
    trackClick(`play_inline_${item.id}`);
  }

  function handleOpenYoutube(item) {
    trackClick(`open_youtube_${item.id}`);
    window.open(item.url, "_blank", "noopener,noreferrer");
  }

  
  function scrollToTopVideos() {
    const element = document.getElementById("top-video");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    trackClick("top-video-scroll");
  }return (
    <main className="yn-page" aria-labelledby="youtube-news-title">
      <style>{css}</style>

      <div className="yn-shell">
        <section className="yn-hero">
          <div className="yn-hero-copy">
            <p className="yn-eyebrow">LoveMatch360 · YouTube News</p>
            <h1 id="youtube-news-title">Da un video a quattro contenuti.</h1>
            <p className="yn-lead">
              Prendiamo video reali, scegliamo i temi utili e li trasformiamo in uscite semplici:
              YouTube, Facebook, WhatsApp e Blog.
            </p>
          </div>

          <div className="yn-hero-side">
            <div className="yn-mini">
              <strong>{videos.length} video</strong>
              <span>{loadingTop ? "caricamento..." : "pronti da leggere"}</span>
            </div>

            <div className="yn-actions">
              <button type="button" className="yn-btn primary" onClick={scrollToTopVideos}>Vedi video</button>
              <Link className="yn-btn secondary" to="/membri" onClick={() => trackClick("membri")}>
                Sono interessato
              </Link>
            </div>
          </div>

          <div className={loadingTop ? "yn-note" : "yn-note yn-note-ready"}>
            {feedState}
          </div>
        </section>
        <section id="top-video" className="yn-panel">
          <div className="yn-section-head">
            <div>
              <p className="yn-eyebrow">Top video reali</p>
              <h2>Video selezionati dai segnali pubblici disponibili.</h2>
              <p>
                Ogni scheda mostra un video reale o una selezione ponte verificabile. Il punteggio LM360 combina visualizzazioni pubbliche, like, commenti e posizione nel feed: non è un ranking ufficiale YouTube.
              </p>
            </div>

            <div className="yn-mini yn-mini-soft">
              <strong>Top</strong>
              <span>YouTube → contenuti</span>
            </div>
          </div>

          <div className="yn-inline-flow" aria-label="Da un video a quattro contenuti">
            <div className="yn-inline-head">
              <div>
                <p className="yn-eyebrow">Da un video a quattro contenuti</p>
                <strong>YouTube → Facebook → WhatsApp → Blog</strong>
              </div>
              <span>Un tema solo, quattro uscite utili.</span>
            </div>

            <div className="yn-inline-grid">
              {channels.map((item) => (
                <article className="yn-flow-card" key={item.label}>
                  <small>{item.label}</small>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <p className="yn-card-text">Dal 24 agosto 2026 YouTube conta una visualizzazione pubblica quando il video inizia a essere riprodotto, inclusi alcuni avvii automatici.</p>

          <div className="yn-video-grid">
            {videos.map((item) => (
              <VideoCard
                item={item}
                key={item.id}
                active={activeVideoId === item.id}
                onPlay={handlePlay}
                onOpenYoutube={handleOpenYoutube}
              />
            ))}
          </div>
        </section>

        <section className="yn-panel yn-bottom">
          <div>
            <p className="yn-eyebrow">Metodo discreto</p>
            <h2>Il motore resta dietro. Il valore resta davanti.</h2>
            <p>
              Le pagine tecniche non devono disturbare il visitatore. Restano raggiungibili solo da chi vuole capire come vengono scelti i temi.
            </p>
          </div>

          <div className="yn-actions">
            <Link className="yn-btn ghost" to="/metrics" onClick={() => trackClick("metrics")}>
              Come scegliamo i temi
            </Link>
            <Link className="yn-btn ghost" to="/playbook" onClick={() => trackClick("playbook")}>
              Metodo editoriale
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

const css = `
.yn-page{
  width:100%;
  min-height:100vh;
  padding:20px 14px 64px;
  color:#e6e8ef;
  background:
    radial-gradient(circle at 10% 0%, rgba(139,92,246,.18), transparent 34%),
    radial-gradient(circle at 90% 6%, rgba(34,197,94,.12), transparent 30%),
    #0b0d10;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.yn-shell{
  width:min(1180px,100%);
  margin:0 auto;
}
.yn-hero,.yn-panel,.yn-channel-strip{
  border:1px solid #242a32;
  border-radius:22px;
  background:linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.032));
  box-shadow:0 22px 64px rgba(0,0,0,.26);
}
.yn-hero{
  padding:22px;
  display:grid;
  grid-template-columns:minmax(0,1fr) 270px;
  gap:18px;
  align-items:center;
}
.yn-hero-copy{min-width:0}
.yn-hero-side{
  display:grid;
  gap:12px;
  justify-items:stretch;
}
.yn-eyebrow{
  margin:0;
  color:#c4b5fd;
  font-size:11px;
  font-weight:950;
  letter-spacing:.13em;
  text-transform:uppercase;
}
.yn-hero h1{
  margin:8px 0 0;
  max-width:760px;
  font-size:clamp(2rem,4.2vw,3.7rem);
  line-height:.98;
  letter-spacing:-.055em;
  color:#fff;
}
.yn-lead{
  margin:12px 0 0;
  max-width:720px;
  color:#aab1bf;
  line-height:1.5;
  font-size:15px;
}
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
.yn-mini{
  display:grid;
  gap:4px;
  padding:14px 16px;
  border-radius:16px;
  border:1px solid rgba(139,92,246,.38);
  background:rgba(139,92,246,.12);
}
.yn-mini strong{
  color:#fff;
  font-size:24px;
  line-height:1;
}
.yn-mini span{
  color:#aab1bf;
  font-weight:800;
}
.yn-mini-soft{
  min-width:190px;
}
.yn-note{
  grid-column:1 / -1;
  padding:11px 13px;
  border-radius:14px;
  border:1px solid rgba(245,158,11,.35);
  background:rgba(245,158,11,.09);
  color:#fde68a;
  line-height:1.45;
  font-weight:850;
}
.yn-note-ready{
  border-color:rgba(34,197,94,.35);
  background:rgba(34,197,94,.09);
  color:#bbf7d0;
}
.yn-channel-strip{
  margin-top:14px;
  padding:18px;
}
.yn-channel-head{
  display:flex;
  justify-content:space-between;
  gap:16px;
  align-items:end;
  margin-bottom:12px;
}
.yn-channel-head h2{
  margin:6px 0 0;
  color:#fff;
  font-size:clamp(1.35rem,2.6vw,2rem);
  letter-spacing:-.04em;
}
.yn-channel-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:12px;
}
.yn-channel{
  min-height:128px;
  padding:16px;
  border-radius:18px;
  border:1px solid #242a32;
  background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025));
}
.yn-channel small{
  color:#c4b5fd;
  text-transform:uppercase;
  letter-spacing:.10em;
  font-weight:950;
  font-size:11px;
}
.yn-channel h3{
  margin:9px 0 0;
  color:#fff;
  font-size:20px;
  line-height:1.1;
}
.yn-channel p{
  margin:8px 0 0;
  color:#aab1bf;
  line-height:1.45;
  font-size:14px;
}
.yn-panel{
  margin-top:14px;
  padding:20px;
}
.yn-section-head{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:16px;
  align-items:end;
}
.yn-panel h2{
  margin:8px 0 0;
  max-width:760px;
  font-size:clamp(1.45rem,3vw,2.35rem);
  line-height:1.06;
  letter-spacing:-.045em;
  color:#fff;
}
.yn-panel p{
  max-width:790px;
  color:#aab1bf;
  line-height:1.52;
  font-size:15px;
}
.yn-inline-flow{
  margin:16px 0 14px;
  padding:14px;
  border-radius:18px;
  border:1px solid rgba(139,92,246,.34);
  background:
    linear-gradient(135deg,rgba(139,92,246,.14),rgba(34,197,94,.07)),
    rgba(255,255,255,.025);
}
.yn-inline-head{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:14px;
  margin-bottom:12px;
}
.yn-inline-head strong{
  display:block;
  margin-top:5px;
  color:#fff;
  font-size:clamp(1.2rem,2.2vw,1.75rem);
  line-height:1.05;
  letter-spacing:-.035em;
}
.yn-inline-head span{
  color:#aab1bf;
  font-size:13px;
  font-weight:800;
  text-align:right;
}
.yn-inline-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:10px;
}
.yn-flow-card{
  min-width:0;
  padding:13px;
  border-radius:15px;
  border:1px solid rgba(255,255,255,.08);
  background:rgba(11,13,16,.62);
}
.yn-flow-card small{
  color:#c4b5fd;
  text-transform:uppercase;
  letter-spacing:.10em;
  font-weight:950;
  font-size:10px;
}
.yn-flow-card h3{
  margin:7px 0 0;
  color:#fff;
  font-size:17px;
  line-height:1.08;
}
.yn-flow-card p{
  margin:7px 0 0;
  color:#aab1bf;
  font-size:12.5px;
  line-height:1.42;
}
@media(max-width:1080px){
  .yn-inline-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:620px){
  .yn-inline-head{display:block}
  .yn-inline-head span{
    display:block;
    margin-top:8px;
    text-align:left;
  }
  .yn-inline-grid{grid-template-columns:1fr}
}
.yn-video-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:14px;
  margin-top:16px;
}
.yn-card{
  min-width:0;
  padding:14px;
  border-radius:18px;
  border:1px solid #242a32;
  background:linear-gradient(180deg,rgba(255,255,255,.065),rgba(255,255,255,.025));
}
.yn-card-active{border-color:rgba(139,92,246,.55)}
.yn-card-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  margin-bottom:10px;
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
.yn-badge-live{
  border-color:rgba(139,92,246,.48);
  background:rgba(139,92,246,.18);
  color:#ddd6fe;
}
.yn-thumb{
  position:relative;
  display:block;
  width:100%;
  overflow:hidden;
  aspect-ratio:16 / 9;
  border-radius:16px;
  border:1px solid rgba(255,255,255,.10);
  background:#090b10;
  margin-bottom:12px;
  padding:0;
  cursor:pointer;
  text-align:left;
}
.yn-thumb img{
  width:100%;
  height:100%;
  object-fit:cover;
  opacity:.92;
}
.yn-play{
  position:absolute;
  left:12px;
  bottom:12px;
  width:42px;
  height:42px;
  display:grid;
  place-items:center;
  border-radius:999px;
  background:#fff;
  color:#111;
  font-weight:950;
}
.yn-click-help{
  position:absolute;
  right:8px;
  bottom:10px;
  max-width:150px;
  padding:7px 9px;
  border-radius:999px;
  background:rgba(0,0,0,.62);
  color:#fff;
  font-size:10px;
  font-weight:900;
}
.yn-player-wrap{
  overflow:hidden;
  border-radius:16px;
  border:1px solid rgba(139,92,246,.36);
  background:#090b10;
  margin-bottom:12px;
}
.yn-open-youtube{
  width:100%;
  min-height:38px;
  border:0;
  border-bottom:1px solid rgba(139,92,246,.38);
  background:rgba(139,92,246,.26);
  color:#ffffff;
  cursor:pointer;
  font:inherit;
  font-size:13px;
  font-weight:950;
}
.yn-secondary-open{
  width:100%;
  min-height:38px;
  border:0;
  border-top:1px solid rgba(139,92,246,.28);
  background:rgba(255,255,255,.07);
  color:#ffffff;
  cursor:pointer;
  font:inherit;
  font-weight:950;
}
.yn-open-youtube:hover,
.yn-secondary-open:hover{filter:brightness(1.12)}
.yn-player{
  display:block;
  width:100%;
  aspect-ratio:16 / 9;
  border:0;
  background:#000;
}
.yn-card h3{
  margin:0;
  color:#fff;
  font-size:18px;
  line-height:1.13;
  letter-spacing:-.02em;
}
.yn-card-text{
  margin:9px 0 0;
  color:#aab1bf;
  line-height:1.45;
  font-size:14px;
}
.yn-stats{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:7px;
  margin-top:11px;
}
.yn-stats span{
  padding:9px;
  border-radius:13px;
  background:rgba(16,20,26,.78);
  border:1px solid #242a32;
  color:#aab1bf;
  font-size:11px;
  font-weight:850;
  overflow:hidden;
}
.yn-stats strong{
  display:block;
  color:#fff;
  font-size:15px;
  line-height:1.1;
  white-space:normal;
  overflow:visible;
  text-overflow:clip;
}
.yn-transform{
  margin:11px 0 0;
  padding-top:10px;
  border-top:1px solid rgba(255,255,255,.08);
  color:#fde68a !important;
  font-size:13px !important;
  font-weight:850;
  line-height:1.4 !important;
}
.yn-bottom{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:16px;
  align-items:center;
}
@media(max-width:1080px){
  .yn-inline-flow{
  margin:16px 0 14px;
  padding:14px;
  border-radius:18px;
  border:1px solid rgba(139,92,246,.34);
  background:
    linear-gradient(135deg,rgba(139,92,246,.14),rgba(34,197,94,.07)),
    rgba(255,255,255,.025);
}
.yn-inline-head{
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:14px;
  margin-bottom:12px;
}
.yn-inline-head strong{
  display:block;
  margin-top:5px;
  color:#fff;
  font-size:clamp(1.2rem,2.2vw,1.75rem);
  line-height:1.05;
  letter-spacing:-.035em;
}
.yn-inline-head span{
  color:#aab1bf;
  font-size:13px;
  font-weight:800;
  text-align:right;
}
.yn-inline-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:10px;
}
.yn-flow-card{
  min-width:0;
  padding:13px;
  border-radius:15px;
  border:1px solid rgba(255,255,255,.08);
  background:rgba(11,13,16,.62);
}
.yn-flow-card small{
  color:#c4b5fd;
  text-transform:uppercase;
  letter-spacing:.10em;
  font-weight:950;
  font-size:10px;
}
.yn-flow-card h3{
  margin:7px 0 0;
  color:#fff;
  font-size:17px;
  line-height:1.08;
}
.yn-flow-card p{
  margin:7px 0 0;
  color:#aab1bf;
  font-size:12.5px;
  line-height:1.42;
}
@media(max-width:1080px){
  .yn-inline-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:620px){
  .yn-inline-head{display:block}
  .yn-inline-head span{
    display:block;
    margin-top:8px;
    text-align:left;
  }
  .yn-inline-grid{grid-template-columns:1fr}
}
.yn-video-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .yn-channel-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:820px){
  .yn-page{padding:16px 10px 52px}
  .yn-hero,.yn-section-head,.yn-bottom{grid-template-columns:1fr}
  .yn-hero{padding:18px}
  .yn-panel,.yn-channel-strip{padding:16px}
  .yn-hero-side{justify-items:start}
  .yn-mini{width:100%}
  .yn-actions{width:100%}
  .yn-btn{flex:1 1 auto}
}
@media(max-width:620px){
  .yn-video-grid,.yn-channel-grid{grid-template-columns:1fr}
  .yn-hero h1{font-size:2.25rem}
  .yn-panel h2,.yn-channel-head h2{font-size:1.65rem}
  .yn-stats{grid-template-columns:1fr}
  .yn-click-help{left:12px;right:auto;bottom:62px}
}
`;