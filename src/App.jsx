import { Routes, Route } from "react-router-dom";
import AppShell from "./AppShell.jsx";

import Home from "./pages/Home.jsx";
import Premium from "./pages/Premium.jsx";
import Discover from "./pages/Discover.jsx";
import Profile from "./pages/Profile.jsx";
import Admin from "./pages/Admin.jsx";
import Billing from "./pages/Billing.jsx";
import NotFound from "./pages/NotFound.jsx";

import Privacy from "./pages/legal/Privacy.jsx";
import Cookie from "./pages/legal/Cookie.jsx";
import Terms from "./pages/legal/Terms.jsx";
import Refunds from "./pages/legal/Refunds.jsx";

import QuantumPage from "./pages/QuantumPage.jsx";

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/scopri" element={<Discover />} />
        <Route path="/profilo" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/billing" element={<Billing />} />

        {/* Nuova pagina â€œQuantumâ€ */}
        <Route path="/quantum" element={<QuantumPage />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookie" element={<Cookie />} />
        <Route path="/termini" element={<Terms />} />
        <Route path="/rimborsi" element={<Refunds />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}