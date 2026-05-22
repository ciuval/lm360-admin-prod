import React from "react";
import { Link } from "react-router-dom";

const highlights = [
  "una storia vera",
  "il metodo una cosa alla volta",
  "un uso responsabile di ChatGPT",
  "strumenti moderni spiegati in modo semplice",
  "sicurezza, privacy e valore economico senza promesse false",
];

const audience = [
  "chi vuole imparare a costruire un sito da zero",
  "chi ha un'idea ma non sa da dove iniziare",
  "chi non si sente tecnico ma vuole capire",
  "giovani che cercano educazione digitale seria",
  "persone adulte che vogliono costruire una nuova possibilita",
  "chi vuole usare ChatGPT con metodo e responsabilita",
];

const futureLinks = [
  "il libro pubblicato, quando sara pronto",
  "il sito LoveMatch360",
  "eventuali risorse Premium realmente disponibili",
  "la guida creare un sito internet indipendente",
  "i libretti collegati al percorso LoveMatch360",
];

export default function LibroDaZeroLoveMatch360() {
  return (
    <main style={pageStyle} aria-labelledby="book-page-title">
      <section style={heroStyle}>
        <p style={badgeStyle}>Libro in preparazione</p>

        <h1 id="book-page-title" style={titleStyle}>
          Da Zero a LoveMatch360
        </h1>

        <p style={subtitleStyle}>
          Una storia vera su come costruire un progetto digitale partendo da zero,
          usando ChatGPT come guida, strumenti moderni e un metodo semplice:
          una cosa alla volta.
        </p>

        <div style={statusGridStyle} aria-label="Stato del percorso">
          <div style={statusCardStyle}>
            <span style={statusLabelStyle}>Stato libro</span>
            <strong style={statusValueStyle}>in preparazione</strong>
          </div>
          <div style={statusCardStyle}>
            <span style={statusLabelStyle}>Pagina</span>
            <strong style={statusValueStyle}>bozza nascosta</strong>
          </div>
          <div style={statusCardStyle}>
            <span style={statusLabelStyle}>Pubblicazione</span>
            <strong style={statusValueStyle}>non ancora attiva</strong>
          </div>
        </div>

        <div style={ctaRowStyle}>
          <Link to="/" style={primaryLinkStyle}>
            Scopri LoveMatch360
          </Link>
          <span style={softNoteStyle}>
            Nessuna vendita o download e attivo da questa pagina.
          </span>
        </div>
      </section>

      <section style={sectionStyle} aria-labelledby="book-intro-title">
        <h2 id="book-intro-title" style={sectionTitleStyle}>
          Non serve partire perfetti. Serve partire ordinati.
        </h2>

        <p style={textStyle}>
          Da Zero a LoveMatch360 racconta il percorso reale di un progetto nato
          passo dopo passo: dall'idea iniziale alla costruzione di un sito vivo,
          con metodo, controlli, errori corretti e decisioni prese con prudenza.
        </p>

        <p style={textStyle}>
          Il libro nasce dal lavoro concreto su LoveMatch360 e mostra come
          ChatGPT possa aiutare a ragionare, scrivere, organizzare e verificare.
          Ma il controllo resta umano: capire, scegliere, provare e continuare.
        </p>

        <p style={strongTextStyle}>
          Questa non e una promessa facile. E un percorso.
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="why-title">
        <h2 id="why-title" style={sectionTitleStyle}>
          Perche questo libro
        </h2>

        <p style={textStyle}>
          Questo libro nasce da un bisogno reale: costruire una possibilita nuova,
          senza fingere che la tecnologia risolva tutto da sola.
        </p>

        <p style={textStyle}>
          LoveMatch360 e il laboratorio vivo di questo percorso. Il libro racconta
          il metodo, il sito mostra il lavoro in evoluzione, e questa pagina sara
          il ponte tra i due.
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="content-title">
        <h2 id="content-title" style={sectionTitleStyle}>
          Cosa troverai nel libro
        </h2>

        <div style={gridStyle}>
          {highlights.map((item) => (
            <article key={item} style={itemStyle}>
              <span style={checkStyle}>OK</span>
              <p style={itemTextStyle}>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={sectionStyle} aria-labelledby="not-title">
        <h2 id="not-title" style={sectionTitleStyle}>
          Cosa non e questo libro
        </h2>

        <p style={textStyle}>
          Questo libro non vende illusioni, non promette risultati economici assicurati, non dice che ChatGPT sostituisce la persona e non presenta
          scorciatoie magiche.
        </p>

        <p style={strongTextStyle}>
          La speranza concreta nasce dal lavoro ordinato.
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="audience-title">
        <h2 id="audience-title" style={sectionTitleStyle}>
          Per chi e pensato
        </h2>

        <ul style={listStyle}>
          {audience.map((item) => (
            <li key={item} style={listItemStyle}>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section style={sectionStyle} aria-labelledby="lm360-title">
        <h2 id="lm360-title" style={sectionTitleStyle}>
          Il collegamento con LoveMatch360
        </h2>

        <p style={textStyle}>
          LoveMatch360 non e solo il nome del progetto. E il luogo dove il metodo
          viene provato.
        </p>

        <p style={textStyle}>
          Il sito continuera a crescere con pagine, risorse, contenuti educativi
          e aggiornamenti collegati al percorso. Quando il libro sara pronto per
          la pubblicazione, questa pagina potra essere aggiornata con i riferimenti
          ufficiali, la copertina definitiva e i collegamenti corretti.
        </p>

        <p style={noteBoxStyle}>
          Fino ad allora, questa pagina resta una presentazione prudente del
          percorso in preparazione.
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="future-title">
        <h2 id="future-title" style={sectionTitleStyle}>
          Collegamenti futuri possibili
        </h2>

        <div style={gridStyle}>
          {futureLinks.map((item) => (
            <article key={item} style={itemStyle}>
              <p style={itemTextStyle}>{item}</p>
            </article>
          ))}
        </div>

        <p style={noteBoxStyle}>
          Ogni collegamento dovra essere chiaro, verificato e coerente con cio
          che e davvero disponibile.
        </p>
      </section>

      <section style={finalStyle} aria-labelledby="final-title">
        <h2 id="final-title" style={sectionTitleStyle}>
          Segui il percorso mentre prende forma
        </h2>

        <p style={textStyle}>
          Il libro e in preparazione, ma il progetto LoveMatch360 e gia vivo.
          Questa pagina sara aggiornata passo dopo passo, con prudenza, ordine
          e rispetto per chi legge.
        </p>

        <Link to="/" style={primaryLinkStyle}>
          Torna a LoveMatch360
        </Link>
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  padding: "32px 16px 72px",
  background:
    "radial-gradient(circle at top left, rgba(240,143,192,0.18), transparent 34%), #09090d",
  color: "#f6f6f6",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
};

const heroStyle = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "34px 24px",
  borderRadius: 28,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
  boxShadow: "0 24px 80px rgba(0,0,0,0.34)",
};

const badgeStyle = {
  display: "inline-flex",
  margin: 0,
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(240,143,192,0.32)",
  background: "rgba(240,143,192,0.12)",
  color: "#ffd7ea",
  fontSize: 13,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: "18px 0 0",
  maxWidth: 850,
  fontSize: "clamp(2.6rem, 8vw, 5.4rem)",
  lineHeight: 0.95,
  letterSpacing: "-0.05em",
};

const subtitleStyle = {
  margin: "22px 0 0",
  maxWidth: 760,
  fontSize: "clamp(1.05rem, 2.3vw, 1.35rem)",
  lineHeight: 1.65,
  color: "rgba(255,255,255,0.82)",
};

const statusGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 12,
  marginTop: 28,
};

const statusCardStyle = {
  padding: 16,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.24)",
};

const statusLabelStyle = {
  display: "block",
  marginBottom: 8,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.55)",
};

const statusValueStyle = {
  display: "block",
  fontSize: 18,
};

const ctaRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 16,
  marginTop: 28,
};

const primaryLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 999,
  background: "#f08fc0",
  color: "#111",
  textDecoration: "none",
  fontWeight: 900,
};

const softNoteStyle = {
  color: "rgba(255,255,255,0.66)",
  lineHeight: 1.6,
};

const sectionStyle = {
  maxWidth: 1080,
  margin: "22px auto 0",
  padding: "26px 24px",
  borderRadius: 24,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.045)",
};

