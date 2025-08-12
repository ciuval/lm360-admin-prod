// src/pages/RegisterPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = (email) => {
    const blocked = ["test@example.com", "admin@domain.com", "user@site.com"];
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !blocked.includes(email);
  };

  const handleRegister = async () => {
    if (!isEmailValid(email)) {
      toast.error("📛 Email non valida o bloccata");
      return;
    }
    if (password.length < 6) {
      toast.error("🔐 Password troppo corta (minimo 6 caratteri)");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      toast.error(`❌ Errore: ${error.message}`);
    } else {
      toast.success("✅ Registrazione inviata! Controlla la tua email");
      navigate("/login");
    }
  };

  return (
    <div style={container}>
      <h2 style={title}>✨ Registrati</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={input}
      />
      <button onClick={handleRegister} disabled={loading} style={button}>
        {loading ? "⏳..." : "Registrati"}
      </button>
    </div>
  );
}

const container = {
  padding: "2rem",
  maxWidth: "400px",
  margin: "auto",
  textAlign: "center",
  color: "#fff",
};

const title = {
  color: "#f08fc0",
  marginBottom: "1rem",
};

const input = {
  width: "100%",
  padding: "0.8rem",
  marginBottom: "1rem",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  fontSize: "1rem",
};

const button = {
  width: "100%",
  padding: "0.8rem",
  backgroundColor: "#f08fc0",
  color: "#000",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  fontSize: "1rem",
  cursor: "pointer",
};

