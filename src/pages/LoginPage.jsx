import React, { useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function normalizeAuthError(error) {
  const message = String(error?.message || "").toLowerCase();
  const status = Number(error?.status || 0);

  if (
    message.includes("invalid login credentials") ||
    message.includes("email not confirmed") ||
    message.includes("invalid email or password") ||
    status === 400
  ) {
    return "Email o password non valide.";
  }

  if (
    message.includes("too many requests") ||
    message.includes("rate limit") ||
    status === 429
  ) {
    return "Troppi tentativi. Riprova tra poco.";
  }

  return "Errore temporaneo di accesso. Riprova.";
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    const candidate = location.state?.from;
    return typeof candidate === "string" && candidate.trim() ? candidate : "/profilo";
  }, [location.state]);

  const isDisabled = useMemo(() => {
    return submitting || !email.trim() || !password;
  }, [submitting, email, password]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isDisabled) return;

    setSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        toast.error(normalizeAuthError(error));
        return;
      }

      toast.success("Accesso riuscito.");
      navigate(from, { replace: true });
    } catch {
      toast.error("Errore temporaneo di accesso. Riprova.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={pageStyle}>
      <section style={cardStyle} aria-labelledby="login-title">
        <header style={headerStyle}>
          <div aria-hidden="true" style={iconStyle}>
            🔐
          </div>
          <div>
            <h1 id="login-title" style={titleStyle}>
              Accedi
            </h1>
            <p style={subtitleStyle}>
              Inserisci le tue credenziali per entrare in LoveMatch360.
            </p>
          </div>
        </header>

        <form onSubmit={handleLogin} noValidate>
          <label htmlFor="login-email" style={labelStyle}>
            Email
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nome@dominio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            disabled={submitting}
            aria-describedby="login-help"
          />

          <label htmlFor="login-password" style={labelStyle}>
            Password
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="La tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            disabled={submitting}
          />

          <p id="login-help" style={helpStyle}>
            Usa un account attivo con credenziali valide.
          </p>

          <button
            type="submit"
            style={{
              ...buttonStyle,
              ...(isDisabled ? buttonDisabledStyle : null),
            }}
            disabled={isDisabled}
            aria-busy={submitting ? "true" : "false"}
          >
            {submitting ? "Accesso in corso..." : "Accedi"}
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
  padding: "24px 16px",
  background: "#0b0b0f",
};

const cardStyle = {
  width: "100%",
  maxWidth: "480px",
  padding: "24px",
  background: "linear-gradient(180deg, rgba(24,24,30,0.98) 0%, rgba(18,18,24,0.98) 100%)",
  color: "#ffffff",
  borderRadius: "20px",
  border: "1px solid rgba(240,143,192,0.22)",
  boxShadow: "0 16px 40px rgba(0,0,0,0.32)",
};

const headerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "20px",
};

const iconStyle = {
  fontSize: "1.7rem",
  lineHeight: 1,
};

const titleStyle = {
  margin: 0,
  fontSize: "2rem",
  lineHeight: 1.1,
};

const subtitleStyle = {
  margin: "8px 0 0",
  color: "rgba(255,255,255,0.78)",
  lineHeight: 1.6,
  fontSize: "0.96rem",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "rgba(255,255,255,0.92)",
};

const inputStyle = {
  display: "block",
  width: "100%",
  marginBottom: "16px",
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(240,143,192,0.85)",
  backgroundColor: "#1a1a20",
  color: "#ffffff",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

const helpStyle = {
  margin: "4px 0 18px",
  color: "rgba(255,255,255,0.66)",
  lineHeight: 1.5,
  fontSize: "0.92rem",
};

const buttonStyle = {
  width: "100%",
  backgroundColor: "#e58abb",
  padding: "14px 16px",
  border: "none",
  borderRadius: "12px",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  transition: "opacity 120ms ease",
};

const buttonDisabledStyle = {
  opacity: 0.7,
  cursor: "not-allowed",
};