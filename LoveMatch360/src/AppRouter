import React from "react";
import { HashRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Signup   = React.lazy(() => import("./pages/Signup"));
const Discover = React.lazy(() => import("./pages/Discover"));
const Likes    = React.lazy(() => import("./pages/Likes"));
const Matches  = React.lazy(() => import("./pages/Matches"));
const Chat     = React.lazy(() => import("./pages/Chat"));
const Premium  = React.lazy(() => import("./pages/Premium"));
const Privacy  = React.lazy(() => import("./pages/Privacy"));
const Terms    = React.lazy(() => import("./pages/Terms"));

function Layout(){
  return (
    <div className="app-shell" style={{minHeight:"100dvh", display:"flex", flexDirection:"column"}}>
      <a className="sr-only" href="#main">Salta al contenuto</a>
      <Header />
      <div style={{flex:1}}>
        <React.Suspense fallback={<main id="main" style={{padding:24}}>Caricamento…</main>}>
          <Outlet />
        </React.Suspense>
      </div>
      <Footer />
    </div>
  );
}

function NotFound(){
  return (
    <main id="main" tabIndex={-1} style={{padding:"24px"}}>
      <h1>Pagina non trovata</h1>
      <p><a href="#/discover">Torna a Scopri</a></p>
    </main>
  );
}

export default function AppRouter(){
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/discover" replace />} />
          <Route path="/signup"   element={<Signup />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/likes"    element={<Likes />} />
          <Route path="/matches"  element={<Matches />} />
          <Route path="/chat"     element={<Chat />} />
          <Route path="/premium"  element={<Premium />} />
          <Route path="/privacy"  element={<Privacy />} />
          <Route path="/termini"  element={<Terms />} />
          <Route path="*"         element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
