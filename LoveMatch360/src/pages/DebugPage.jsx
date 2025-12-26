import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DebugPage() {
  const [email, setEmail] = useState("vale-test@example.com");
  const [password, setPassword] = useState("ValeTest123!");
  const [output, setOutput] = useState("");
  const [user, setUser] = useState(null);
  const [profilo, setProfilo] = useState(null);
  const [match, setMatch] = useState([]);
  const [messaggi, setMessaggi] = useState([]);

  const testLogin = async () => {
    setOutput("⏳ Login in corso...");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setOutput(`❌ Errore login: ${error.message}`);
    setUser(data.user);
    setOutput(`✅ Login OK: ${data.user.email}`);
    fetchDati(data.user);
  };

  const testProfilo = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setOutput("❌ Nessun utente loggato");
    setUser(user);
    fetchDati(user);
  };

  const fetchDati = async (utente) => {
    setOutput("⏳ Caricamento dati...");

    const { data: prof, error: err1 } = await supabase
      .from("profili")
      .select("*")
      .eq("id", utente.id)
      .single();
    setProfilo(prof);

    const { data: matchData } = await supabase
      .from("match_scores")
      .select("*")
      .or(`user1_id.eq.${utente.id},user2_id.eq.${utente.id}`)
      .gte("match_score", 90);
    setMatch(matchData || []);

    const { data: messaggiData } = await supabase
      .from("messaggi")
      .select("*")
      .or(`mittente.eq.${utente.id},destinatario.eq.${utente.id}`)
      .order("created_at", { ascending: false })
      .limit(10);
    setMessaggi(messaggiData || []);

    setOutput("✅ Dati caricati.");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return setOutput(`❌ Logout fallito: ${error.message}`);
    setUser(null);
    setProfilo(null);
    setMatch([]);
    setMessaggi([]);
    setOutput("✅ Logout effettuato");
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div style={container}>
      <h2 style={title}>🧪 Debug Page LoveMatch360</h2>

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

      {user && (
        <div style={dataBox}>
          <h3>🔐 Utente Loggato</h3>
          <pre>{JSON.stringify(user, null, 2)}</pre>

          <h3>🙋 Profilo</h3>
          <pre>{JSON.stringify(profilo, null, 2)}</pre>

          <h3>💘 Match Attivi</h3>
          <pre>{JSON.stringify(match, null, 2)}</pre>

          <h3>💬 Ultimi Messaggi</h3>
          <pre>{JSON.stringify(messaggi, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// STILI
const container = {
  padding: "2rem",
  maxWidth: "800px",
  margin: "0 auto",
  color: "white",
  fontFamily: "'Segoe UI', sans-serif",
};

const title = {
  fontSize: "1.7rem",
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

const dataBox = {
  marginTop: "2rem",
  backgroundColor: "#111",
  padding: "1rem",
  borderRadius: "8px",
  border: "1px solid #444",
};
