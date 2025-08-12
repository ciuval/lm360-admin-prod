import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { QRCode } from "qrcode.react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SetupMFA() {
  const [factorId, setFactorId] = useState(null);
  const [otpUri, setOtpUri] = useState(null);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const enableTotp = async () => {
      try {
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: "totp",
        });

        if (error) throw error;

        setFactorId(data.id);
        setOtpUri(data.totp.qr_code);
        toast.success("✅ MFA TOTP attivato. Scansiona il codice!");
      } catch (err) {
        console.error("Errore MFA:", err);
        toast.error("❌ Errore durante la generazione del codice MFA.");
      }
    };

    enableTotp();
  }, []);

  const verifyCode = async () => {
    try {
      const { error } = await supabase.auth.mfa.verify({
        factorId,
        code,
      });

      if (error) throw error;

      toast.success("🔐 MFA verificato con successo!");
      navigate("/profilo");
    } catch (err) {
      console.error("Errore verifica codice:", err);
      toast.error("❌ Codice errato. Riprova.");
    }
  };

  return (
    <div style={container}>
      <Toaster position="top-right" />
      <h1 style={title}>🔐 Configura l'autenticazione a due fattori 
(MFA)</h1>

      {otpUri ? (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <QRCode value={otpUri} size={200} />
          <p style={{ marginTop: "1rem" }}>Scansiona con Google 
Authenticator o Authy</p>
        </div>
      ) : (
        <p>🔄 Generazione QR Code...</p>
      )}

      <input
        type="text"
        placeholder="Inserisci codice MFA"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={input}
      />

      <button onClick={verifyCode} style={button}>
        ✅ Verifica Codice
      </button>
    </div>
  );
}

// 🔧 Styles
const container = {
  maxWidth: "500px",
  margin: "0 auto",
  padding: "2rem",
  color: "#fff",
  textAlign: "center",
};

const title = {
  fontSize: "1.75rem",
  marginBottom: "1rem",
  color: "#f08fc0",
};

const input = {
  padding: "0.75rem",
  fontSize: "1rem",
  borderRadius: "8px",
  width: "100%",
  marginBottom: "1rem",
  border: "1px solid #ccc",
};

const button = {
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  borderRadius: "8px",
  backgroundColor: "#f08fc0",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
};

