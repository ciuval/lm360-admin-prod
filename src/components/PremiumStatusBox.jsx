import React, { useMemo } from "react";
import { getTierFromProfile } from "../lib/accountTier";

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getContent({ tier, premium_fine }) {
  const expiry = formatDate(premium_fine);

  if (tier === "admin") {
    return {
      icon: "🛡️",
      badge: "Admin",
      title: "Ruolo di controllo attivo",
      text: "Hai accesso amministrativo. Questo stato non corrisponde a un piano premium commerciale.",
      accent: {
        border: "1px solid rgba(250,204,21,0.30)",
        background: "rgba(250,204,21,0.10)",
        badgeBg: "rgba(250,204,21,0.16)",
        badgeText: "#ffe08a",
        title: "#fff0b8",
        text: "rgba(255,244,204,0.92)",
      },
    };
  }

  if (tier === "super") {
    return {
      icon: "⚡",
      badge: "Super",
      title: "Piano Super attivo",
      text: expiry
        ? `Il tuo accesso Super è valido fino al ${expiry}.`
        : "Il tuo accesso Super è attivo.",
      accent: {
        border: "1px solid rgba(125,211,252,0.30)",
        background: "rgba(125,211,252,0.10)",
        badgeBg: "rgba(125,211,252,0.16)",
        badgeText: "#cceeff",
        title: "#e6f6ff",
        text: "rgba(227,244,255,0.92)",
      },
    };
  }

  if (tier === "premium") {
    return {
      icon: "💎",
      badge: "Premium",
      title: "Piano Premium attivo",
      text: expiry
        ? `Il tuo accesso Premium è valido fino al ${expiry}.`
        : "Il tuo accesso Premium è attivo.",
      accent: {
        border: "1px solid rgba(240,143,192,0.30)",
        background: "rgba(240,143,192,0.10)",
        badgeBg: "rgba(240,143,192,0.16)",
        badgeText: "#ffd7ea",
        title: "#ffe8f3",
        text: "rgba(255,232,244,0.92)",
      },
    };
  }

  return {
    icon: "✨",
    badge: "Free",
    title: "Piano Free attivo",
    text: "Stai usando LoveMatch360 in modalità base. Le funzioni premium restano disponibili solo se il tuo tier viene attivato.",
    accent: {
      border: "1px solid rgba(255,255,255,0.10)",
      background: "rgba(255,255,255,0.04)",
      badgeBg: "rgba(255,255,255,0.06)",
      badgeText: "rgba(255,255,255,0.82)",
      title: "#ffffff",
      text: "rgba(255,255,255,0.84)",
    },
  };
}

export default function PremiumStatusBox({
  ruolo,
  premium = false,
  premium_fine = null,
}) {
  const tier = useMemo(() => {
    return getTierFromProfile({
      ruolo,
      premium,
      premium_fine,
    });
  }, [ruolo, premium, premium_fine]);

  const content = useMemo(() => {
    return getContent({ tier, premium_fine });
  }, [tier, premium_fine]);

  return (
    <section
      aria-label="Stato account"
      style={{
        marginBottom: "1rem",
        padding: "16px",
        borderRadius: "16px",
        border: content.accent.border,
        background: content.accent.background,
        boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: "1 1 320px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px",
              borderRadius: "999px",
              background: content.accent.badgeBg,
              color: content.accent.badgeText,
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              marginBottom: "10px",
            }}
          >
            <span aria-hidden="true">{content.icon}</span>
            <span>{content.badge}</span>
          </div>

          <h3
            style={{
              margin: 0,
              color: content.accent.title,
              fontSize: "1.05rem",
              lineHeight: 1.25,
            }}
          >
            {content.title}
          </h3>

          <p
            style={{
              margin: "8px 0 0",
              color: content.accent.text,
              fontSize: "0.96rem",
              lineHeight: 1.65,
              maxWidth: "62ch",
            }}
          >
            {content.text}
          </p>
        </div>
      </div>
    </section>
  );
}