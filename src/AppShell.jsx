import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { loadCurrentAccountTier } from "./lib/accountTier";
import { supabase } from "./lib/supabaseClient";
import SiteFooter from "./components/SiteFooter.jsx";

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase();
}

function getDisplayName(profile, user) {
  if (profile?.nome && String(profile.nome).trim()) return String(profile.nome).trim();
  if (user?.email) return user.email.split("@")[0];
  return "Profilo";
}

function getVisibleEmail(profile, user) {
  return profile?.email || user?.email || "Email non disponibile";
}

function getAccountState(profile) {
  const status = normalizeStatus(profile?.status_account);

  if (status === "sospeso") {
    return {
      label: "Account sospeso",
      tone: "warning",
    };
  }

  return {
    label: "Account attivo",
    tone: "ok",
  };
}

function getTierMeta(tier) {
  if (tier === "admin") {
    return {
      label: "ADMIN",
      tone: "admin",
      accessLabel: "Controllo admin attivo",
    };
  }

  if (tier === "super") {
    return {
      label: "SUPER",
      tone: "super",
      accessLabel: "Accesso completo attivo",
    };
  }

  if (tier === "premium") {
    return {
      label: "PREMIUM",
      tone: "premium",
      accessLabel: "Accesso premium attivo",
    };
  }

  return {
    label: "FREE",
    tone: "free",
    accessLabel: "Accesso base attivo",
  };
}

function getCurrentSection(pathname, isAuthed, tier) {
  if (pathname === "/") {
    return {
      label: "Home",
      helper: isAuthed
        ? "Questa è la tua base: da qui puoi orientarti e ripartire pulito."
        : "Questa è la vetrina iniziale del prodotto.",
    };
  }

  if (pathname.startsWith("/login")) {
    return {
      label: "Accesso",
      helper: "Qui entri nel flusso del tuo account.",
    };
  }

  if (pathname.startsWith("/profilo")) {
    return {
      label: "Profilo",
      helper: "Qui gestisci presenza, dati e stato del tuo account.",
    };
  }

  if (pathname.startsWith("/scopri")) {
    return {
      label: "Scopri",
      helper: "Qui esplori i profili disponibili nel flusso reale di discovery.",
    };
  }

  if (pathname.startsWith("/premium")) {
    return {
      label: "Premium",
      helper:
        tier === "premium" || tier === "super" || tier === "admin"
          ? "Qui verifichi il valore del tuo livello attuale, senza attivazioni inutili."
          : "Qui capisci se e quando ha senso sbloccare il livello premium.",
    };
  }

  if (pathname.startsWith("/billing")) {
    return {
      label: "Billing",
      helper: "Qui verifichi lo stato del piano e il percorso corretto per il tuo account.",
    };
  }

  if (pathname.startsWith("/quantum")) {
    return {
      label: "Quantum",
      helper: "Qui vivi l’area avanzata disponibile solo per i livelli abilitati.",
    };
  }

  if (pathname.startsWith("/admin")) {
    return {
      label: "Admin",
      helper: "Qui sono disponibili i controlli di gestione riservati agli account autorizzati.",
    };
  }

  if (pathname.startsWith("/attiva-premium")) {
    return {
      label: "Attivazione Premium",
      helper: "Qui entri nel flusso manuale di attivazione, se il tuo account ne ha davvero bisogno.",
    };
  }

  if (pathname.startsWith("/checkout")) {
    return {
      label: "Checkout",
      helper: "Qui si apre il passaggio tecnico di pagamento, solo se il flusso commerciale è attivo.",
    };
  }

  if (
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/cookie") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/refunds")
  ) {
    return {
      label: "Area legale",
      helper: "Qui trovi le informazioni legali e i contatti pubblici del servizio.",
    };
  }

  return {
    label: "Sezione",
    helper: "Sei in un punto del sito attivo, ma fuori dai percorsi principali.",
  };
}

function ShellLink({ to, children }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...navLinkStyle,
        ...(isActive ? navLinkActiveStyle : null),
      })}
    >
      {children}
    </NavLink>
  );
}

