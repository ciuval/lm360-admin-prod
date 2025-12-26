// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main id="main" role="main" tabIndex={-1} style={page}>
      <section style={hero}>
        <p style={eyebrow} aria-label="Tagline">Onestà • Semplicità • Progresso</p>
        <h1 style={h1}>
          Consigli che <span style={accentTxt}>funzionano davvero</span>
        </h1>
        <p style={sub}>
          Guide pratiche e mentori verificati per <strong>relazioni sane</strong>, <strong>lavoro dignitoso</strong> e <strong>finanza onesta</strong>.
          Zero fuffa: solo passi concreti e misurabili.
        </p>

        <div style={ctaWrap}>
          <Link to="/diagnosi" style={btnPrimary} aria-label="Fai la diagnosi in 60 secondi">
            Fai la diagnosi (60s)
          </Link>
          <Link to="/registrati" style={btnGhost} aria-label="Prova gratis">
            Prova gratis
          </Link>
          <Link to="/premium" style={btnGhost} aria-label="Scopri il piano Premium">
            Scopri Premium
          </Link>
          {/* 👇 New: link diretto alla lista guide */}
          <Link to="/guide" style={btnGhost} aria-label="Vai alle Guide">
            Vai alle Guide
          </Link>
        </div>

        <ul style={bullets} aria-label="Perché scegliere LoveMatch360">
          <li>✅ 1 guida gratuita per iniziare</li>
          <li>✅ Diagnosi semplice e piani passo‑passo</li>
          <li>✅ Community sicura e inclusiva</li>
        </ul>
      </section>
    </main>
  );
}

/* ---- STILI ---- */
const page = {
  minHeight: "calc(100vh - 80px)",
  display: "grid",
  placeItems: "center",
  padding: "2rem",
  background: "#0f1115",
  color: "#E6E8EE",
  fontFamily: "'Segoe UI', system-ui, sans-serif",
};

const hero = {
  maxWidth: 880,
  textAlign: "center",
};

const eyebrow = {
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#9AA4B2",
  fontSize: "0.9rem",
  marginBottom: "0.5rem",
};

const h1 = {
  fontSize: "clamp(2rem, 4vw, 3rem)",
  lineHeight: 1.1,
  margin: "0.2rem 0 0.8rem",
};

const accentTxt = {
  color: "#F25F8B",
  textShadow: "0 0 18px rgba(242,95,139,0.35)",
};

const sub = {
  fontSize: "1.125rem",
  color: "#C9D1D9",
  margin: "0 auto 1.25rem",
  maxWidth: 760,
};

const ctaWrap = {
  display: "flex",
  gap: "0.75rem",
  justifyContent: "center",
  flexWrap: "wrap",
  marginTop: "0.5rem",
};

const btnPrimary = {
  backgroundColor: "#F25F8B",
  color: "#0f1115",
  padding: "0.8rem 1.2rem",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 700,
  border: "none",
  outline: "2px solid transparent",
};

const btnGhost = {
  backgroundColor: "transparent",
  color: "#E6E8EE",
  padding: "0.8rem 1.1rem",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 600,
  border: "1px solid #2A2F3A",
};

const bullets = {
  listStyle: "none",
  padding: 0,
  marginTop: "1.2rem",
  color: "#A8B3C2",
  display: "grid",
  gap: "0.25rem",
  fontSize: "0.98rem",
};


