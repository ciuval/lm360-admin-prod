import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";
import { getActivationJourneyProps } from "../lib/activationJourney.js";
import { track } from "../lib/analytics.js";

function normalizeAuthError(error) {
  const code = String(error?.code || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();
  const status = Number(error?.status || 0);

  if (
    code === "email_not_confirmed" ||
    message.includes("email not confirmed")
  ) {
    return "Controlla la tua email prima di accedere.";
  }

  if (
    code === "invalid_credentials" ||
    message.includes("invalid login credentials") ||
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
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState("");
  const confirmationTrackedRef = useRef(false);
  const emailConfirmationLanded = new URLSearchParams(location.search).get("verified") === "1";

  useEffect(() => {
    if (!emailConfirmationLanded || confirmationTrackedRef.current) return;
    confirmationTrackedRef.current = true;
    track("email_confirmation_landed", getActivationJourneyProps()).catch(() => {});

    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive || !data?.session?.user) return;

      track("email_confirmed", {
        ...getActivationJourneyProps(),
        access: "automatic",
      }).catch(() => {});
      track("login_success", {
        ...getActivationJourneyProps(),
        method: "email_confirmation",
      }).catch(() => {});
      toast.success("Email confermata. Ora completa il tuo profilo.");
      navigate("/profilo", { replace: true });
    }).catch(() => {});

    return () => {
      alive = false;
    };
  }, [emailConfirmationLanded, navigate]);

  const redirectTo = useMemo(() => {
    const from = location.state?.from;
    return typeof from === "string" && from.trim() ? from : "/profilo";
  }, [location.search, location.state]);

  const guardNotice = useMemo(() => {
    if (emailConfirmationLanded) {
      return "Email confermata. Accedi e completa il profilo: sei a un passo da Scopri persone.";
    }

    if (location.state?.reason === "premium_required") {
      return "Per continuare serve un account Premium attivo.";
    }

    if (location.state?.reason === "auth_required" || location.state?.from) {
      return "Per continuare devi accedere prima di aprire questa pagina.";
    }

    return "";
  }, [emailConfirmationLanded, location.state]);

  const isDisabled = useMemo(() => {
    return submitting || !email.trim() || !password;
  }, [submitting, email, password]);

  const normalizedEmail = useMemo(() => {
    return email.trim().toLowerCase();
  }, [email]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isDisabled) return;

    setAuthError("");
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        track("login_failed", {
          ...getActivationJourneyProps(),
          confirmation_return: emailConfirmationLanded,
        }).catch(() => {});
        const uiMessage = normalizeAuthError(error);
        setAuthError(uiMessage);
        toast.error(uiMessage);
        return;
      }

      if (emailConfirmationLanded) {
        track("email_confirmed", {
          ...getActivationJourneyProps(),
          access: "password",
        }).catch(() => {});
      }

      track("login_success", {
        ...getActivationJourneyProps(),
        confirmation_return: emailConfirmationLanded,
      }).catch(() => {});
      toast.success("Accesso riuscito.");
      navigate(redirectTo, { replace: true });
    } catch {
      track("login_failed", {
        ...getActivationJourneyProps(),
        stage: "unexpected",
      }).catch(() => {});
      const uiMessage = "Errore temporaneo di accesso. Riprova.";
      setAuthError(uiMessage);
      toast.error(uiMessage);
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
              Entra nel tuo spazio oppure crea subito il tuo account.
            </p>
          </div>
        </header>

        <form onSubmit={handleLogin} noValidate>
          {guardNotice ? (
            <div role="status" aria-live="polite" style={noticeStyle}>
              {guardNotice}
            </div>
          ) : null}

          {authError ? (
            <div role="alert" aria-live="polite" style={errorBoxStyle}>
              {authError}
            </div>
          ) : null}

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
            onChange={(e) => {
              setEmail(e.target.value);
              if (authError) setAuthError("");
            }}
            style={inputStyle}
            disabled={submitting}
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
            onChange={(e) => {
              setPassword(e.target.value);
              if (authError) setAuthError("");
            }}
            style={inputStyle}
            disabled={submitting}
          />

          <p style={helpStyle}>
            Usa un account attivo con credenziali valide. Se sei nuovo, puoi registrarti da qui.
          </p>

          <div style={actionsStyle}>
            <button
              type="submit"
              style={{
                ...primaryButtonStyle,
                ...(isDisabled ? buttonDisabledStyle : null),
              }}
              disabled={isDisabled}
              aria-busy={submitting ? "true" : "false"}
            >
              {submitting ? "Attendi..." : "Accedi"}
            </button>

            <button
              type="button"
              style={{
                ...secondaryButtonStyle,
              }}
              onClick={() => navigate("/register")}
            >
              Registrati
            </button>
          </div>
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
  maxWidth: "520px",
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

const noticeStyle = {
  margin: "0 0 16px",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.92)",
  lineHeight: 1.5,
  fontSize: "0.94rem",
};

const errorBoxStyle = {
  margin: "0 0 16px",
  padding: "12px 14px",
  borderRadius: "12px",
  background: "rgba(220,38,38,0.12)",
  border: "1px solid rgba(248,113,113,0.35)",
  color: "#fecaca",
  lineHeight: 1.5,
  fontSize: "0.94rem",
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

const actionsStyle = {
  display: "grid",
  gap: "10px",
};

const primaryButtonStyle = {
  width: "100%",
  backgroundColor: "#e58abb",
  padding: "14px 16px",
  border: "none",
  borderRadius: "12px",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  padding: "14px 16px",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
};

const buttonDisabledStyle = {
  opacity: 0.7,
  cursor: "not-allowed",
};
