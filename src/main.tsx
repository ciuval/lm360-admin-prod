import React from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./AppRouter";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";          // <— tailwind/tema
import "./styles/a11y.css";   // <— focus & accessibilità
import { supabase, hasSupabase } from './lib/supabase';
import "./lib/premium-boot.js";

if (!hasSupabase) {
  console.warn('Supabase non configurato — modalità locale attiva.');
}
const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </React.StrictMode>
);
