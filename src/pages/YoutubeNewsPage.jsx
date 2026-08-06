import React, { useEffect, useRef, useState } from "react";
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
    score: 94,
    why: "Tema forte per LoveMatch360: fiducia, segnali, attenzione e relazioni piu consapevoli.",
    transform: "Short: 3 segnali da osservare prima di fidarsi.",
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
    score: 90,
    why: "Utile per blogger e creator: mostra strumenti, metodo e scelta, non solo teoria.",
    transform: "Post: quali strumenti AI aiutano davvero un creator?",
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
    score: 86,
    why: "Collega direttamente ChatGPT, scrittura, blog e contenuti utili per il sito.",
    transform: "Blog: da un'idea a un articolo leggibile.",
  },
  {
    id: "oSl-HCECogE",
    rank: "04",
    source: "Selezione ponte",
    title: "Trasforma Video YouTube in Articoli di Blog con Python e ChatGPT",
    channel: "YouTube",
    theme: "Video -> Blog",
    url: "https://www.youtube.com/watch?v=oSl-HCECogE",
    thumb: "https://i.ytimg.com/vi/oSl-HCECogE/hqdefault.jpg",
    views: null,
    score: 82,
    why: "Perfetto per spiegare la logica centrale: un video puo diventare articolo, post e messaggio.",
    transform: "Metodo: da video a blog, poi Facebook e WhatsApp.",
  },
];

const channels = [
  {
    label: "YouTube",
    title: "Video o Short",
    text: "Si parte dal tema forte: titolo chiaro, gancio iniziale e invito a continuare.",
  },
  {
    label: "Facebook",
    title: "Post pubblico",
    text: "Dal video nasce una frase forte, una spiegazione breve e una domanda finale.",
  },
  {
    label: "WhatsApp",
    title: "Messaggio condivisibile",
    text: "Versione corta, umana, senza pressione, pensata per essere letta subito.",
  },
  {
    label: "Blog",
    title: "Articolo utile",
    text: "Il tema diventa una guida: titolo, punti chiari, esempio e conclusione.",
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
    return "Da collegare";
  }

  return nf.format(value);
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
      <p>{item.why}</p>

      <div className="yn-stats">
        <span><strong>{viewsLabel(item.views)}</strong> visualizzazioni</span>
        <span><strong>{item.score}</strong> punti</span>
        <span><strong>{item.theme}</strong> tema</span>
      </div>

      <div className="yn-hook">
        <small>Trasformazione</small>
        <p>{item.transform}</p>
      </div>
    </article>
  );
}

export default function YoutubeNewsPage() {
  const [videos, setVideos] = useState(fallbackVideos);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [loadingTop, setLoadingTop] = useState(true);
  const [feedState, setFeedState] = useState("Caricamento top video...");
  const clickTimerRef = useRef(null);

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
        setFeedState("Top automatici non ancora collegati: uso selezione ponte verificabile.");
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

  function clearPendingClick() {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
  }

  function handlePlay(item) {
    clearPendingClick();

    clickTimerRef.current = window.setTimeout(() => {
      setActiveVideoId(item.id);
      trackClick(`play_inline_${item.id}`);
      clickTimerRef.current = null;
    }, 180);
  }

  function handleOpenYoutube(item) {
    clearPendingClick();
    trackClick(`open_youtube_${item.id}`);
    window.open(item.url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="yn-page" aria-labelledby="youtube-news-title">
      <style>{css}</style>

      <section className="yn-hero">
        <div>
          <p className="yn-eyebrow">LoveMatch360 - YouTube News</p>
          <h1 id="youtube-news-title">Top video reali da trasformare.</h1>
          <p className="yn-lead">
            Una pagina per blogger e creator: video popolari, temi utili e percorsi per trasformarli in YouTube, Facebook, WhatsApp e Blog.
          </p>
        </div>

        <div className="yn-actions">
          <a className="yn-btn primary" href="#video-reali" onClick={() => trackClick("video-reali")}>
            Vedi top video
          </a>
          <Link className="yn-btn secondary" to="/membri" onClick={() => trackClick("membri")}>
            Sono interessato
          </Link>
        </div>

        <div className={loadingTop ? "yn-note" : "yn-note yn-note-ready"}>
          {feedState}
        </div>
      </section>

      <section id="video-reali" className="yn-panel">
        <div className="yn-section-head">
          <div>
            <p className="yn-eyebrow">Selezione dinamica</p>
            <h2>I migliori video disponibili adesso.</h2>
            <p>
              Se la chiave YouTube server è attiva, questa sezione mostra top video reali. Se non è ancora attiva, resta una selezione ponte senza numeri inventati.
            </p>
          </div>

          <div className="yn-mini">
            <strong>{videos.length} video</strong>
            <span>YouTube + Facebook + WhatsApp + Blog</span>
          </div>
        </div>

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

      <section className="yn-panel">
        <p className="yn-eyebrow">Da un video a quattro contenuti</p>
        <h2>Una sola idea deve viaggiare bene.</h2>

        <div className="yn-channel-grid">
          {channels.map((item) => (
            <article className="yn-channel" key={item.label}>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="yn-panel yn-accent">
        <p className="yn-eyebrow">Dietro le quinte</p>
        <h2>Il metodo resta accessibile, ma non disturba il visitatore.</h2>
        <p>
          Le pagine tecniche restano nascoste dal menu principale, ma raggiungibili con link intuitivi per chi vuole capire come vengono scelti i temi.
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
  max-width:820px;
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
.yn-note-ready{
  border-color:rgba(34,197,94,.35);
  background:rgba(34,197,94,.09);
  color:#bbf7d0;
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
.yn-card-active{border-color:rgba(139,92,246,.55)}
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
  min-height:145px;
  border-radius:16px;
  border:1px solid rgba(255,255,255,.10);
  background:#090b10;
  margin-bottom:14px;
  padding:0;
  cursor:pointer;
  text-align:left;
}
.yn-thumb img{
  width:100%;
  height:145px;
  object-fit:cover;
  opacity:.9;
}
.yn-play{
  position:absolute;
  left:14px;
  bottom:14px;
  width:46px;
  height:46px;
  display:grid;
  place-items:center;
  border-radius:999px;
  background:#fff;
  color:#111;
  font-weight:950;
}
.yn-click-help{
  position:absolute;
  right:10px;
  bottom:12px;
  max-width:170px;
  padding:7px 9px;
  border-radius:999px;
  background:rgba(0,0,0,.62);
  color:#fff;
  font-size:11px;
  font-weight:900;
}
.yn-player-wrap{
  overflow:hidden;
  border-radius:16px;
  border:1px solid rgba(139,92,246,.36);
  background:#090b10;
  margin-bottom:14px;
}
.yn-open-youtube{
  width:100%;
  min-height:42px;
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
  min-height:42px;
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
@media(max-width:880px){
  .yn-hero,.yn-section-head{grid-template-columns:1fr}
}
@media(max-width:760px){
  .yn-page{padding:18px 12px 56px}
  .yn-hero,.yn-panel{padding:18px}
  .yn-stats{grid-template-columns:1fr}
  .yn-click-help{left:14px;right:auto;bottom:66px}
}
`;