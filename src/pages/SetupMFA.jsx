// src/pages/SetupMFA.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

export default function SetupMFA() {
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const generaQR = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setError("Sessione non attiva. Effettua nuovamente il login.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });

      if (error) {
        console.error(error);
        setError("Errore durante la generazione del codice QR.");
      } else {
        setQr(data.totp.qr_code);
        setFactorId(data.id);
      }

      setLoading(false);
    };

    generaQR();
  }, []);

  const verificaCodice = async () => {
    const { error } = await supabase.auth.mfa.verify({ factorId, code });
    if (error) {
      toast.error("Codice non valido");
    } else {
      toast.success("✅ MFA attivato con successo");
      navigate("/profilo");
    }
  };

  return (
    <div style={container}>
      <Toaster position="top-right" />
      <h2 style={title}>🔐 Configura MFA</h2>

      {loading ? (
        <p style={{ marginTop: "2rem" }}>⏳ Caricamento codice QR...</p>
      ) : error ? (
        <>
          <p style={{ color: "#ff8080", fontWeight: "bold", marginTop: "1rem" }}>{error}</p>
          <button style={btn} onClick={() => navigate("/login")}>🔁 Torna al Login</button>
        </>
      ) : (
        <>
          <div style={{ margin: "1rem auto", width: "fit-content" }}>
            <QRCode value={qr} />
            <p style={{ marginTop: "1rem" }}>Scansiona con Google Authenticator</p>
          </div>
          <input
            type="text"
            placeholder="Inserisci codice"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={input}
          />
          <button onClick={verificaCodice} style={btn}>Verifica Codice</button>
        </>
      )}
    </div>
  );
}

const container = {
  padding: "2rem",
  backgroundColor: "#121212",
  color: "#fff",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
  textAlign: "center",
};

const title = {
  fontSize: "1.5rem",
  color: "#f08fc0",
  marginBottom: "1rem",
};

const input = {
  padding: "0.8rem",
  marginTop: "1rem",
  borderRadius: "8px",
  border: "none",
  fontSize: "1rem",
  width: "240px",
};

const btn = {
  marginTop: "1rem",
  padding: "0.8rem 1.5rem",
  backgroundColor: "#f08fc0",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

