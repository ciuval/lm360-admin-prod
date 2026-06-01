import React from "react";
import { Routes, Route } from "react-router-dom";

/* ======================================================
   SHELL & GUARDS
====================================================== */
import AppShell from "./AppShell.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import RequirePremium from "./components/RequirePremium.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";

/* ======================================================
   CORE PAGES
====================================================== */
import Home from "./pages/Home.jsx";
import WelcomePage from "./pages/WelcomePage.jsx";
import Premium from "./pages/Premium.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProfilePublicCard from "./pages/ProfilePublicCard.jsx";
import NotFound from "./pages/NotFound.jsx";

/* ======================================================
   DISCOVERY / APP
====================================================== */
import PublicProfilesPage from "./pages/PublicProfilesPage.jsx";
import MatchDashboard from "./pages/MatchDashboard.jsx";
import Admin from "./pages/Admin.jsx";
import Billing from "./pages/Billing.jsx";

/* ======================================================
   AUTH
====================================================== */
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginWithMFA from "./pages/LoginWithMFA.jsx";

/* ======================================================
   STRIPE / BILLING FLOW
====================================================== */
import AttivaPremium from "./pages/AttivaPremium.jsx";
import CheckoutStripe from "./pages/CheckoutStripe.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";

/* ======================================================
   SPECIAL
====================================================== */
import QuantumPage from "./pages/QuantumPage.jsx";

/* ======================================================
   LEGAL
====================================================== */
import Privacy from "./pages/legal/Privacy.jsx";
import Cookie from "./pages/legal/Cookie.jsx";
import Terms from "./pages/legal/Terms.jsx";
import Refunds from "./pages/legal/Refunds.jsx";
import Contatti from "./pages/Contatti.jsx";
import FAQ from "./pages/FAQ.jsx";
import Sicurezza from "./pages/Sicurezza.jsx";
import ComeFunziona from "./pages/ComeFunziona.jsx";
import ChiSiamo from "./pages/ChiSiamo.jsx";
import {
  Funzioni,
  Impostazioni,
  LogAdmin,
  LogStats,
  Notifiche,
  ProfiliPubblici,
  Visitatori,
} from "./pages/OperationalPages.jsx";
import LibroDaZeroLoveMatch360 from "./pages/LibroDaZeroLoveMatch360.jsx";

export default function App() {
  return (
    <Routes>
      {/* ======================================================
          AUTH
          fuori da AppShell
      ====================================================== */}
      <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      <Route path="/login-mfa" element={<LoginWithMFA />} />

      <Route
        path="*"
        element={
          <AppShell>
            <Routes>
              {/* ======================================================
                  PUBLIC
              ====================================================== */}
              <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/premium" element={<Premium />} />
              <Route
                path="/profilo"
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />
              <Route path="/profilo/:id" element={<ProfilePublicCard />} />
              <Route path="/paywall" element={<Premium />} />

              {/* ======================================================
                  AUTH REQUIRED
              ====================================================== */}
              <Route
                path="/scopri"
                element={
                  <RequireAuth>
                    <PublicProfilesPage />
                  </RequireAuth>
                }
              />


        <Route
          path="/match"
          element={
            <RequireAuth>
              <MatchDashboard />
            </RequireAuth>
          }
        />
<Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <Admin />
                  </RequireAdmin>
                }
              />

              {/* ======================================================
                  PREMIUM / BILLING / STRIPE
              ====================================================== */}
              <Route
                path="/billing"
                element={
                  <RequirePremium>
                    <Billing />
                  </RequirePremium>
                }
              />

              <Route
                path="/quantum"
                element={
                  <RequirePremium>
                    <QuantumPage />
                  </RequirePremium>
                }
              />

              <Route
                path="/attiva-premium"
                element={
                  <RequireAuth>
                    <AttivaPremium />
                  </RequireAuth>
                }
              />

              <Route
                path="/checkout"
                element={
                  <RequireAuth>
                    <CheckoutStripe />
                  </RequireAuth>
                }
              />

              <Route
                path="/checkout/success"
                element={
                  <RequireAuth>
                    <CheckoutSuccess />
                  </RequireAuth>
                }
              />

              <Route
                path="/checkout-success"
                element={
                  <RequireAuth>
                    <CheckoutSuccess />
                  </RequireAuth>
                }
              />

              {/* ======================================================
                  LEGAL
              ====================================================== */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie" element={<Cookie />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/refunds" element={<Refunds />} />
<Route path="/termini" element={<Terms />} />
<Route path="/rimborsi" element={<Refunds />} />
<Route path="/contatti" element={<Contatti />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/sicurezza" element={<Sicurezza />} />
<Route path="/come-funziona" element={<ComeFunziona />} />
<Route path="/chi-siamo" element={<ChiSiamo />} />
<Route path="/funzioni" element={<Funzioni />} />
<Route path="/profili-pubblici" element={<ProfiliPubblici />} />
<Route path="/impostazioni" element={<RequireAuth><Impostazioni /></RequireAuth>} />
<Route path="/notifiche" element={<RequireAuth><Notifiche /></RequireAuth>} />
<Route path="/visitatori" element={<RequireAdmin><Visitatori /></RequireAdmin>} />
<Route path="/log-admin" element={<RequireAdmin><LogAdmin /></RequireAdmin>} />
<Route path="/log-stats" element={<RequireAdmin><LogStats /></RequireAdmin>} />
              <Route path="/libro/da-zero-a-lovematch360" element={<LibroDaZeroLoveMatch360 />} />

              {/* ======================================================
                  FALLBACK
              ====================================================== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        }
      />
    </Routes>
  );
}
