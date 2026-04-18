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
import Premium from "./pages/Premium.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProfilePublicCard from "./pages/ProfilePublicCard.jsx";
import NotFound from "./pages/NotFound.jsx";

/* ======================================================
   DISCOVERY / APP
====================================================== */
import PublicProfilesPage from "./pages/PublicProfilesPage.jsx";
import Admin from "./pages/Admin.jsx";
import Billing from "./pages/Billing.jsx";

/* ======================================================
   AUTH
====================================================== */
import LoginPage from "./pages/LoginPage.jsx";
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

export default function App() {
  return (
    <Routes>
      {/* ======================================================
          AUTH
          fuori da AppShell
      ====================================================== */}
      <Route path="/login" element={<LoginPage />} />
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
              <Route path="/premium" element={<Premium />} />
              <Route path="/profilo" element={<ProfilePage />} />
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