function Badge({ children, tone = "neutral" }) {
  return <span style={badgeStyle(tone)}>{children}</span>;
}

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState("free");
  const [isAuthed, setIsAuthed] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        setLoading(true);

        const result = await loadCurrentAccountTier();

        if (!alive) return;

        setTier(result?.tier || "free");
        setIsAuthed(Boolean(result?.isAuthed));
        setUser(result?.user || null);
        setProfile(result?.profile || null);
      } catch {
        if (!alive) return;

        setTier("free");
        setIsAuthed(false);
        setUser(null);
        setProfile(null);
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [location.pathname]);

  const displayName = useMemo(() => getDisplayName(profile, user), [profile, user]);
  const visibleEmail = useMemo(() => getVisibleEmail(profile, user), [profile, user]);
  const accountState = useMemo(() => getAccountState(profile), [profile]);
  const tierMeta = useMemo(() => getTierMeta(tier), [tier]);
  const currentSection = useMemo(
    () => getCurrentSection(location.pathname, isAuthed, tier),
    [location.pathname, isAuthed, tier]
  );

  const showAdminLink = tier === "admin";
  const content = children ?? <Outlet />;

  async function handleLogout() {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("AppShell logout error:", error);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div style={shellStyle}>
      <header style={headerStyle}>
        <div style={headerInnerStyle}>
          <div style={topRowStyle}>
            <div style={brandColStyle}>
              <div style={brandTitleStyle}>LoveMatch360</div>

              {!loading && (
                <div style={badgeRowStyle}>
                  <Badge tone={tierMeta.tone}>{tierMeta.label}</Badge>
                  {isAuthed ? (
                    <>
                      <Badge tone={accountState.tone}>{accountState.label}</Badge>
                      <Badge tone="neutral">{tierMeta.accessLabel}</Badge>
                    </>
                  ) : (
                    <Badge tone="neutral">Accesso ospite</Badge>
                  )}
                </div>
              )}
            </div>

            <div style={identityCardStyle}>
              <div style={identityCardLabelStyle}>Dove sei</div>
              <div style={identityNameStyle}>{currentSection.label}</div>
              <div style={identityEmailStyle}>{currentSection.helper}</div>
            </div>

            {!loading && isAuthed ? (
              <div style={identityCardStyle}>
                <div style={identityCardLabelStyle}>Account attuale</div>
                <div style={identityNameStyle}>{displayName}</div>
                <div style={identityEmailStyle}>{visibleEmail}</div>
              </div>
            ) : null}
          </div>

          <div style={bottomRowStyle}>
            <nav aria-label="Navigazione principale" style={navStyle}>
              <ShellLink to="/">Home</ShellLink>
              <ShellLink to="/premium">Premium</ShellLink>

              {isAuthed ? (
                <>
                  <ShellLink to="/billing">Billing</ShellLink>
                  <ShellLink to="/quantum">Quantum</ShellLink>
                  <ShellLink to="/scopri">Scopri</ShellLink>
                  <ShellLink to="/profilo">Profilo</ShellLink>
                  {showAdminLink ? <ShellLink to="/admin">Admin</ShellLink> : null}
                </>
              ) : (
                <ShellLink to="/login">Accedi</ShellLink>
              )}
            </nav>

            <div style={actionsStyle}>
              {isAuthed ? (
                <button
                  type="button"
                  style={logoutButtonStyle}
                  onClick={handleLogout}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Uscita..." : "Esci"}
                </button>
              ) : (
                <button
                  type="button"
                  style={logoutButtonStyle}
                  onClick={() => navigate("/login")}
                >
                  Accedi
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <>
      <main style={mainStyle}>{content}</main>
      <SiteFooter />

      </>
    </div>
  );
}

const shellStyle = {
  minHeight: "100vh",
  background:
    "radial-gradient(1200px 600px at 0% 0%, rgba(240,143,192,0.08), transparent 40%), radial-gradient(900px 500px at 100% 0%, rgba(125,211,252,0.08), transparent 42%), #05070b",
  color: "#f8fafc",
};

const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 40,
  backdropFilter: "blur(14px)",
  background: "rgba(5,7,11,0.92)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 18px 40px rgba(0,0,0,0.24)",
};

const headerInnerStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "14px 16px 12px",
};

const topRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const brandColStyle = {
  display: "grid",
  gap: 10,
};

const brandTitleStyle = {
  fontSize: 34,
  lineHeight: 1,
  fontWeight: 900,
  letterSpacing: "-0.04em",
  color: "#ffffff",
};

const badgeRowStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const identityCardStyle = {
  minWidth: 280,
  maxWidth: 420,
  borderRadius: 18,
  padding: "12px 14px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
};

const identityCardLabelStyle = {
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  opacity: 0.68,
};

const identityNameStyle = {
  marginTop: 6,
  fontSize: 22,
  fontWeight: 800,
  lineHeight: 1.1,
  color: "#ffffff",
  wordBreak: "break-word",
};

const identityEmailStyle = {
  marginTop: 6,
  fontSize: 14,
  opacity: 0.86,
  color: "#dbeafe",
  wordBreak: "break-word",
};

const bottomRowStyle = {
  marginTop: 14,
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "center",
  flexWrap: "wrap",
};

const navStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const navLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 16px",
  borderRadius: 999,
  textDecoration: "none",
  color: "#e5e7eb",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.10)",
  fontWeight: 700,
  transition: "all 160ms ease",
};

const navLinkActiveStyle = {
  color: "#ffffff",
  background:
    "linear-gradient(135deg, rgba(240,143,192,0.22), rgba(125,211,252,0.18))",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.20)",
};

const actionsStyle = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  alignItems: "center",
};

const logoutButtonStyle = {
  minHeight: 42,
  padding: "0 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
};

const mainStyle = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "20px 16px 32px",
};

const badgeStyle = (tone) => {
  const tones = {
    premium: {
      background: "rgba(240,143,192,0.16)",
      border: "1px solid rgba(240,143,192,0.26)",
      color: "#ffd9e8",
    },
    super: {
      background: "rgba(125,211,252,0.16)",
      border: "1px solid rgba(125,211,252,0.28)",
      color: "#d8f1ff",
    },
    admin: {
      background: "rgba(250,204,21,0.16)",
      border: "1px solid rgba(250,204,21,0.28)",
      color: "#ffe79a",
    },
    ok: {
      background: "rgba(34,197,94,0.16)",
      border: "1px solid rgba(34,197,94,0.28)",
      color: "#c9ffd8",
    },
    warning: {
      background: "rgba(245,158,11,0.16)",
      border: "1px solid rgba(245,158,11,0.28)",
      color: "#ffe4ae",
    },
    free: {
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#e5e7eb",
    },
    neutral: {
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.10)",
      color: "#f3f4f6",
    },
  };

  const selected = tones[tone] || tones.neutral;

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minHeight: 34,
    padding: "0 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    ...selected,
  };
};