import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { track } from "../lib/analytics.js";
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
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const navigate = useNavigate();

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);
  const passwordReady = password.length >= 8;
  const formReady = isEmailValid(normalizedEmail) && passwordReady && acceptedLegal;

  async function handleRegister(event) {
    event.preventDefault();
    setStatusMessage("");

    if (!isEmailValid(normalizedEmail)) {
      const message = "Inserisci un indirizzo email valido.";
      setStatusMessage(message);
      toast.error(message);
      return;
    }

    if (!passwordReady) {
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

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/#/login?verified=1`,
          data: {
            privacy_acknowledged: true,
            terms_accepted: true,
            legal_accepted_at: new Date().toISOString(),
            legal_version: "v1",
            source: "register_page_v2",
          },
        },
      });

      if (error) {
        const message = normalizeSignupError(error);
        setStatusMessage(message);
        toast.error(message);
        return;
      }

      track("registration_submitted", { session: Boolean(data?.session) }).catch(() => {});

      if (data?.session) {
        toast.success("Account creato. Ora costruiamo il tuo profilo.");
        navigate("/profilo", { replace: true });
        return;
      }

      setSubmitted(true);
      setStatusMessage("Account creato. Ora conferma l'indirizzo dalla tua email.");
    } catch {
      const message = "Registrazione non completata. Riprova tra poco.";
      setStatusMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main style={pageStyle}>
        <section style={successCardStyle} aria-labelledby="register-success-title">
          <div aria-hidden="true" style={successMarkStyle}>✓</div>
          <p style={eyebrowStyle}>Il tuo spazio esiste</p>
          <h1 id="register-success-title" style={successTitleStyle}>
            Manca un solo gesto.
          </h1>
          <p style={introStyle}>
            Apri l’email di LoveMatch360 e conferma il tuo indirizzo. Poi tornerai qui
            per dare forma al profilo: nome, bio, interessi e una foto.
          </p>

          <ol style={nextStepsStyle}>
            <li><strong>Conferma l’email</strong><span>Protegge il tuo accesso.</span></li>
            <li><strong>Completa il profilo</strong><span>Aiuta le persone a capirti.</span></li>
            <li><strong>Scopri persone</strong><span>Il primo like parte dal contesto.</span></li>
          </ol>

          <button
            type="button"
            style={primaryButtonStyle}
            onClick={() => navigate("/login")}
          >
            Ho confermato l’email
          </button>
          <button type="button" style={secondaryButtonStyle} onClick={() => navigate("/")}>
            Torna alla Home
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={cardStyle} aria-labelledby="register-title">
        <p style={eyebrowStyle}>Il primo passo · circa un minuto</p>
        <h1 id="register-title" style={titleStyle}>Crea il tuo spazio.</h1>
        <p style={introStyle}>
          Partiamo solo da email e password. Il resto lo costruirai dopo, con calma e
          con parole tue.
        </p>

        <form onSubmit={handleRegister} noValidate style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="register-email" style={labelStyle}>Email</label>
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
              aria-describedby="register-email-help"
              style={inputStyle}
            />
            <small id="register-email-help" style={helpStyle}>
              Serve per confermare l’account. Non viene mostrata nel profilo pubblico.
            </small>
          </div>

          <div style={fieldStyle}>
            <label htmlFor="register-password" style={labelStyle}>Password</label>
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
              aria-describedby="register-password-help"
              style={inputStyle}
            />
            <small
              id="register-password-help"
              style={{ ...helpStyle, color: password ? (passwordReady ? "#9cf2bd" : "#ffd0e5") : helpStyle.color }}
            >
              {password ? (passwordReady ? "Lunghezza pronta." : `Ancora ${8 - password.length} caratteri.`) : "Usa almeno 8 caratteri."}
            </small>
          </div>

          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={acceptedLegal}
              onChange={(event) => setAcceptedLegal(event.target.checked)}
              style={checkboxStyle}
            />
            <span>
              Accetto i <Link to="/terms" style={linkStyle}>Termini</Link> e confermo
              di aver letto la <Link to="/privacy" style={linkStyle}>Privacy</Link>.
            </span>
          </label>

          <p id="register-status" role="status" aria-live="polite" style={statusStyle}>
            {statusMessage}
          </p>

          <button
            type="submit"
            disabled={loading || !formReady}
            aria-busy={loading}
            style={{ ...primaryButtonStyle, ...(loading || !formReady ? disabledButtonStyle : {}) }}
          >
            {loading ? "Sto creando il tuo spazio…" : "Crea il mio spazio"}
          </button>

          <button type="button" onClick={() => navigate("/login")} style={secondaryButtonStyle}>
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
  background:
    "radial-gradient(circle at 18% 16%, rgba(240,143,192,.16), transparent 30%), radial-gradient(circle at 88% 82%, rgba(125,211,252,.12), transparent 30%), #08080d",
};

