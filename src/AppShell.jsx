import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import useAccountTier from "./hooks/useAccountTier";
import { supabase } from "./lib/supabaseClient";

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
  const { tier, loading, isAuthed, user, profile } = useAccountTier("shell");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = useMemo(() => getDisplayName(profile, user), [profile, user]);
  const visibleEmail = useMemo(() => getVisibleEmail(profile, user), [profile, user]);
  const accountState = useMemo(() => getAccountState(profile), [profile]);
  const tierMeta = useMemo(() => getTierMeta(tier), [tier]);

  const showAdminLink = tier === "admin";
  const content = children ?? <Outlet />;

  async function handleLogout() {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      navigate("/welcome", { replace: true });
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

              {!loading && isAuthed ? (
                <div style={badgeRowStyle}>
                  <Badge tone={tierMeta.tone}>{tierMeta.label}</Badge>
                  <Badge tone={accountState.tone}>{accountState.label}</Badge>
                  <Badge tone="neutral">{tierMeta.accessLabel}</Badge>
                </div>
              ) : null}
            </div>

            {!loading && isAuthed ? (
              <div style={identityCardStyle}>
                <div style={identityCardLabelStyle}>Account attuale</div>
                <div style={identityNameStyle}>{displayName}</div>
                <div style={identityEmailStyle}>{visibleEmail}</div>
              </div>
            ) : null}
          </div>

          {!loading && isAuthed ? (
            <div style={bottomRowStyle}>
              <nav aria-label="Navigazione principale" style={navStyle}>
                <ShellLink to="/">Home</ShellLink>
                <ShellLink to="/premium">Premium</ShellLink>
                <ShellLink to="/billing">Billing</ShellLink>
                <ShellLink to="/quantum">Quantum</ShellLink>
                <ShellLink to="/scopri">Scopri</ShellLink>
                <ShellLink to="/profilo">Profilo</ShellLink>
                {showAdminLink ? <ShellLink to="/admin">Admin</ShellLink> : null}
              </nav>

              <div style={actionsStyle}>
                <button
                  type="button"
                  style={logoutButtonStyle}
                  onClick={handleLogout}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? "Uscita..." : "Esci"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <main style={mainStyle}>{content}</main>
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