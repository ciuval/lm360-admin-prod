import React from "react";

export default function FunzioniStato() {
  const shareLink = "https://lovematch360.com/#/funzioni";

  const copiaLink = () => {
    navigator.clipboard.writeText(shareLink);
    alert("🔗 Link copiato negli appunti!");
  };

  return (
    <div style={{ padding: "2rem", color: "#fff", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem", color: "#f08fc0" }}>
        🌐 LoveMatch360: Funzioni & Stato
      </h1>

      <h2 style={{ color: "#90ee90", fontSize: "1.25rem" }}>✅ Funzioni Attive</h2>
      <ul>
        <li>🧠 Matchmaking + dashboard 💘</li>
        <li>💬 Chat realtime</li>
        <li>📬 Newsletter Supabase+Zoho</li>
        <li>🧑‍💻 Admin Dashboard</li>
        <li>📈 Visite profili</li>
        <li>🔔 Notifiche toast + suono</li>
        <li>📝 Feed post</li>
        <li>🌑 Dark Mode</li>
      </ul>

      <h2 style={{ color: "orange", fontSize: "1.25rem", marginTop: "2rem" }}>🛠️ In Sviluppo</h2>
      <ul>
        <li>🔴 Badge messaggi</li>
        <li>🧭 Contatore match</li>
        <li>👀 Visitatori</li>
      </ul>

      <h2 style={{ color: "#87ceeb", fontSize: "1.25rem", marginTop: "2rem" }}>✨ Consigli</h2>
      <ul>
        <li>🔒 CAPTCHA + RLS</li>
        <li>💡 Punteggio visibile</li>
        <li>🤖 AI Match Assistant</li>
      </ul>

      {/* 🔗 Bottoni condivisione */}
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareLink)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={button("green")}
        >
          📤 WhatsApp
        </a>
        <a
          href={`mailto:?subject=Funzioni LoveMatch360&body=Scopri tutte le funzioni: ${shareLink}`}
          style={button("blue")}
        >
          📧 Email
        </a>
        <button onClick={copiaLink} style={button("gray")}>
          📋 Copia Link
        </button>
      </div>
    </div>
  );
}

function button(color) {
  const colors = {
    green: "#16a34a",
    blue: "#2563eb",
    gray: "#4b5563",
  };
  return {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    backgroundColor: colors[color],
    color: "#fff",
    fontWeight: "bold",
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
  };
}
