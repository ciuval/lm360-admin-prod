import React from "react";
import { Link } from "react-router-dom";

const italianLinks = [
  {
    label: "Kindle eBook",
    note: "Edizione italiana digitale",
    href: "https://www.amazon.it/dp/B0H5Q93YDZ",
    asin: "B0H5Q93YDZ",
  },
  {
    label: "Copertina flessibile",
    note: "Edizione italiana paperback",
    href: "https://www.amazon.it/dp/B0H5QJD66Z",
    asin: "B0H5QJD66Z",
  },
];

const englishLinks = [
  {
    label: "Kindle eBook",
    note: "English digital edition",
    href: "https://www.amazon.com/dp/B0H4Z85B1K",
    asin: "B0H4Z85B1K",
  },
  {
    label: "Paperback",
    note: "English paperback edition",
    href: "https://www.amazon.com/dp/B0H55ZR1LQ",
    asin: "B0H55ZR1LQ",
  },
];

const highlights = [
  "una storia vera trasformata in metodo",
  "un percorso una cosa alla volta",
  "ChatGPT usato come assistente, non come pilota automatico",
  "strumenti moderni: GitHub, Vercel, Supabase e controlli",
  "sicurezza, privacy e valore senza promesse facili",
];

const audience = [
  "chi vuole creare un sito partendo da zero",
  "chi ha un progetto digitale ma cerca ordine",
  "chi vuole usare AI e strumenti moderni con responsabilità",
  "giovani e adulti che vogliono imparare un metodo pratico",
  "chi vuole costruire valore senza scorciatoie o illusioni",
];

const checks = [
  "Kindle italiano Live",
  "Paperback italiano Live",
  "Copia autore italiana controllata",
  "QR LoveMatch360 verificati",
  "Acquisto gestito solo da Amazon",
];

