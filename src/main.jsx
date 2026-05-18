import "./styles/tokens.css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary";
import CmpBanner from "./components/CmpBanner.jsx";

const ANALYTICS_CONSENT_KEY = "cmp.analytics";
const ANALYTICS_CONSENT_EVENT = "lm360:analytics-consent";

function readAnalyticsConsent() {
  try {
    return localStorage.getItem(ANALYTICS_CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

function ConsentAwareAnalytics() {
  const [enabled, setEnabled] = useState(readAnalyticsConsent);

  useEffect(() => {
    const syncConsent = () => {
      setEnabled(readAnalyticsConsent());
    };

    window.addEventListener(ANALYTICS_CONSENT_EVENT, syncConsent);
    window.addEventListener("storage", syncConsent);

    syncConsent();

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  if (!enabled) return null;

  return <Analytics />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <App />
        <CmpBanner />
        <ConsentAwareAnalytics />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4500,
          }}
        />
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
