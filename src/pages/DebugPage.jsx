import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DebugPage() {
  const [email, setEmail] = useState("vale-test@example.com");
  const [password, setPassword] = useState("ValeTest123!");
  const [output, setOutput] = useState("");

  const testLogin = async () => {
    setOutput("⏳ Login in corso...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setOutput(`❌ Errore login: ${error.message}`);
    setOutput(`✅ Login OK: ${data.user.email}`);
  };

  const testProfilo = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setOutput("❌ Nessun utente loggato");

    const { data, error } = await supabase
      .from("profili")
      .select("*")
      .eq("id", user.id);

    if (error) return setOutput(`❌ Errore profilo: ${error.message}`);
    setOutput(`📘 Profilo trovato: ${JSON.stringify(data, null, 2)}`);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return setOutput(`❌ Logout fallito: ${error.message}`);
    setOutput("✅ Logout effettuato");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div style={container}>
      <h2 style={title}>🧪 Debug Login + RLS</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        style={input}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        style={input}
      />

      <div style={buttonGroup}>
        <button onClick={testLogin} style={buttonGreen}>🔐 Login</button>
        <button onClick={testProfilo} style={buttonBlue}>📘 Test Profilo</button>
        <button onClick={handleLogout} style={buttonRed}>🔓 Logout</button>
      </div>

      <pre style={outputStyle}>{output}</pre>
    </div>
  );
}

// STILI
const container = {
  padding: "2rem",
  maxWidth: "600px",
  margin: "0 auto",
  color: "white",
  fontFamily: "'Segoe UI', sans-serif",
};

const title = {
  fontSize: "1.5rem",
  marginBottom: "1rem",
  color: "#f08fc0",
};

const input = {
  width: "100%",
  marginBottom: "1rem",
  padding: "0.8rem",
  borderRadius: "6px",
  border: "1px solid #444",
  backgroundColor: "#1e1e1e",
  color: "#fff",
};

const buttonGroup = {
  display: "flex",
  gap: "1rem",
  marginBottom: "1rem",
};

const baseBtn = {
  padding: "0.6rem 1rem",
  borderRadius: "6px",
  border: "none",
  color: "#fff",
  cursor: "pointer",
};

const buttonGreen = {
  ...baseBtn,
  backgroundColor: "#2ecc71",
};

const buttonBlue = {
  ...baseBtn,
  backgroundColor: "#3498db",
};

const buttonRed = {
  ...baseBtn,
  backgroundColor: "#e74c3c",
};

const outputStyle = {
  whiteSpace: "pre-wrap",
  backgroundColor: "#1e1e1e",
  padding: "1rem",
  borderRadius: "6px",
  border: "1px solid #333",
  fontSize: "0.9rem",
};
