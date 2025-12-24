import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function AppShell({ children }) {
  const navStyle = ({ isActive }) => ({
    opacity: isActive ? 1 : 0.85,
    textDecoration: "none",
    marginLeft: 12,
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <Link to="/" style={{ textDecoration: "none", fontWeight: 800 }}>LoveMatch360</Link>
          <nav aria-label="Navigazione">
            <NavLink to="/" style={navStyle}>Home</NavLink>
            <NavLink to="/premium" style={navStyle}>Premium</NavLink>
            <NavLink to="/scopri" style={navStyle}>Scopri</NavLink>
            <NavLink to="/profilo" style={navStyle}>Profilo</NavLink>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

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
    </div>
  );
}