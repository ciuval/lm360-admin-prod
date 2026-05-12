import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

const reservedEmails = new Set([
  "test@example.com",
  "admin@domain.com",
  "user@site.com",
]);

function isEmailValid(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !reservedEmails.has(value);
}

function normalizeSignupError(error) {
  const message = String(error?.message || "").toLowerCase();
  const code = String(error?.code || "").toLowerCase();

  if (message.includes("already registered") || message.includes("already exists")) {
    return "Questo indirizzo email risulta già registrato. Accedi oppure usa un altro indirizzo.";
  }

  if (message.includes("password") || code.includes("password")) {
    return "La password non rispetta i requisiti minimi. Usa almeno 8 caratteri.";
  }

  if (message.includes("email")) {
    return "Controlla che l'indirizzo email sia corretto.";
  }

  if (message.includes("signup") || code.includes("signup_disabled")) {
    return "La registrazione via email non è disponibile in questo momento.";
  }

  return "Registrazione non completata. Riprova tra poco.";
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const navigate = useNavigate();

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  async function handleRegister(event) {
    event.preventDefault();
    setStatusMessage("");

    if (!isEmailValid(normalizedEmail)) {
      const message = "Inserisci un indirizzo email valido.";
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    if (password.length < 8) {
      const message = "La password deve contenere almeno 8 caratteri.";
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    if (!acceptedLegal) {
      const message = "Per creare l'account devi accettare Termini e Privacy.";
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          privacy_acknowledged: true,
          terms_accepted: true,
          legal_accepted_at: new Date().toISOString(),
          legal_version: "v1",
          source: "register_page_v1",
        },
      },
    });

    setLoading(false);

    if (error) {
      const message = normalizeSignupError(error);
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    const successMessage = "Registrazione inviata. Controlla la tua email per completare l'accesso.";
    setStatusMessage(successMessage);
    toast.success(successMessage);
    navigate("/login");
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle} aria-labelledby="register-title">
        <p style={eyebrowStyle}>LoveMatch360</p>

        <h1 id="register-title" style={titleStyle}>
          Registrati
        </h1>

        <p style={introStyle}>
          Crea il tuo account per iniziare il percorso su LoveMatch360. In questa fase
          usiamo solo email e password.
        </p>

        <form onSubmit={handleRegister} noValidate style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="register-email" style={labelStyle}>
              Email
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="nome@dominio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label htmlFor="register-password" style={labelStyle}>
              Password
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Almeno 8 caratteri"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              style={inputStyle}
            />
          </div>

          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(event) => setAcceptedLegal(event.target.checked)}
              style={checkboxStyle}
            />
            <span>
              Accetto i{" "}
              <Link to="/terms" style={linkStyle}>
                Termini
              </Link>{" "}
              e confermo di aver letto la{" "}
              <Link to="/privacy" style={linkStyle}>
                Privacy
              </Link>
              .
            </span>
          </label>

          <p id="register-status" role="status" aria-live="polite" style={statusStyle}>
            {statusMessage}
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...primaryButtonStyle,
              ...(loading ? disabledButtonStyle : {}),
            }}
          >
            {loading ? "Creazione account..." : "Crea account"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={secondaryButtonStyle}
          >
            Hai già un account? Accedi
          </button>
        </form>
      </section>
    </main>
  );
}

const pageStyle = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: "32px 16px",
  color: "#fff",
  background: "#08080d",
};

const cardStyle = {
  width: "min(560px, 100%)",
  border: "1px solid rgba(240, 143, 192, 0.28)",
  borderRadius: "28px",
  padding: "32px",
  background: "linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025))",
  boxShadow: "0 24px 80px rgba(0,0,0,0.42)",
};

const eyebrowStyle = {
  margin: "0 0 10px",
  color: "#c9c9d6",
  fontSize: "0.78rem",
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: "0",
  color: "#f08fc0",
  fontSize: "clamp(2.2rem, 6vw, 3.4rem)",
  lineHeight: 1,
};

const introStyle = {
  margin: "14px 0 24px",
  color: "#d7d7e3",
  fontSize: "1rem",
  lineHeight: 1.7,
};

const formStyle = {
  display: "grid",
  gap: "16px",
};

const fieldStyle = {
  display: "grid",
  gap: "8px",
  textAlign: "left",
};

const labelStyle = {
  fontWeight: 800,
  color: "#fff",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "16px",
  border: "1px solid rgba(240, 143, 192, 0.46)",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

const checkboxRowStyle = {
  display: "grid",
  gridTemplateColumns: "22px 1fr",
  gap: "12px",
  alignItems: "start",
  color: "#d7d7e3",
  fontSize: "0.95rem",
  lineHeight: 1.55,
  textAlign: "left",
};

const checkboxStyle = {
  width: "18px",
  height: "18px",
  marginTop: "3px",
};

const linkStyle = {
  color: "#f08fc0",
  fontWeight: 800,
};

const statusStyle = {
  minHeight: "24px",
  margin: 0,
  color: "#ffd4e9",
  fontWeight: 700,
  lineHeight: 1.5,
};

const primaryButtonStyle = {
  width: "100%",
  padding: "15px 18px",
  backgroundColor: "#f08fc0",
  color: "#050508",
  border: "none",
  borderRadius: "16px",
  fontWeight: 900,
  fontSize: "1rem",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  width: "100%",
  padding: "14px 18px",
  backgroundColor: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.16)",
  borderRadius: "16px",
  fontWeight: 800,
  fontSize: "1rem",
  cursor: "pointer",
};

const disabledButtonStyle = {
  opacity: 0.62,
  cursor: "wait",
};
