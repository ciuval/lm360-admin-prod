// src/pages/GuideIndex.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

/**
 * Piccolo indice guide con 3 card come da tuo layout.
 * - Legge ?track=... dalla URL (es. "rel-pro", "biz-quick", "focus-light")
 * - Evidenzia la card più rilevante e scorre in pagina
 * - Precompila la ricerca (se in futuro aggiungi filtri)
 */

const CARDS = [
  {
    id: "welcome",
    title: "Benvenuto su LM360",
    summary: "Da dove iniziare per ottenere valore in 24 ore.",
    href: "/guide#benvenuto",
    premium: false,
  },
  {
    id: "diag",
    title: "Diagnosi Rapida",
    summary: "Questionario in 60s per capire il percorso.",
    href: "/diagnosi",
    premium: false,
    cta: "Fai la diagnosi (60s)",
  },
  {
    id: "pro",
    title: "Percorsi PRO",
    summary: "Template e modelli per accelerare.",
    href: "/premium",
    premium: true,
    badge: "Premium",
  },
];

// mappa grezza: qualunque track suggerita porta a dare priorità alla card PRO
function pickCardByTrack(track) {
  if (!track) return "welcome";
  // se contiene "rel" o "biz" o "focus" → diamo priorità ai Percorsi PRO
  if (/^(rel|biz|focus)/i.test(track)) return "pro";
  return "welcome";
}

export default function GuideIndex() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const preselectedTrack = params.get("track") || "";
  const highlightId = useMemo(() => pickCardByTrack(preselectedTrack), [preselectedTrack]);

  const [search, setSearch] = useState(preselectedTrack);

  useEffect(() => {
    if (highlightId) {
      const el = document.getElementById(`card-${highlightId}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
      }
    }
  }, [highlightId]);

  const go = (href) => navigate(href);

  return (
    <div style={page}>
      <h2 style={title}>Guide</h2>

      {/* banner suggerimento */}
      {preselectedTrack && (
        <div role="status" aria-live="polite" style={tip}>
          Percorso consigliato: <code>{preselectedTrack}</code>{" "}
          <span style={{ opacity: 0.8 }}>— contenuti prioritari evidenziati.</span>
        </div>
      )}

      {/* azione primaria */}
      <button onClick={() => go("/diagnosi")} style={primaryBtn}>
        🔎 Fai la diagnosi (60s)
      </button>

      {/* ricerca (per futuri filtri) */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Cerca una guida..."
        aria-label="Cerca guida"
        style={searchBox}
      />

      {/* cards */}
      <div style={{ display: "grid", gap: 12 }}>
        {CARDS.map((c) => (
          <article
            key={c.id}
            id={`card-${c.id}`}
            style={{
              ...card,
              outline: c.id === highlightId ? "2px solid #f08fc0" : "1px solid #2b2b2b",
              boxShadow: c.id === highlightId ? "0 0 14px rgba(240,143,192,.4)" : "none",
            }}
          >
            <header style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <h3 style={{ margin: 0 }}>{c.title}</h3>
              {c.badge && <span style={badge}>{c.badge}</span>}
            </header>
            <p style={{ margin: "0 0 10px", opacity: 0.8 }}>{c.summary}</p>

            {c.cta ? (
              <button onClick={() => go(c.href)} style={smallBtn}>
                {c.cta}
              </button>
            ) : (
              <Link to={c.href} style={linkBtn} aria-label={`Apri ${c.title}`}>
                Apri
              </Link>
            )}
          </article>
        ))}
      </div>

      <footer style={{ marginTop: 18, opacity: 0.6 }}>
        <Link to="/privacy">Privacy</Link> · <Link to="/terms">Termini</Link> ·{" "}
        <Link to="/cookies">Cookie</Link> · <Link to="/supporto">Supporto</Link>
      </footer>
    </div>
  );
}

/* ---------------------- Stili ---------------------- */
const page = { maxWidth: 900, margin: "0 auto", padding: "1rem" };
const title = { color: "#f08fc0", textShadow: "0 0 8px #f08fc0" };
const tip = {
  background: "#221b22",
  border: "1px solid #3a2a38",
  padding: "8px 10px",
  borderRadius: 8,
  marginBottom: 12,
};
const primaryBtn = {
  background: "#1e88e5",
  color: "#fff",
  border: "none",
  padding: "10px 14px",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
  marginBottom: 12,
};
const searchBox = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #2b2b2b",
  background: "#1c1c1c",
  color: "#fff",
  marginBottom: 12,
};
const card = {
  background: "#1c1c1c",
  borderRadius: 10,
  padding: "12px 14px",
};
const badge = {
  background: "#f08fc0",
  color: "#111",
  borderRadius: 999,
  padding: "2px 8px",
  fontSize: 12,
  fontWeight: 700,
};
const smallBtn = {
  background: "#1e88e5",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  fontWeight: 700,
  cursor: "pointer",
};
const linkBtn = {
  background: "transparent",
  color: "#8ab4ff",
  textDecoration: "underline",
};
