/**
 * Local signup feedback, aligned with the last reviewed Auth policy (12 + letters/digits).
 * This is UX validation, not an authorization boundary or a leaked-password check.
 * Never log or return the password or provider's raw error message.
 */
export const MIN_PASSWORD_LENGTH = 12;
export const PASSWORD_HINT = "Usa almeno 12 caratteri, con almeno una lettera (A-Z) e un numero.";

export function getPasswordFeedback(value) {
  const password = typeof value === "string" ? value : "";
  const length = Array.from(password).length;
  const missing = [];
  if (length < MIN_PASSWORD_LENGTH) {
    const count = MIN_PASSWORD_LENGTH - length;
    missing.push(`${count} ${count === 1 ? "carattere" : "caratteri"}`);
  }
  if (!/[a-zA-Z]/.test(password)) missing.push("una lettera (A-Z)");
  if (!/[0-9]/.test(password)) missing.push("un numero");
  return {
    ready: missing.length === 0,
    message: length === 0 ? PASSWORD_HINT : missing.length > 0
      ? `Aggiungi ${missing.join(", ")}.`
      : "Requisiti di base rispettati. La verifica finale avviene alla registrazione.",
  };
}

// Use stable provider codes/status; never display provider messages containing user data.
export function normalizeSignupError(error) {
  const code = typeof error?.code === "string" ? error.code.toLowerCase() : "";
  const status = typeof error?.status === "number" ? error.status : 0;
  const reasons = Array.isArray(error?.reasons) ? error.reasons : [];

  if (status === 429 || code === "over_request_rate_limit" || code === "over_email_send_rate_limit") {
    return "Sono stati fatti troppi tentativi. Attendi prima di riprovare: non premere ripetutamente il pulsante.";
  }
  if (status >= 500 || ["unexpected_failure", "email_address_not_authorized", "hook_timeout", "hook_timeout_after_retry", "request_timeout"].includes(code)) {
    return "Il servizio di registrazione o invio email non è disponibile in questo momento. Riprova più tardi: non è necessariamente un errore nel tuo indirizzo.";
  }
  if (code === "signup_disabled") {
    return "Le nuove registrazioni sono temporaneamente sospese. Riprova più tardi.";
  }
  if (code === "email_provider_disabled") {
    return "L’accesso e la registrazione tramite email non sono disponibili in questo momento.";
  }
  if (code === "email_address_invalid" || code === "validation_failed") {
    return "Controlla i dati inseriti e che l’indirizzo email sia scritto correttamente.";
  }
  if (code === "weak_password" || error?.name === "AuthWeakPasswordError") {
    if (reasons.includes("pwned")) {
      return "Questa password è stata rilevata in violazioni di dati. Scegline una nuova e non riutilizzata su altri siti.";
    }
    return `La password è stata rifiutata. ${PASSWORD_HINT} Evita password comuni o già utilizzate altrove.`;
  }
  if (code === "user_already_exists" || code === "email_exists") {
    return "Non è stato possibile completare la registrazione. Prova ad accedere oppure usa il recupero password.";
  }
  if (code === "captcha_failed") {
    return "La verifica anti-abuso non è riuscita. Ricarica la pagina e riprova.";
  }
  return "Registrazione non completata. Riprova tra poco; se il problema continua, usa il recupero password o contatta l’assistenza.";
}
