// src/components/HeaderBar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function HeaderBar({
  unread = 0,
  matches = 0,
  visite = 0,
}) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const path = (hash?.replace("#", "") || pathname) || "/";

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => {
        setUser(s?.user ?? null);
      });
      unsub = listener?.subscription?.unsubscribe ?? (() => {});
    })();
    return () => unsub();
  }, []);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
    } finally {
      navigate("/");
    }
  }

  return (
    <>
      <a href="#main" style={skipLink}>Salta al contenuto</a>
      <header style={wrap} role="banner" aria-label="Barra di navigazione">
        <div style={inner}>
          <Link to="/" style={brand} aria-label="LoveMatch360 home">
            <span style={heart} aria-hidden>💗</span> LoveMatch360
          </Link>

          <nav aria-label="Navigazione principale">
            <ul style={navList}>
              <NavItem to="/guide" current={path.startsWith("/guide")}>Guide</NavItem>


              {/* Rotte esistenti: NON rimuovere */}
              <NavItem to="/profili-pubblici" current={path.startsWith("/profili")}>Profili</NavItem>

              <NavItem to="/match" current={path.startsWith("/match")}>
                Match {badge(matches, "match trovati")}
              </NavItem>

              <NavItem to="/chat" current={path.startsWith("/chat")}>
                Chat {badge(unread, "messaggi non letti")}
              </NavItem>

              <NavItem to="/visitatori" current={path.startsWith("/visitatori")}>
                Visite {badge(visite, "visite recenti")}
              </NavItem>

              <NavItem to="/premium" current={path.startsWith("/premium")}>Premium</NavItem>
            </ul>
          </nav>

          <div style={rhs}>
            {!user ? (
              <div style={ctaWrap}>
                <Link to="/registrati" style={btnPrimary} aria-label="Prova gratis">
                  Prova gratis
                </Link>
                <Link to="/login" style={btnGhost} aria-label="Accedi">
                  Accedi
                </Link>
              </div>
            ) : (
              <div style={userWrap}>
                <Link to="/profilo" style={linkGhost} aria-label="Vai al tuo profilo">
                  Profilo
                </Link>
                <button onClick={handleLogout} style={btnGhost} aria-label="Esci">
                  Esci
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

/* ---------- Componenti UI ---------- */

function NavItem({ to, current, children }) {
  return (
    <li>
      <Link
        to={to}
        style={{
          ...navLink,
          ...(current ? navLinkActive : null),
        }}
        aria-current={current ? "page" : undefined}
      >
        {children}
      </Link>
    </li>
  );
}

function badge(n, label) {
  if (!n) return null;
  const txt = String(n > 99 ? "99+" : n);
  return (
    <span
      style={pill}
      aria-label={`${txt} ${label}`}
      title={`${txt} ${label}`}
    >
      {txt}
    </span>
  );
}

/* ---------- STILI ---------- */

const wrap = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  background: "#0c0f13cc",
  backdropFilter: "saturate(140%) blur(8px)",
  borderBottom: "1px solid #1e2430",
  color: "#E6E8EE",
};

const inner = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "0.75rem 1rem",
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  justifyContent: "space-between",
  flexWrap: "wrap",
};

const brand = {
  color: "#E6E8EE",
  textDecoration: "none",
  fontWeight: 800,
  letterSpacing: "0.2px",
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
};

const heart = { filter: "drop-shadow(0 0 8px rgba(242,95,139,0.45))" };

const navList = {
  listStyle: "none",
  display: "flex",
  gap: "0.8rem",
  padding: 0,
  margin: 0,
  alignItems: "center",
  flexWrap: "wrap",
};

const navLink = {
  color: "#B7C0CE",
  textDecoration: "none",
  padding: "0.45rem 0.65rem",
  borderRadius: 8,
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  outline: "2px solid transparent",
};

const navLinkActive = {
  color: "#0f1115",
  background: "#F25F8B",
  fontWeight: 700,
};

const pill = {
  background: "#ff3b6b",
  color: "#fff",
  borderRadius: 999,
  padding: "0 0.45rem",
  fontSize: "0.75rem",
  marginLeft: "0.25rem",
  lineHeight: "1.25rem",
  minWidth: "1.25rem",
  textAlign: "center",
};

const rhs = { display: "flex", alignItems: "center", gap: "0.6rem" };

const userWrap = { display: "flex", alignItems: "center", gap: "0.5rem" };

const ctaWrap = { display: "flex", gap: "0.5rem", alignItems: "center" };

const btnPrimary = {
  background: "#F25F8B",
  color: "#0f1115",
  border: "none",
  padding: "0.55rem 0.9rem",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 800,
};

const btnGhost = {
  background: "transparent",
  color: "#E6E8EE",
  border: "1px solid #2A2F3A",
  padding: "0.5rem 0.85rem",
  borderRadius: 10,
  cursor: "pointer",
  textDecoration: "none",
  fontWeight: 600,
};

const linkGhost = {
  ...btnGhost,
  border: "1px dashed #2A2F3A",
};

const skipLink = {
  position: "absolute",
  left: "-9999px",
  top: "-9999px",
  background: "#F25F8B",
  color: "#0f1115",
  padding: "0.5rem 0.75rem",
  borderRadius: 8,
};

