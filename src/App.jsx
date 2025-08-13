// src/App.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import CmpBanner from "./components/CmpBanner";
import { Toaster, toast } from "react-hot-toast";
import { supabase } from "./lib/supabaseClient";

// Pagine
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ChatBox from "./pages/ChatBox";
import MatchDashboard from "./pages/MatchDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DebugPage from "./pages/DebugPage";
import LogViewerAdmin from "./pages/LogViewerAdmin";
import LogStatsDashboard from "./pages/LogStatsDashboard";
import NewsletterPage from "./pages/NewsletterPage";
import TestSupabase from "./pages/TestSupabase";
import PublicProfilesPage from "./pages/PublicProfilesPage";
import VisitatoriPage from "./pages/VisitatoriPage";
import SetupMFA from "./pages/SetupMFA";
import FunzioniStato from "./pages/FunzioniStato";
import ProfilePublicCard from "./pages/ProfilePublicCard";
import Paywall from "./pages/Paywall";
import AttivaPremium from "./pages/AttivaPremium";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutStripe from "./pages/CheckoutStripe";
import TesterPage from "./pages/TesterPage";
import AdminAbbonamentiDashboard from "./pages/AdminAbbonamentiDashboard";
import PrezziStripeDettagliati from "./pages/PrezziStripeDettagliati";
import PrezziStripeEditor from "./pages/PrezziStripeEditor";
import UpgradePrompt from "./pages/UpgradePrompt";
import LoginWithMFA from "./pages/LoginWithMFA";
import FacebookLike from "./pages/FacebookLike";
import VideoPage from "./pages/VideoPage";

// Componenti
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfLoggedIn from "./components/RedirectIfLoggedIn";
import PremiumOnly from "./components/PremiumOnly";

/* ------------------ STILI ------------------ */
const linkBase = {
  color: "#fff",
  textDecoration: "none",
  padding: "0.5rem 0.8rem",
  borderRadius: "10px",
  transition: "transform .12s ease, box-shadow .15s ease, background .15s ease",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
};
const linkActive = {
  background: "#f08fc0",
  color: "#121212",
  boxShadow: "0 0 10px #f08fc0",
};
const badge = (bg) => ({
  background: bg,
  color: "#fff",
  borderRadius: 999,
  padding: "0 8px",
  marginLeft: 2,
  fontSize: 12,
  lineHeight: "18px",
});

/* animazione “press” senza CSS esterno */
const pressHandlers = {
  onMouseDown: (e) => (e.currentTarget.style.transform = "scale(.96)"),
  onMouseUp:   (e) => (e.currentTarget.style.transform = "scale(1)"),
  onMouseLeave:(e) => (e.currentTarget.style.transform = "scale(1)"),
};

