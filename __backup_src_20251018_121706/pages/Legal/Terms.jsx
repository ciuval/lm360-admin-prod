import React from "react";
import { EMAILS } from "../../config/emails";

export default function Terms() {
  return (
    <section className="lm360-section">
      <h1>Termini di Servizio</h1>
      <p><strong>Ultimo aggiornamento:</strong> {new Date().toISOString().slice(0,10)}</p>
      {/* … testo … */}
      <h2>7) Contatti</h2>
      <p>Per assistenza: <a href={`mailto:${EMAILS.SUPPORT}`}>{EMAILS.SUPPORT}</a>. Per informazioni: <a href={`mailto:${EMAILS.INFO}`}>{EMAILS.INFO}</a>.</p>
    </section>
  );
}
