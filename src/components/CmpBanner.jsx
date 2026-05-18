import React, { useEffect, useState } from "react";

const KEY = "cmp.analytics";
const CONSENT_EVENT = "lm360:analytics-consent";

function saveAnalyticsConsent(value) {
  try {
    localStorage.setItem(KEY, value);
    window.dispatchEvent(
      new CustomEvent(CONSENT_EVENT, {
        detail: { value },
      })
    );
  } catch {
    // No logging: consent handling must not leak browser/session details.
  }
}

export default function CmpBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const value = localStorage.getItem(KEY);

      if (value === null) {
        setShow(true);
      }
    } catch {
      setShow(false);
    }
  }, []);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Preferenze analytics"
      style={{
        position: "fixed",
        inset: "auto 0 0 0",
        background: "var(--elev)",
        borderTop: "var(--border)",
        padding: "12px",
        display: "flex",
        gap: 8,
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <div style={{ flex: 1 }}>
        Usiamo analytics opzionali e minimizzati per migliorare l’esperienza.
        Accetti?
      </div>

      <button
        onClick={() => {
          saveAnalyticsConsent("false");
          setShow(false);
        }}
        style={{
          background: "transparent",
          color: "var(--txt)",
          border: "var(--border)",
          borderRadius: "var(--radius)",
          padding: "8px 10px",
        }}
      >
        Rifiuta
      </button>

      <button
        onClick={() => {
          saveAnalyticsConsent("true");
          setShow(false);
        }}
        style={{
          background: "var(--ok)",
          color: "#121212",
          border: "none",
          borderRadius: "var(--radius)",
          padding: "8px 10px",
        }}
      >
        Accetta
      </button>
    </div>
  );
}
