import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ padding: "18px", borderTop: "1px solid rgba(255,255,255,0.08)", opacity: 0.9 }}>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Link to="/privacy">Privacy</Link>
        <Link to="/cookie">Cookie</Link>
        <Link to="/termini">Termini</Link>
        <Link to="/rimborsi">Rimborsi</Link>
      </div>
      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
        © {new Date().getFullYear()} LoveMatch360
      </div>
    </footer>
  );
}