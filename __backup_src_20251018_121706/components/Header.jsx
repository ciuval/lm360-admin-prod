import React from "react";
import BadgePremium from "./BadgePremium.jsx";
import { usePremium } from "../context/PremiumContext.jsx";

export default function Header() {
  const { loading, scadenza } = usePremium();

  const wrap = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "12px 16px",
    borderBottom: "1px solid #222",
    background: "#0b0b0b",
    color: "#e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 40
  };

  const brand = { color: "#fff", textDecoration: "none", fontWeight: 700, letterSpacing: .3, fontSize: 18 };
  const nav = { display: "flex", gap: 16, alignItems: "center" };
  const link = { color: "#9cc3ff", textDecoration: "none" };

  return (
    <header style={wrap}>
      <div style={nav}>
        <a href="#/" style={brand}>LoveMatch360</a>
        <a href="#/premium" style={link}>Premium</a>
        <a href="#/guide" style={link}>Guide</a>
      </div>

      <div style={nav} aria-label="Stato abbonamento e azioni account">
        {!loading && <BadgePremium scadenza={scadenza} small />}
        <a href="#/profilo" style={link}>Profilo</a>
        <a href="#/logout" style={link}>Esci</a>
      </div>
    </header>
  );
}