const finalStyle = {
  ...sectionStyle,
  border: "1px solid rgba(240,143,192,0.28)",
  background: "rgba(240,143,192,0.08)",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "clamp(1.45rem, 3vw, 2rem)",
  lineHeight: 1.15,
};

const textStyle = {
  margin: "14px 0 0",
  maxWidth: 850,
  fontSize: 16,
  lineHeight: 1.75,
  color: "rgba(255,255,255,0.82)",
};

const strongTextStyle = {
  margin: "16px 0 0",
  maxWidth: 780,
  fontSize: 18,
  lineHeight: 1.65,
  color: "#ffd7ea",
  fontWeight: 800,
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 12,
  marginTop: 20,
};

const itemStyle = {
  padding: 16,
  borderRadius: 18,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.22)",
};

const checkStyle = {
  display: "inline-flex",
  marginBottom: 10,
  padding: "4px 8px",
  borderRadius: 999,
  background: "rgba(74,222,128,0.14)",
  color: "#baf7c8",
  fontSize: 12,
  fontWeight: 900,
};

const itemTextStyle = {
  margin: 0,
  lineHeight: 1.6,
  color: "rgba(255,255,255,0.8)",
};

const listStyle = {
  margin: "18px 0 0",
  paddingLeft: 22,
  color: "rgba(255,255,255,0.82)",
  lineHeight: 1.8,
};

const listItemStyle = {
  marginBottom: 6,
};

const noteBoxStyle = {
  margin: "18px 0 0",
  padding: 16,
  borderRadius: 18,
  border: "1px solid rgba(240,143,192,0.22)",
  background: "rgba(240,143,192,0.08)",
  color: "rgba(255,255,255,0.82)",
  lineHeight: 1.7,
};
