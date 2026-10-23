import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const links = {
  itKindle: "https://www.amazon.it/dp/B0H5Q93YDZ",
  itPaperback: "https://www.amazon.it/dp/B0H5QJD66Z",
  enKindle: "https://www.amazon.com/dp/B0H4Z85B1K",
  enPaperback: "https://www.amazon.com/dp/B0H55ZR1LQ",
  authorCentral: "https://www.amazon.com/author/valeriuslovematch360",
};

const editions = [
  {
    eyebrow: "Edizione italiana",
    lang: "it",
    title: "Da Zero a LoveMatch360",
    subtitle: "Come creare un progetto sito internet indipendente con AI e strumenti moderni",
    description:
      "Una storia vera trasformata in metodo: idea, AI, sito, controlli, pubblicazione e continuità. Per chi vuole costruire con ordine, senza fuffa e senza promesse facili.",
    meta: ["Italiano", "Kindle", "Copertina flessibile"],
    primaryLabel: "Kindle su Amazon.it",
    primaryHref: links.itKindle,
    secondaryLabel: "Cartaceo su Amazon.it",
    secondaryHref: links.itPaperback,
  },
  {
    eyebrow: "English edition",
    lang: "en",
    title: "From Zero to LoveMatch360",
    subtitle: "How to Create an Independent Website Project with AI and Modern Tools",
    description:
      "The English edition documents the same path: building a real digital project with modern tools, practical checks, and human responsibility.",
    meta: ["English", "Kindle", "Paperback"],
    primaryLabel: "Kindle on Amazon.com",
    primaryHref: links.enKindle,
    secondaryLabel: "Paperback on Amazon.com",
    secondaryHref: links.enPaperback,
  },
];

const learningPoints = [
  "Il metodo «una cosa alla volta»: organizzare il lavoro e verificare ogni passaggio.",
  "Esempi di prompt per lavorare con ChatGPT e mantenere il controllo del progetto.",
  "Il percorso per creare e pubblicare un sito: strumenti, prove e correzioni.",
  "Checklist operative e preparazione alla pubblicazione del libro su Amazon KDP.",
];

