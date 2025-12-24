import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const linkStyle = ({ isActive }) => ({
    opacity: isActive ? 1 : 0.85,
    textDecoration: "none",
    marginLeft: 14
  });

  return (
    <header style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <Link to="/" style={{ textDecoration: "none", fontWeight: 800 }}>LoveMatch360</Link>
        <nav aria-label="Navigazione">
          <NavLink to="/" style={linkStyle}>Home</NavLink>
          <NavLink to="/premium" style={linkStyle}>Premium</NavLink>
          <NavLink to="/scopri" style={linkStyle}>Scopri</NavLink>
          <NavLink to="/profilo" style={linkStyle}>Profilo</NavLink>
        </nav>
      </div>
    </header>
  );
}