export default function App() {
  const location = useLocation();

  // --- Sessione reale + eventuale fake user da .env ---
  const [sessionUserId, setSessionUserId] = useState(null);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.id) setSessionUserId(data.session.user.id);
      else setSessionUserId(null);
    })();
  }, []);

  const USE_FAKE = String(import.meta.env.VITE_USE_FAKE_USER || "").toLowerCase() === "true";
  const FAKE_ID = import.meta.env.VITE_FAKE_USER_ID || "";
  const effectiveUserId = useMemo(
    () => (USE_FAKE && FAKE_ID ? FAKE_ID : sessionUserId),
    [USE_FAKE, FAKE_ID, sessionUserId]
  );

  // --- Badge & contatori ---
  const [messaggiNonLetti, setMessaggiNonLetti] = useState(0);
  const [matchTrovati, setMatchTrovati] = useState(0);
  const [visiteRecenti, setVisiteRecenti] = useState(0);

  // Caricamento iniziale (best‑effort, compatibile con match_scores_flat oppure match_scores)
  useEffect(() => {
    if (!effectiveUserId) {
      setMessaggiNonLetti(0);
      setMatchTrovati(0);
      setVisiteRecenti(0);
      return;
    }
    (async () => {
      // Visite ultime 24h
      try {
        const { data: visite } = await supabase
          .from("visite")
          .select("id")
          .eq("profilo_visitato", effectiveUserId)
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        setVisiteRecenti(visite?.length || 0);
      } catch {}

      // Messaggi non letti
      try {
        const { data: msgs } = await supabase
          .from("messaggi")
          .select("id")
          .eq("destinatario_id", effectiveUserId)
          .eq("letto", false);
        setMessaggiNonLetti(msgs?.length || 0);
      } catch {}

      // Match: prova 1) vista flat 'match_scores_flat(user_id)'
      try {
        const { count, error } = await supabase
          .from("match_scores_flat")
          .select("id", { count: "exact", head: true })
          .eq("user_id", effectiveUserId);
        if (!error) {
          setMatchTrovati(typeof count === "number" ? count : 0);
          return;
        }
      } catch {}

      // Match: prova 2) tabella 'match_scores' con colonne user_id_1/user_id_2
      try {
        const or = `user_id_1.eq.${effectiveUserId},user_id_2.eq.${effectiveUserId}`;
        const { count, error } = await supabase
          .from("match_scores")
          .select("id", { count: "exact", head: true })
          .or(or);
        if (!error) {
          setMatchTrovati(typeof count === "number" ? count : 0);
          return;
        }
      } catch {}

      // Match: prova 3) tabella 'match_scores' con colonna 'user_id'
      try {
        const { count, error } = await supabase
          .from("match_scores")
          .select("id", { count: "exact", head: true })
          .eq("user_id", effectiveUserId);
        if (!error) setMatchTrovati(typeof count === "number" ? count : 0);
      } catch {}
    })();
  }, [effectiveUserId]);

  // Realtime: Messaggi → badge chat
  useEffect(() => {
    if (!effectiveUserId) return;
    const ch = supabase
      .channel("messaggi-notifiche")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messaggi" },
        (payload) => {
          const m = payload?.new;
          const inChat = location.pathname.startsWith("/chat/");
          if (m?.destinatario_id === effectiveUserId && !inChat) {
            playDing();
            toast.success("💬 Nuovo messaggio ricevuto!");
            setMessaggiNonLetti((v) => v + 1);
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [effectiveUserId, location.pathname]);

  // Realtime: Visite
  useEffect(() => {
    if (!effectiveUserId) return;
    const ch = supabase
      .channel("visite-notifiche")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visite" },
        (payload) => {
          const row = payload?.new;
          const onVisitatori = location.pathname.startsWith("/visitatori");
          if (row?.profilo_visitato === effectiveUserId && !onVisitatori) {
            setVisiteRecenti((n) => n + 1);
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [effectiveUserId, location.pathname]);

  // Realtime: Match (su tabella fisica; con vista non è possibile)
  useEffect(() => {
    if (!effectiveUserId) return;
    const hasUser = (r) => {
      const keys = ["user_a_id", "user_b_id", "utente1", "utente2", "user1_id", "user2_id", "user_id"];
      return keys.some((k) => r?.[k] === effectiveUserId);
    };
    const ch = supabase
      .channel("match-notifiche")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "match_scores" },
        (payload) => {
          if (hasUser(payload?.new)) setMatchTrovati((m) => m + 1);
        }
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [effectiveUserId]);

  // Listener globale per decremento badge quando la chat marca 'letti'
  useEffect(() => {
    function onDec(e) {
      const n = Number(e.detail || 0);
      if (n > 0) setMessaggiNonLetti((prev) => Math.max(0, prev - n));
    }
    window.addEventListener("unread-decrement", onDec);
    return () => window.removeEventListener("unread-decrement", onDec);
  }, []);

  // Reset badge quando entro nelle pagine
  useEffect(() => {
    if (location.pathname.startsWith("/chat/")) setMessaggiNonLetti(0);
    if (location.pathname.startsWith("/visitatori")) setVisiteRecenti(0);
  }, [location.pathname]);

  const handleClickChat = () => setMessaggiNonLetti(0);
  const handleClickVisitatori = () => setVisiteRecenti(0);

  const makeStyle = (isActive, extraActive = false) =>
    isActive || extraActive ? { ...linkBase, ...linkActive } : linkBase;

  const NavItem = ({ to, children, badgeValue = 0, badgeColor, activeWhen, onClick }) => {
    const extraActive = typeof activeWhen === "function" ? activeWhen(location.pathname) : false;
    return (
      <NavLink
        to={to}
        onClick={onClick}
        style={({ isActive }) => makeStyle(isActive, extraActive)}
        {...pressHandlers}
      >
        <span>{children}</span>
        {badgeValue > 0 && <span style={badge(badgeColor)}>{badgeValue}</span>}
      </NavLink>
    );
  };

  return (
    <div style={{ backgroundColor: "#121212", color: "#fff", minHeight: "100vh", fontFamily: "Segoe UI, sans-serif" }}>
      <Toaster position="top-right" />
      <CmpBanner />

      <nav
        role="navigation"
        aria-label="Principale"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.6rem",
          padding: "0.8rem 1rem",
          backgroundColor: "#1e1e1e",
          boxShadow: "0 0 10px #f08fc0",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <NavItem to="/">🏠 Home</NavItem>
        <NavItem to="/profilo">👤 Profilo</NavItem>
        <NavItem to="/match" badgeValue={matchTrovati} badgeColor="deeppink">💘 Match</NavItem>
        <NavItem to="/profili-pubblici">🌐 Profili Pubblici</NavItem>
        <NavItem to="/visitatori" badgeValue={visiteRecenti} badgeColor="orange" onClick={handleClickVisitatori}>👀 Visitatori</NavItem>
        <NavItem
          to="/chat/placeholder"
          badgeValue={!location.pathname.startsWith("/chat/") ? messaggiNonLetti : 0}
          badgeColor="red"
          onClick={handleClickChat}
          activeWhen={(p) => p.startsWith("/chat/")}
        >
          💬 Chat
        </NavItem>
        <NavItem to="/premium">💎 Premium</NavItem>
        <NavItem to="/attiva-premium">💎 Attiva Premium</NavItem>
        <NavItem to="/funzioni">📊 Funzioni</NavItem>
        <NavItem to="/log-stats">📈 Statistiche</NavItem>
        <NavItem to="/admin" activeWhen={(p) => p === "/admin" || p.startsWith("/admin/")}>🛠️ Admin</NavItem>
        <NavItem to="/log-admin">📜 Log</NavItem>
        <NavItem to="/debug">🧪 Debug</NavItem>
        <NavItem to="/social">📘 Social</NavItem>
        <NavItem to="/video">▶️ Video</NavItem>
        <NavItem to="/tester">🧬 Tester</NavItem>
      </nav>

      <Routes>
        <Route path="/" element={<Home sessionUserId={effectiveUserId} />} />
        <Route path="/login" element={<RedirectIfLoggedIn userId={effectiveUserId}><LoginPage /></RedirectIfLoggedIn>} />
        <Route path="/registrati" element={<RedirectIfLoggedIn userId={effectiveUserId}><RegisterPage /></RedirectIfLoggedIn>} />
        <Route path="/login-mfa" element={<RedirectIfLoggedIn userId={effectiveUserId}><LoginWithMFA /></RedirectIfLoggedIn>} />
        <Route path="/social" element={<FacebookLike userId={effectiveUserId} />} />
        <Route path="/video"  element={<VideoPage   userId={effectiveUserId} />} />

        <Route path="/profilo" element={<ProtectedRoute userId={effectiveUserId}><ProfilePage /></ProtectedRoute>} />
        <Route path="/profilo/:id" element={<ProfilePublicCard />} />

        <Route path="/chat/:id" element={<ProtectedRoute userId={effectiveUserId}><PremiumOnly><ChatBox /></PremiumOnly></ProtectedRoute>} />

        <Route path="/match" element={<MatchDashboard />} />
        <Route path="/profili-pubblici" element={<PublicProfilesPage />} />
        <Route path="/visitatori" element={<VisitatoriPage />} />

        <Route path="/premium" element={<Paywall />} />
        <Route path="/attiva-premium" element={<ProtectedRoute userId={effectiveUserId}><AttivaPremium /></ProtectedRoute>} />
        <Route path="/checkout-success" element={<CheckoutSuccess />} />
        <Route path="/checkout" element={<ProtectedRoute userId={effectiveUserId}><CheckoutStripe /></ProtectedRoute>} />

        <Route path="/funzioni" element={<FunzioniStato />} />
        <Route path="/newsletter" element={<NewsletterPage />} />
        <Route path="/testsupabase" element={<TestSupabase />} />
        <Route path="/tester" element={<TesterPage />} />
        <Route path="/setup-mfa" element={<SetupMFA />} />
        <Route path="/upgrade" element={<UpgradePrompt />} />

        <Route path="/admin" element={<ProtectedRoute userId={effectiveUserId}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/log" element={<ProtectedRoute userId={effectiveUserId}><LogViewerAdmin /></ProtectedRoute>} />
        <Route path="/log-admin" element={<ProtectedRoute userId={effectiveUserId}><LogViewerAdmin /></ProtectedRoute>} />
        <Route path="/log-stats" element={<ProtectedRoute userId={effectiveUserId}><LogStatsDashboard /></ProtectedRoute>} />
        <Route path="/admin/abbonamenti" element={<ProtectedRoute userId={effectiveUserId}><AdminAbbonamentiDashboard /></ProtectedRoute>} />
        <Route path="/admin/prezzi-stripe" element={<ProtectedRoute userId={effectiveUserId}><PrezziStripeDettagliati /></ProtectedRoute>} />
        <Route path="/admin/prezzi-stripe/editor" element={<ProtectedRoute userId={effectiveUserId}><PrezziStripeEditor /></ProtectedRoute>} />

        <Route path="/debug" element={<ProtectedRoute userId={effectiveUserId}><DebugPage /></ProtectedRoute>} />
        <Route path="*" element={<div style={{ padding: "2rem" }}>404 - Pagina non trovata</div>} />
      </Routes>
    </div>
  );
}

/* ---- audio notifica: prova WAV (confermato), poi MP3, poi assets ---- */
function playDing() {
  const tryPlay = (src) => {
    try {
      const a = new Audio(src);
      return a.play();
    } catch {
      return Promise.reject();
    }
  };
  tryPlay("/notify.wav")
    .catch(() => tryPlay("/notify.mp3"))
    .catch(() => tryPlay("/assets/notify.wav"))
    .catch(() => {});
}