const cardStyle = {
  width: "min(590px, 100%)",
  border: "1px solid rgba(240,143,192,.3)",
  borderRadius: 28,
  padding: "clamp(24px, 5vw, 38px)",
  background: "linear-gradient(180deg, rgba(25,25,34,.98), rgba(15,15,22,.98))",
  boxShadow: "0 28px 90px rgba(0,0,0,.46)",
};

const successCardStyle = {
  ...cardStyle,
  textAlign: "center",
  border: "1px solid rgba(134,239,172,.34)",
};

const successMarkStyle = {
  width: 64,
  height: 64,
  margin: "0 auto 18px",
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  background: "rgba(134,239,172,.16)",
  border: "1px solid rgba(134,239,172,.38)",
  color: "#9cf2bd",
  fontSize: 30,
  fontWeight: 900,
};

const eyebrowStyle = {
  margin: "0 0 10px",
  color: "#f3b4d4",
  fontSize: ".76rem",
  fontWeight: 900,
  letterSpacing: ".13em",
  textTransform: "uppercase",
};

const titleStyle = {
  margin: 0,
  color: "#fff",
  fontSize: "clamp(2.4rem, 7vw, 4rem)",
  letterSpacing: "-.05em",
  lineHeight: .98,
};

const successTitleStyle = { ...titleStyle, fontSize: "clamp(2.1rem, 6vw, 3.2rem)" };

const introStyle = {
  margin: "16px 0 26px",
  color: "#d7d7e3",
  fontSize: "1rem",
  lineHeight: 1.7,
};

const formStyle = { display: "grid", gap: 18 };
const fieldStyle = { display: "grid", gap: 8, textAlign: "left" };
const labelStyle = { fontWeight: 850, color: "#fff" };

const inputStyle = {
  width: "100%",
  padding: "15px 16px",
  borderRadius: 15,
  border: "1px solid rgba(240,143,192,.48)",
  backgroundColor: "#17171f",
  color: "#fff",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

const helpStyle = { color: "#aaaaba", lineHeight: 1.45 };
const checkboxRowStyle = {
  display: "grid",
  gridTemplateColumns: "22px 1fr",
  gap: 12,
  alignItems: "start",
  color: "#d7d7e3",
  fontSize: ".95rem",
  lineHeight: 1.55,
  textAlign: "left",
};
const checkboxStyle = { width: 18, height: 18, marginTop: 3 };
const linkStyle = { color: "#f08fc0", fontWeight: 800 };
const statusStyle = { minHeight: 24, margin: 0, color: "#ffd4e9", fontWeight: 700, lineHeight: 1.5 };

const primaryButtonStyle = {
  width: "100%",
  minHeight: 52,
  padding: "0 18px",
  background: "linear-gradient(135deg, #ffd6ea, #f08fc0)",
  color: "#170c13",
  border: "none",
  borderRadius: 16,
  fontWeight: 900,
  fontSize: "1rem",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  width: "100%",
  minHeight: 50,
  marginTop: 12,
  padding: "0 18px",
  backgroundColor: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.16)",
  borderRadius: 16,
  fontWeight: 800,
  fontSize: "1rem",
  cursor: "pointer",
};

const disabledButtonStyle = { opacity: .5, cursor: "not-allowed" };

const nextStepsStyle = {
  display: "grid",
  gap: 10,
  margin: "0 0 24px",
  padding: 0,
  listStyle: "none",
  textAlign: "left",
};

nextStepsStyle["& li"] = undefined;
