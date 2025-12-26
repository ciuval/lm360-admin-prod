import { getJson, setJson } from '../lib/storage';
// src/pages/Legal/Cookies.jsx
import React from 'react';

const CMP_KEY = 'cmp-consent-v1';

export default function Cookies() {
  const resetConsent = () => {
    try {
      localStorage.removeItem(CMP_KEY);
    } catch {}
    location.reload();
  };

  return (
    <section className="lm360-section">
      <h1>Cookie Policy</h1>
      <p>
        <strong>Ultimo aggiornamento:</strong> {new Date().toISOString().slice(0, 10)}
      </p>

      <h2>1) Cosa sono i cookie</h2>
      <p>I cookie sono piccoli file che permettono al sito di ricordare preferenze e sessioni.</p>

      <h2>2) Quali cookie usiamo</h2>
      <ul>
        <li>
          <strong>Necessari</strong> (sempre attivi): login, sicurezza, impostazioni di base.
        </li>
        <li>
          <strong>Analytics anonimi</strong> (solo con consenso): statistiche aggregate sullâ€™uso
          del sito.
        </li>
      </ul>

      <h2>3) Consenso e gestione</h2>
      <p>
        Puoi accettare o rifiutare gli analytics dal banner in basso. In qualunque momento puoi
        <button className="btn" onClick={resetConsent} style={{ marginLeft: 8 }}>
          Reimpostare il consenso
        </button>
        e scegliere di nuovo.
      </p>

      <h2>4) Come disattivarli dal browser</h2>
      <p>
        Puoi bloccare o cancellare i cookie dalle impostazioni del browser (vedi guide del tuo
        browser).
      </p>
    </section>
  );
}
