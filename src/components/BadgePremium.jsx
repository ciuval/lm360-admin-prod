// ✅ File: src/components/BadgePremium.jsx
import React from "react";

export default function BadgePremium({ ruolo, fine }) {
  const isPremium = ruolo === "premium";
  const scaduto = fine && new Date(fine) < new Date();

  const style = {
    padding: "0.4rem 0.8rem",
    borderRadius: "999px",
    fontWeight: "bold",
    fontSize: "0.8rem",
    backgroundColor: isPremium && !scaduto ? "#f08fc0" : "#444",
    color: isPremium && !scaduto ? "#000" : "#999",
    display: "inline-block",
    marginTop: "0.5rem",
  };

  return (
    <span style={style}>
      {isPremium && !scaduto ? "💎 Premium Attivo" : scaduto ? "🔒 Premium Scaduto" : "Free User"}
    </span>
  );
}
