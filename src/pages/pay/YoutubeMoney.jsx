import React from 'react';
import RequirePremium from '../../components/RequirePremium.jsx';

function YoutubeMoneyInner() {
  return (
    <main
      style={{ maxWidth: 900, margin: '8vh auto', padding: '0 24px', display: 'grid', gap: 16 }}
    >
      <h1>Costruire una macchina soldi su YouTube</h1>
      <p className="lead">
        Sistema pratico: ricerca topic → format → script → editing → SEO → monetizzazione (Ads +
        affiliate + prodotti).
      </p>
      <ol style={{ display: 'grid', gap: 12, marginLeft: 18 }}>
        <li>
          <strong>Ricerca domanda</strong>: YouTube Search+Trends, CTR/retention benchmark, 10 idee
          con “reason to click”.
        </li>
        <li>
          <strong>Format</strong>: hook 5s, payoff al min 1, ritmo tagli 1.5–2.5s, mid‑CTA soft.
        </li>
        <li>
          <strong>Script</strong>: outline AIDA, callout visive, B‑roll pack.
        </li>
        <li>
          <strong>SEO</strong>: titolo 60–70, descrizione con 3 keyword, chapters, end screen.
        </li>
        <li>
          <strong>Monetize</strong>: Ads, affiliate kit, mini‑info product, sponsorship sheet.
        </li>
        <li>
          <strong>OPS</strong>: calendario 3/sett, dashboard KPI (CTR, AVD, RPM, L7 views).
        </li>
      </ol>
      <p style={{ opacity: 0.8 }}>
        Template inclusi: brief video, outline script, foglio KPI, deck sponsor (scaricabili a
        breve).
      </p>
    </main>
  );
}

export default function YoutubeMoney() {
  return (
    <RequirePremium>
      <YoutubeMoneyInner />
    </RequirePremium>
  );
}
