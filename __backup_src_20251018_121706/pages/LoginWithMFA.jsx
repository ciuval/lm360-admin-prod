// src/pages/LoginWithMFA.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function LoginWithMFA() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [factorId, setFactorId] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error?.message?.includes("MFA required")) {
      setFactorId(error?.factorId || error?.data?.factorId);
      setMfaRequired(true);
      toast("🔐 MFA richiesta. Inserisci il codice a 6 cifre.");
    } else if (error) {
      toast.error("Login fallito");
    } else {
      toast.success("✅ Login riuscito senza MFA");
      window.location.href = "/profilo";
    }
  };

  const handleVerifyMFA = async () => {
    const { error } = await supabase.auth.mfa.verify({ factorId, code: mfaCode });

    if (error) return toast.error("Codice MFA errato ❌");
    toast.success("✅ Autenticazione completata!");
    window.location.href = "/profilo";
  };

  return (
    <div style={containerStyle}>
      <Toaster position="top-right" />
      <h2 style={titleStyle}>🔐 Login protetto</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
        disabled={mfaRequired}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
        disabled={mfaRequired}
      />

      {!mfaRequired ? (
        <button onClick={handleLogin} style={btnStyle}>
          🔓 Login
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Codice MFA (6 cifre)"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleVerifyMFA} style={btnStyle}>✅ Verifica MFA</button>
        </>
      )}
    </div>
  );
}

const containerStyle = {
  padding: "2rem",
  backgroundColor: "#121212",
  color: "#fff",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
};

const titleStyle = {
  color: "#f08fc0",
  marginBottom: "1.5rem",
};

const inputStyle = {
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #333",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  marginBottom: "1rem",
  width: "100%",
};

const btnStyle = {
  backgroundColor: "#f08fc0",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "0.6rem 1rem",
  cursor: "pointer",
  width: "100%",
};
