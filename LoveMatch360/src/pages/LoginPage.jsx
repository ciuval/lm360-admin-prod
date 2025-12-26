// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("❌ Errore login: " + error.message);
    } else {
      toast.success("✅ Login riuscito!");
      navigate("/profilo");
    }
  };

  return (
    <div style={formContainer}>
      <h2>🔐 Accedi</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />
      <button onClick={handleLogin} style={buttonStyle}>Accedi</button>
    </div>
  );
}

const formContainer = {
  padding: "2rem",
  maxWidth: "400px",
  margin: "auto",
  backgroundColor: "#121212",
  color: "#fff",
  borderRadius: "8px",
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "1rem",
  padding: "0.8rem",
  borderRadius: "6px",
  border: "1px solid #f08fc0",
  backgroundColor: "#1e1e1e",
  color: "#fff",
};

const buttonStyle = {
  backgroundColor: "#f08fc0",
  padding: "0.8rem",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};
