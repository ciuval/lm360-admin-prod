import React from "react";
import { EMAILS } from "../../config/emails";

const TITOLARE = "LoveMatch360";
const SEDE = "— (inserisci sede legale) —";

export default function Privacy() {
  return (
    <section className="lm360-section">
      <h1>Privacy Policy</h1>
      <p><strong>Ultimo aggiornamento:</strong> {new Date().toISOString().slice(0,10)}</p>

      <h2>1) Titolare del trattamento</h2>
      <p>{TITOLARE} – {SEDE}. Contatti: <a href={`mailto:${EMAILS.INFO}`}>{EMAILS.INFO}</a> / <a href={`mailto:${EMAILS.SUPPORT}`}>{EMAILS.SUPPORT}</a>.</p>
      {/* … resto del testo invariato … */}
    </section>
  );
}
