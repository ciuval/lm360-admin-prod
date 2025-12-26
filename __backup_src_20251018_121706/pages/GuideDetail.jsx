import React from "react";
import { useParams, Link } from "react-router-dom";

export default function GuideDetail() {
  const { slug } = useParams();
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "1rem", color: "#fff" }}>
      <h2 style={{ color: "#f08fc0" }}>Guida: {slug}</h2>
      <p style={{ opacity: .8 }}>Contenuto in arrivo. Qui potrai inserire testo, immagini, step e materiali scaricabili.</p>
      <Link to="/guide" style={{ color: "#9ecbff" }}>← Torna alle guide</Link>
    </div>
  );
}
