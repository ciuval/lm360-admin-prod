import React from 'react';
import RequirePremium from '../../components/RequirePremium.jsx';

function AmazonSalesInner() {
  return (
    <main
      style={{ maxWidth: 900, margin: '8vh auto', padding: '0 24px', display: 'grid', gap: 16 }}
    >
      <h1>Migliorare vendite Amazon</h1>
      <p className="lead">
        Checklist operativo: ricerca parole chiave → listing pro → Ads pulite → CRO su scheda.
      </p>
      <ul style={{ display: 'grid', gap: 10 }}>
        <li>
          <strong>Keyword</strong>: Reverse‑ASIN + long tail, 1 pagina “core” + 3 varianti.
        </li>
        <li>
          <strong>Listing</strong>: titolo leggibile, 6 bullet in beneficio, A+ con proof, foto 7/7.
        </li>
        <li>
          <strong>Ads</strong>: SP auto + exact + PAT, negazioni settimanali, target ACOS.
        </li>
        <li>
          <strong>CRO</strong>: price test, coupon, Q&A, gestione review (Early Reviewer‑like).
        </li>
        <li>
          <strong>Analytics</strong>: Search Query Performance, TACOS, L7 unit session %.
        </li>
      </ul>
    </main>
  );
}

export default function AmazonSales() {
  return (
    <RequirePremium>
      <AmazonSalesInner />
    </RequirePremium>
  );
}