export default function LibroPage() {
  useEffect(() => {
    document.title = "Libro LoveMatch360 | Da Zero a LoveMatch360";

    const description =
      "Da Zero a LoveMatch360, di Valerius: una storia vera, esempi di prompt e checklist per creare un sito con AI e strumenti moderni. Leggi un estratto e scegli l’edizione.";

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  return (
    <main className="lm-book-page" aria-labelledby="lm-book-title">
      <style>{styles}</style>

      <section className="lm-book-hero" aria-label="Presentazione libro LoveMatch360">
        <p className="lm-book-kicker">Libri LoveMatch360</p>
        <h1 id="lm-book-title">Da Zero a LoveMatch360</h1>
        <p className="lm-book-byline">
          di <a href={links.authorCentral} target="_blank" rel="noreferrer">Valerius</a> · Storia vera e guida pratica
        </p>
        <p className="lm-book-lead">
          Vuoi creare un sito e cerchi un punto da cui iniziare? Il libro racconta il
          percorso di LoveMatch360: dall’idea alla pubblicazione, con ChatGPT, strumenti
          moderni, controlli ed errori corretti lungo il cammino.
        </p>

        <div className="lm-book-hero-actions" aria-label="Azioni principali">
          <a className="lm-book-btn lm-book-btn-primary" href={links.itKindle} target="_blank" rel="noreferrer">
            eBook Kindle · Italiano
          </a>
          <a className="lm-book-btn lm-book-btn-secondary" href={links.itPaperback} target="_blank" rel="noreferrer">
            Cartaceo · Italiano
          </a>
          <button
            className="lm-book-btn lm-book-btn-ghost"
            type="button"
            onClick={() => document.getElementById("lm-book-excerpt-title")?.focus()}
          >
            Leggi un estratto
          </button>
        </div>

        <p className="lm-book-note">
          Acquisto su Amazon. Prezzo e disponibilità sono indicati nella pagina del formato scelto.
        </p>
      </section>

      <section className="lm-book-section lm-book-excerpt" aria-labelledby="lm-book-excerpt-title">
        <p className="lm-book-kicker">Leggi un estratto</p>
        <h2 id="lm-book-excerpt-title" tabIndex={-1}>
          Non serve partire perfetti. Serve partire ordinati.
        </h2>
        <blockquote>
          <p>
            Non tutti iniziano da una posizione comoda. A volte un progetto digitale nasce
            dopo anni di fatica fisica, lavori pesanti e paura di non avere abbastanza tempo.
            Proprio da lì può nascere il bisogno di costruire qualcosa di più ordinato.
          </p>
        </blockquote>
        <p className="lm-book-source">
          Da <cite>Da Zero a LoveMatch360</cite>, Parte I, capitolo 1: «Un punto di partenza umano».
        </p>
      </section>

      <section className="lm-book-grid" aria-label="Edizioni disponibili">
        {editions.map((edition) => (
          <article className="lm-book-card" key={edition.title} lang={edition.lang}>
            <p className="lm-book-eyebrow">{edition.eyebrow}</p>
            <h2>{edition.title}</h2>
            <p className="lm-book-subtitle">{edition.subtitle}</p>
            <p>{edition.description}</p>

            <ul className="lm-book-meta" aria-label={`${edition.lang === "en" ? "Formats" : "Formati"} ${edition.title}`}>
              {edition.meta.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="lm-book-card-actions">
              <a className="lm-book-btn lm-book-btn-primary" href={edition.primaryHref} target="_blank" rel="noreferrer">
                {edition.primaryLabel}
              </a>
              <a className="lm-book-btn lm-book-btn-ghost" href={edition.secondaryHref} target="_blank" rel="noreferrer">
                {edition.secondaryLabel}
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="lm-book-section" aria-labelledby="lm-book-inside-title">
        <div>
          <p className="lm-book-kicker">Cosa trovi dentro</p>
          <h2 id="lm-book-inside-title">Metodo, prove, errori corretti e una direzione.</h2>
        </div>

        <div className="lm-book-points">
          {learningPoints.map((point, index) => (
            <article className="lm-book-point" key={point}>
              <span aria-hidden="true">{index + 1}</span>
              <p>{point}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lm-book-section lm-book-split" aria-labelledby="lm-book-reader-title">
        <div>
          <p className="lm-book-kicker">Per chi è</p>
          <h2 id="lm-book-reader-title">Per chi vuole partire senza sentirsi perso.</h2>
          <p>
            È pensato per chi ha un’idea di sito e vuole imparare a trasformarla in un
            progetto con ordine. Il racconto si alterna a indicazioni pratiche, prompt
            e checklist da adattare al proprio lavoro.
          </p>
        </div>

        <aside className="lm-book-trust" aria-label="Nota etica">
          <h3>Cosa non promette</h3>
          <p>
            Non promette guadagni garantiti, clienti automatici o risultati immediati.
            Mostra un percorso reale: pensare, costruire, verificare, correggere e continuare.
          </p>
        </aside>
      </section>

      <section className="lm-book-section lm-book-resources" aria-labelledby="lm-book-resources-title">
        <div>
          <p className="lm-book-kicker">Dopo il libro</p>
          <h2 id="lm-book-resources-title">Il sito continua il percorso.</h2>
          <p>
            LoveMatch360 è il progetto da cui nasce questo percorso. Puoi visitare il sito
            e conoscere l’autore per dare un contesto concreto a quello che leggi.
          </p>
        </div>

        <div className="lm-book-resource-actions">
          <Link className="lm-book-btn lm-book-btn-secondary" to="/">
            Visita LoveMatch360
          </Link>
          <a className="lm-book-btn lm-book-btn-ghost" href={links.authorCentral} target="_blank" rel="noreferrer">
            Pagina autore
          </a>
        </div>
      </section>
    </main>
  );
}

const styles = `
.lm-book-page,
.lm-book-page * {
  box-sizing: border-box;
}

.lm-book-page {
  color: #f7f3ff;
  background:
    radial-gradient(circle at top left, rgba(236, 72, 153, 0.2), transparent 34rem),
    linear-gradient(180deg, #090910 0%, #11111a 52%, #090910 100%);
  min-height: 100vh;
  padding: clamp(1.25rem, 2vw, 2rem);
}

.lm-book-page h1,
.lm-book-page h2,
.lm-book-page h3,
.lm-book-page p {
  overflow-wrap: anywhere;
}

.lm-book-page a:not(.lm-book-btn) {
  color: inherit;
}

.lm-book-page a:focus-visible {
  outline: 3px solid rgba(255, 122, 195, 0.7);
  outline-offset: 3px;
}

.lm-book-hero,
.lm-book-section,
.lm-book-card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.055);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
}

.lm-book-hero {
  max-width: 1120px;
  margin: 0 auto 1rem;
  padding: clamp(2rem, 5vw, 4.5rem);
  border-radius: 2rem;
}

.lm-book-kicker,
.lm-book-eyebrow {
  margin: 0 0 0.75rem;
  color: #ff7ac3;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lm-book-hero h1 {
  max-width: 760px;
  margin: 0;
  font-size: clamp(2.4rem, 8vw, 5.8rem);
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.lm-book-lead {
  max-width: 720px;
  margin: 1.4rem 0 0;
  color: rgba(247, 243, 255, 0.84);
  font-size: clamp(1.05rem, 2.2vw, 1.45rem);
  line-height: 1.55;
}

.lm-book-byline {
  margin: 1rem 0 0;
  color: rgba(247, 243, 255, 0.84);
  line-height: 1.6;
}

.lm-book-excerpt blockquote {
  margin: 1.25rem 0 0;
  padding-left: 1.25rem;
  border-left: 3px solid #ff7ac3;
}

.lm-book-excerpt blockquote p {
  max-width: 760px;
  font-size: 1.1rem;
}

.lm-book-excerpt .lm-book-source {
  font-size: 0.92rem;
}

.lm-book-excerpt h2:focus {
  outline: 3px solid rgba(255, 122, 195, 0.7);
  outline-offset: 6px;
}

.lm-book-hero-actions,
.lm-book-card-actions,
.lm-book-resource-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.lm-book-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.78rem 1rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.35;
  font-weight: 800;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.lm-book-btn:focus-visible {
  outline: 3px solid rgba(255, 122, 195, 0.7);
  outline-offset: 3px;
}

.lm-book-btn:hover {
  transform: translateY(-1px);
}
.lm-book-page .lm-book-btn-primary {
  background: #ff7ac3;
  color: #110814;
}
.lm-book-page .lm-book-btn-secondary {
  background: #f7f3ff;
  color: #11111a;
}
.lm-book-page .lm-book-btn-ghost {
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.04);
  color: #f7f3ff;
}

.lm-book-note {
  margin: 1rem 0 0;
  color: rgba(247, 243, 255, 0.62);
  font-size: 0.94rem;
}

.lm-book-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  max-width: 1120px;
  margin: 0 auto 1rem;
}

.lm-book-card,
.lm-book-section {
  border-radius: 1.5rem;
  padding: clamp(1.25rem, 3vw, 2rem);
}

.lm-book-card h2,
.lm-book-section h2 {
  margin: 0;
  font-size: clamp(1.45rem, 3vw, 2.35rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.lm-book-subtitle {
  color: rgba(247, 243, 255, 0.74);
  font-weight: 700;
}

.lm-book-card p,
.lm-book-section p {
  color: rgba(247, 243, 255, 0.78);
  line-height: 1.65;
}

.lm-book-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  padding: 0;
  margin: 1.1rem 0 0;
  list-style: none;
}

.lm-book-meta li {
  border: 1px solid rgba(255, 122, 195, 0.32);
  background: rgba(255, 122, 195, 0.1);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
  color: rgba(247, 243, 255, 0.82);
  font-size: 0.9rem;
  font-weight: 700;
}

.lm-book-section {
  max-width: 1120px;
  margin: 0 auto 1rem;
}

.lm-book-points {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;
  margin-top: 1.4rem;
}

.lm-book-point {
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.18);
}

.lm-book-point span {
  display: inline-flex;
  width: 2rem;
  height: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 122, 195, 0.18);
  color: #ff9bd2;
  font-weight: 900;
}

.lm-book-point p {
  margin-bottom: 0;
}

.lm-book-split,
.lm-book-resources {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
  gap: 1rem;
  align-items: stretch;
}

.lm-book-trust {
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 1.25rem;
  padding: 1.2rem;
  background: rgba(0, 0, 0, 0.24);
}

.lm-book-trust h3 {
  margin-top: 0;
  color: #ffffff;
}

@media (max-width: 840px) {
  .lm-book-grid,
  .lm-book-points,
  .lm-book-split,
  .lm-book-resources {
    grid-template-columns: 1fr;
  }

  .lm-book-hero {
    border-radius: 1.4rem;
  }

  .lm-book-hero h1 {
    font-size: clamp(1.85rem, 7vw, 3.4rem);
    line-height: 1.04;
  }

  .lm-book-btn {
    width: 100%;
  }
}
`;


