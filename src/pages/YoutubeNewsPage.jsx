import React from "react";
import { Link } from "react-router-dom";
import { track } from "../lib/analytics.js";

const cards = [
  { label: "Metrics", title: "Cosa pubblicare", text: "Anteprima chiara: cosa preparare, cosa osservare e cosa lasciare fermo." },
  { label: "Playbook", title: "Come trasformare", text: "Dal segnale al video, dal video alla risorsa, dalla risorsa al ritorno." },
  { label: "Libro", title: "Il metodo continua", text: "Dal libro al sito: un percorso reale, non una teoria fredda." },
  { label: "Membri", title: "Dove tornare", text: "Uno spazio per non perdere il filo del progetto." },
];

async function trackClick(target) {
  try {
    await track("youtube_news_click", { target });
  } catch {
    // Nessun errore visibile al visitatore.
  }
}

export default function YoutubeNewsPage() {
  return (
    <main className="youtube-news-page" aria-labelledby="youtube-news-title">
      <style>{css}</style>

      <section className="hero">
        <p className="eyebrow">LoveMatch360 · YouTube News</p>
        <h1 id="youtube-news-title">Video, idee, valore.</h1>
        <p className="lead">Una pagina semplice per seguire cosa funziona, cosa pubblicare e perchè tornare.</p>

        <div className="actions">
          <Link className="btn primary" to="/metrics" onClick={() => trackClick("metrics")}>Apri YouTube Metrics</Link>
          <Link className="btn secondary" to="/playbook" onClick={() => trackClick("playbook")}>Leggi Playbook</Link>
          <Link className="btn ghost" to="/membri" onClick={() => trackClick("membri")}>Entra nei Membri</Link>
        </div>

        <div className="hero-tags">
          <span>Nessuna promessa di guadagno</span>
          <span>Contenuti utili</span>
          <span>Una cosa alla volta</span>
        </div>
      </section>

      <section className="panel reason">
        <p className="eyebrow">Perchè restare</p>
        <h2>Il libro racconta. YouTube mostra. I membri continuano.</h2>
        <p>Qui il visitatore capisce che LoveMatch360 non è fermo: cresce con idee, video, risorse e passaggi ordinati.</p>
      </section>

      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Cosa trovi</p>
            <h2>Le cose utili si vedono subito.</h2>
          </div>
          <p>Non una pagina piena di spiegazioni. Una porta per capire dove andare.</p>
        </div>

        <div className="visit-grid">
          {cards.map((item) => (
            <article className="visit-card" key={item.title}>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel path">
        <p className="eyebrow">Percorso</p>
        <h2>Libro → Video → Metrics → Membri.</h2>
        <p>Il motivo per iscriversi nasce qui: non perdere il seguito del progetto.</p>
        <div className="actions">
          <Link className="btn primary" to="/metrics">Apri YouTube Metrics</Link>
          <Link className="btn secondary" to="/playbook">Leggi Playbook</Link>
          <Link className="btn ghost" to="/membri">Sono interessato</Link>
        </div>
      </section>

      <section className="panel note">
        <p>Questa pagina ha scopo educativo e operativo. Non garantisce guadagni. Le decisioni vanno validate con dati reali.</p>
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
  min-height:100vh;
  padding:132px 16px 82px;
  color:var(--text);
  background:radial-gradient(circle at 8% 0%, rgba(139,92,246,.22), transparent 28%), radial-gradient(circle at 92% 10%, rgba(34,197,94,.10), transparent 26%), var(--bg);
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
}
.hero,.panel{max-width:1180px;margin:0 auto 18px;border:1px solid var(--border);border-radius:12px;background:linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.032));box-shadow:0 24px 80px rgba(0,0,0,.30)}
.hero{padding:38px 30px}
.panel{padding:28px 30px}
.reason,.path{border-color:rgba(139,92,246,.42);background:linear-gradient(135deg,rgba(139,92,246,.14),rgba(255,255,255,.035))}
.eyebrow{margin:0;color:#c4b5fd;font-size:12px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}
h1{margin:14px 0 0;max-width:900px;font-size:clamp(3rem,7vw,5.5rem);line-height:.92;letter-spacing:-.065em;color:#fff}
h2{margin:8px 0 0;max-width:900px;font-size:clamp(1.8rem,4vw,3.3rem);line-height:1.02;letter-spacing:-.05em;color:#fff}
h3{margin:10px 0 0;font-size:22px;line-height:1.12;color:#fff}
.lead,.panel p{max-width:760px;color:var(--muted);line-height:1.65;font-size:16px}
.lead{margin:18px 0 0;font-size:clamp(1.04rem,1.8vw,1.22rem)}
.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.btn{min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;padding:0 16px;text-decoration:none;font-weight:950;border:1px solid transparent;cursor:pointer;font:inherit}
.primary{background:var(--brand);color:#fff}
.secondary{background:rgba(255,255,255,.08);color:#fff;border-color:var(--border)}
.ghost{background:transparent;color:#c4b5fd;border-color:rgba(139,92,246,.45)}
.hero-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.hero-tags span{display:inline-flex;border-radius:999px;padding:6px 10px;background:rgba(139,92,246,.16);border:1px solid rgba(139,92,246,.28);color:#ddd6fe;font-size:12px;font-weight:900}
.section-head{display:flex;gap:18px;align-items:end;justify-content:space-between;flex-wrap:wrap}
.section-head p{margin:0;max-width:430px}
.visit-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin-top:20px}
.visit-card{padding:18px;border:1px solid var(--border);border-radius:12px;background:var(--card)}
.visit-card small{display:block;color:#c4b5fd;font-weight:950;text-transform:uppercase;letter-spacing:.10em}
.visit-card p{color:var(--muted);line-height:1.55}
.note{border-color:rgba(245,158,11,.30);background:rgba(245,158,11,.08)}
.note p{margin:0;color:#fde68a;line-height:1.65;font-weight:850}
@media(max-width:860px){.youtube-news-page{padding-top:112px}.hero,.panel{padding:22px}h1{font-size:clamp(2.6rem,13vw,4rem)}}
`;
