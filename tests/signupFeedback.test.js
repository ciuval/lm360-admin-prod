import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MIN_PASSWORD_LENGTH, PASSWORD_HINT, getPasswordFeedback, normalizeSignupError } from "../src/lib/signupFeedback.js";

test("password: testo iniziale coerente con 12, lettere e numeri", () => {
  assert.equal(MIN_PASSWORD_LENGTH, 12);
  assert.deepEqual(getPasswordFeedback(""), { ready: false, message: PASSWORD_HINT });
});
test("password: undici caratteri non bastano", () => {
  const result = getPasswordFeedback("abcdefghij1");
  assert.equal(result.ready, false);
  assert.match(result.message, /1 carattere/);
});
test("password: dodici caratteri con lettera e numero superano il controllo locale", () => {
  assert.equal(getPasswordFeedback("abcdefghijk1").ready, true);
});
test("password: sole lettere richiedono un numero", () => {
  assert.match(getPasswordFeedback("abcdefghijkl").message, /un numero/);
  assert.equal(getPasswordFeedback("abcdefghijkl").ready, false);
});
test("password: soli numeri richiedono una lettera", () => {
  assert.match(getPasswordFeedback("123456789012").message, /una lettera/);
  assert.equal(getPasswordFeedback("123456789012").ready, false);
});
test("password: spazi o simboli soli non superano il controllo", () => {
  for (const value of ["            ", "!!!!!!!!!!!!"]) assert.equal(getPasswordFeedback(value).ready, false);
});
test("password: frasi con spazi e simboli restano accettate", () => {
  assert.equal(getPasswordFeedback("Esempio lungo 1 !").ready, true);
});
test("password: caratteri non BMP non vengono contati due volte", () => {
  assert.equal(getPasswordFeedback("Ab1😀😀😀😀😀").ready, false);
});
test("password: input non testuali non causano eccezioni", () => {
  for (const value of [null, undefined, 123, {}, []]) assert.equal(getPasswordFeedback(value).ready, false);
});
test("password: il feedback non restituisce la password", () => {
  const value = "SegretoFittizio1!";
  assert.equal(JSON.stringify(getPasswordFeedback(value)).includes(value), false);
  assert.deepEqual(Object.keys(getPasswordFeedback(value)).sort(), ["message", "ready"]);
});
test("errori: HTTP 500 con messaggio email non incolpa indirizzo", () => {
  const result = normalizeSignupError({ status: 500, message: "Error sending confirmation email" });
  assert.match(result, /servizio/);
  assert.match(result, /non è necessariamente un errore/);
});
test("errori: restrizione destinatari del servizio non e email non valida", () => {
  assert.match(normalizeSignupError({ code: "email_address_not_authorized" }), /servizio/);
});
test("errori: limiti di frequenza distinti dagli errori di email", () => {
  for (const error of [{status: 429}, {code: "over_email_send_rate_limit"}, {code: "over_request_rate_limit"}]) {
    assert.match(normalizeSignupError(error), /troppi tentativi/);
  }
});
test("errori: iscrizioni sospese non diventano indirizzo errato", () => {
  assert.match(normalizeSignupError({code: "signup_disabled"}), /registrazioni.*sospese/);
});
test("errori: provider email disabilitato identificato", () => {
  assert.match(normalizeSignupError({code: "email_provider_disabled"}), /tramite email non sono disponibili/);
});
test("errori: indirizzo malformato invita a controllare dati", () => {
  assert.match(normalizeSignupError({code: "email_address_invalid"}), /Controlla i dati/);
});
test("errori: password rifiutata rimanda ai requisiti e al servizio", () => {
  assert.match(normalizeSignupError({code: "weak_password"}), /almeno 12 caratteri/);
});
test("errori: password compromessa distinta dalla sola lunghezza", () => {
  assert.match(normalizeSignupError({name: "AuthWeakPasswordError", reasons: ["pwned"]}), /violazioni di dati/);
});
test("errori: account esistente non mostrato in forma esplicita", () => {
  for (const code of ["user_already_exists", "email_exists"]) {
    const result = normalizeSignupError({code});
    assert.match(result, /recupero password/);
    assert.doesNotMatch(result, /già registrat|già esist/);
  }
});
test("errori: messaggi sconosciuti non mostrano contenuti del provider", () => {
  const raw = "address@example.invalid TOKEN_SENTINEL <script>";
  for (const error of [null, undefined, {message: raw}, {code: "new_unknown_code",message:raw}, {status:500,message:raw}]) {
    const result = normalizeSignupError(error);
    assert.doesNotMatch(result, /TOKEN_SENTINEL|example.invalid|<script>/);
  }
});
test("pagina: importa e usa un solo helper per feedback password", () => {
  const source = readFileSync(new URL("../src/pages/RegisterPage.jsx", import.meta.url), "utf8");
  assert.match(source, /import \{ getPasswordFeedback, normalizeSignupError \} from "\.\.\/lib\/signupFeedback\.js"/);
  assert.match(source, /const passwordFeedback = getPasswordFeedback\(password\)/);
  assert.match(source, /const passwordReady = passwordFeedback\.ready/);
  assert.match(source, /\{passwordFeedback\.message\}/);
  assert.doesNotMatch(source, /function normalizeSignupError/);
  assert.doesNotMatch(source, /Almeno 8 caratteri|Ancora \$\{Math\.max/);
});
test("pagina: controlli consenso, eta e doppio invio conservati", () => {
  const source = readFileSync(new URL("../src/pages/RegisterPage.jsx", import.meta.url), "utf8");
  assert.match(source, /passwordReady && acceptedLegal && adultAttested/);
  assert.match(source, /if \(submittingRef\.current\) return/);
  assert.match(source, /autoComplete="new-password"/);
  assert.match(source, /minLength=\{12\}/);
  assert.match(source, /aria-describedby="register-password-help"/);
  assert.match(source, /role="status" aria-live="polite"/);
});
