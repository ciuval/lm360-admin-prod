// src/components/UpgradePrompt.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function UpgradePrompt() {
  const navigate = useNavigate();

  return (
    <div style={boxStyle}>
      <h3 style={titleStyle}>🔓 Funzioni Premium Bloccate</h3>
      <p style={textStyle}>
        Attiva l'accesso Premium per sbloccare:
      </p>
      <ul style={listStyle}>
        <li>💬 Chat senza limiti</li>
        <li>🚀 Match prioritari</li>
        <li>🔍 Visualizza chi ti visita</li>
        <li>💎 Accesso esclusivo ai profili Top</li>
      </ul>
      <button style={btnStyle} onClick={() => navigate("/premium")}>
        💎 Passa a Premium
      </button>
    </div>
  );
}

const boxStyle = {
  backgroundColor: "#1e1e1e",
  border: "1px solid #f08fc0",
  borderRadius: "8px",
  padding: "1.5rem",
  marginBottom: "2rem",
  textAlign: "center",
  boxShadow: "0 0 8px #f08fc0",
};

const titleStyle = {
  color: "#f08fc0",
  fontSize: "1.4rem",
  marginBottom: "0.5rem",
};

const textStyle = {
  fontSize: "1rem",
  color: "#ccc",
  marginBottom: "1rem",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  marginBottom: "1.5rem",
  color: "#eee",
  fontSize: "1rem",
  textAlign: "left",
  maxWidth: "400px",
  margin: "0 auto 1.5rem",
  lineHeight: "1.7",
};

const btnStyle = {
  padding: "0.8rem 1.6rem",
  backgroundColor: "#f08fc0",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1rem",
};