export default function LibroDaZeroLoveMatch360() {
  return (
    <main style={pageStyle} aria-labelledby="book-page-title">
      <section style={heroStyle}>
        <p style={badgeStyle}>Libro disponibile</p>

        <h1 id="book-page-title" style={titleStyle}>
          Da Zero a LoveMatch360
        </h1>

        <p style={subtitleStyle}>
          Una storia vera e una guida pratica su come trasformare un’idea in un
          progetto digitale reale: sito, libro, AI, controlli, pubblicazione e
          miglioramento continuo.
        </p>

        <div style={statusGridStyle} aria-label="Stato del libro">
          <div style={statusCardStyle}>
            <span style={statusLabelStyle}>Edizione italiana</span>
            <strong style={statusValueStyle}>Kindle e paperback Live</strong>
          </div>
          <div style={statusCardStyle}>
            <span style={statusLabelStyle}>Edizione inglese</span>
            <strong style={statusValueStyle}>Kindle e paperback Live</strong>
          </div>
          <div style={statusCardStyle}>
            <span style={statusLabelStyle}>Acquisto</span>
            <strong style={statusValueStyle}>solo su Amazon</strong>
          </div>
        </div>

        <div style={ctaRowStyle}>
          <a
            href="https://www.amazon.it/dp/B0H5Q93YDZ"
            target="_blank"
            rel="noreferrer"
            style={primaryLinkStyle}
          >
            Compra Kindle italiano
          </a>
          <a
            href="https://www.amazon.it/dp/B0H5QJD66Z"
            target="_blank"
            rel="noreferrer"
            style={secondaryLinkStyle}
          >
            Compra paperback italiano
          </a>
          <a
            href="https://www.amazon.com/author/valeriuslovematch360"
            target="_blank"
            rel="noreferrer"
            style={ghostLinkStyle}
          >
            Pagina autore
          </a>
        </div>

        <p style={softNoteStyle}>
          Questa pagina non vende direttamente, non raccoglie dati di pagamento
          e non avvia checkout interno. L’acquisto avviene sulle pagine Amazon.
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="buy-title">
        <h2 id="buy-title" style={sectionTitleStyle}>
          Acquista il libro
        </h2>

        <div style={editionGridStyle}>
          <EditionCard
            title="Edizione italiana"
            description="Da Zero a LoveMatch360"
            marketplace="Amazon.it"
            links={italianLinks}
          />

          <EditionCard
            title="English edition"
            description="From Zero to LoveMatch360"
            marketplace="Amazon.com"
            links={englishLinks}
          />
        </div>
      </section>

      <section style={sectionStyle} aria-labelledby="intro-title">
        <h2 id="intro-title" style={sectionTitleStyle}>
          Non serve partire perfetti. Serve partire ordinati.
        </h2>

        <p style={textStyle}>
          Il libro racconta il percorso reale di LoveMatch360: dall’idea iniziale
          alla costruzione del sito, dall’uso dell’AI ai controlli finali, fino
          alla pubblicazione del libro e alla verifica della copia fisica.
        </p>

        <p style={textStyle}>
          Non è una promessa di guadagno facile e non vende scorciatoie. È un
          metodo narrativo e pratico per chi vuole costruire un progetto online
          con ordine, prudenza e responsabilità.
        </p>

        <p style={strongTextStyle}>
          La tecnologia aiuta. Il controllo resta umano.
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
          Cosa non è questo libro
        </h2>

        <p style={textStyle}>
          Non è consulenza legale, fiscale, finanziaria o tecnica certificata.
          Non promette risultati economici assicurati, clienti garantiti o
          successo automatico. Non dice che ChatGPT sostituisce la persona.
        </p>

        <p style={strongTextStyle}>
          Il valore nasce da lavoro ordinato, verifiche e responsabilità.
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="audience-title">
        <h2 id="audience-title" style={sectionTitleStyle}>
          Per chi è pensato
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
          LoveMatch360 è il laboratorio vivo del percorso raccontato nel libro.
          Il sito continua a crescere con pagine, risorse e controlli, ma senza
          promettere ciò che non è davvero disponibile.
        </p>

        <div style={ctaRowStyle}>
          <Link to="/" style={secondaryLinkStyle}>
            Visita LoveMatch360
          </Link>
          <Link to="/premium/libretti" style={ghostLinkStyle}>
            Area Premium libretti
          </Link>
        </div>

        <p style={noteBoxStyle}>
          I QR presenti nel paperback puntano al sito e all’area Premium libretti.
          La pagina Premium resta prudente: nessun download non protetto, nessuna
          promessa falsa, nessun acquisto interno da questa pagina.
        </p>
      </section>

      <section style={sectionStyle} aria-labelledby="checks-title">
        <h2 id="checks-title" style={sectionTitleStyle}>
          Controlli completati
        </h2>

        <div style={gridStyle}>
          {checks.map((item) => (
            <article key={item} style={itemStyle}>
              <span style={checkStyle}>PASS</span>
              <p style={itemTextStyle}>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={finalStyle} aria-labelledby="final-title">
        <h2 id="final-title" style={sectionTitleStyle}>
          Segui il progetto mentre cresce
        </h2>

        <p style={textStyle}>
          Il libro documenta un percorso concreto: partire, costruire, correggere,
          pubblicare e continuare. LoveMatch360 rimane il punto vivo dove questo
          metodo viene verificato nel tempo.
        </p>

        <div style={ctaRowStyle}>
          <a
            href="https://www.amazon.it/dp/B0H5Q93YDZ"
            target="_blank"
            rel="noreferrer"
            style={primaryLinkStyle}
          >
            Apri su Amazon.it
          </a>
          <Link to="/" style={ghostLinkStyle}>
            Torna al sito
          </Link>
        </div>
      </section>
    </main>
  );
}

function EditionCard({ title, description, marketplace, links }) {
  return (
    <article style={editionCardStyle}>
      <p style={editionBadgeStyle}>{marketplace}</p>
      <h3 style={editionTitleStyle}>{title}</h3>
      <p style={editionDescriptionStyle}>{description}</p>

      <div style={formatListStyle}>
        {links.map((item) => (
          <a
            key={item.asin}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            style={formatLinkStyle}
          >
            <span>
              <strong>{item.label}</strong>
              <small style={formatNoteStyle}>{item.note}</small>
            </span>
            <span style={asinStyle}>{item.asin}</span>
          </a>
        ))}
      </div>
    </article>
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
  maxWidth: 780,
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
  gap: 12,
  marginTop: 24,
};

const linkBaseStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 46,
  padding: "0 18px",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 900,
};

const primaryLinkStyle = {
  ...linkBaseStyle,
  background: "#f08fc0",
  color: "#111",
};

const secondaryLinkStyle = {
  ...linkBaseStyle,
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
};

const ghostLinkStyle = {
  ...linkBaseStyle,
  background: "transparent",
  border: "1px solid rgba(240,143,192,0.35)",
  color: "#ffd7ea",
};

const softNoteStyle = {
  margin: "18px 0 0",
  maxWidth: 850,
  color: "rgba(255,255,255,0.68)",
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
  maxWidth: 860,
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

const editionGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 16,
  marginTop: 20,
};

const editionCardStyle = {
  padding: 18,
  borderRadius: 22,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(0,0,0,0.24)",
};

const editionBadgeStyle = {
  display: "inline-flex",
  margin: 0,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(74,222,128,0.12)",
  color: "#baf7c8",
  fontSize: 12,
  fontWeight: 900,
};

const editionTitleStyle = {
  margin: "14px 0 0",
  fontSize: 24,
};

const editionDescriptionStyle = {
  margin: "8px 0 0",
  color: "rgba(255,255,255,0.74)",
  lineHeight: 1.55,
};

const formatListStyle = {
  display: "grid",
  gap: 10,
  marginTop: 18,
};

const formatLinkStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  padding: 14,
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  textDecoration: "none",
};

const formatNoteStyle = {
  display: "block",
  marginTop: 4,
  color: "rgba(255,255,255,0.58)",
};

const asinStyle = {
  color: "#ffd7ea",
  fontWeight: 800,
  whiteSpace: "nowrap",
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