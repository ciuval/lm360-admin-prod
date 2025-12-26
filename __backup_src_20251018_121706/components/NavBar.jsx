// src/components/NavBar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../styles/nav.css";
import PremiumBadge from "./PremiumBadge";

function Item({ to, children, badgeCount = 0, badgeColor, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
    >
      {children}
      {badgeCount > 0 && (
        <span className={`badge ${badgeColor || ""}`}>{badgeCount}</span>
      )}
      <span className="glow-underline" />
    </NavLink>
  );
}

export default function NavBar({
  matchTrovati,
  visiteRecenti,
  messaggiNonLetti,
  onClickChat,
  onClickVisitatori,
}) {
  const location = useLocation();
  const inChat = location.pathname.startsWith("/chat/");
  return (
    <nav className="nav">
      <Item to="/">🏠 Home</Item>
      <Item to="/profilo">👤 Profilo</Item>
      <Item to="/match" badgeCount={matchTrovati} badgeColor="pink">💘 Match</Item>
      <Item to="/profili-pubblici">🌐 Profili Pubblici</Item>
      <Item
        to="/visitatori"
        badgeCount={visiteRecenti}
        badgeColor="orange"
        onClick={onClickVisitatori}
      >
        👀 Visitatori
      </Item>
      <Item
        to="/chat/placeholder"
        badgeCount={!inChat ? messaggiNonLetti : 0}
        badgeColor=""
        onClick={onClickChat}
      >
      <PremiumBadge />
        💬 Chat
      </Item>
      <Item to="/premium">💎 Premium</Item>
      <Item to="/attiva-premium">💎 Attiva Premium</Item>
      <Item to="/funzioni">📊 Funzioni</Item>
      <Item to="/log-stats">📈 Statistiche</Item>
      <Item to="/admin">🛠️ Admin</Item>
      <Item to="/log-admin">📜 Log</Item>
      <Item to="/debug">🧪 Debug</Item>
      <Item to="/tester">🧬 Tester</Item>
    </nav>
  );
}
