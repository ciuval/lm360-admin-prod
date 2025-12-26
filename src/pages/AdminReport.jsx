import { getJson, setJson } from '../lib/storage';
import React, { useEffect, useState } from 'react';
import '../styles/admin-report.css';
import SparklineDual from '../components/SparklineDual';

function KPI({ title, value, sub }) {
  return (
    <div className="kpi-card" role="group" aria-label={title}>
      <p className="kpi-title">{title}</p>
      <p className="kpi-value">{value}</p>
      {sub ? (
        <p className="muted" style={{ margin: 0 }}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

function DecisionPill({ decision, reason }) {
  let cls = 'pill ';
  if (decision === 'PROMOTE_B') cls += 'pill--green';
  else if (decision === 'PROMOTE_A') cls += 'pill--green';
  else cls += 'pill--yellow';
  const label =
    decision === 'PROMOTE_A' ? 'Promuovi A' : decision === 'PROMOTE_B' ? 'Promuovi B' : 'Hold';
  return (
    <span className={cls} title={reason} aria-label={label}>
      {label}
    </span>
  );
}

export default function AdminReport() {
  const [data, setData] = useState({ loading: true });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/ab-report', { credentials: 'include' });
        const j = await r.json();
        if (!alive) return;
        setData({ loading: false, ...j });
      } catch (e) {
        setData({ loading: false, error: e?.message || 'errore' });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (data.loading)
    return (
      <main className="container">
        <h1 className="h2">A/B Report</h1>
        <p className="muted">CaricoÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦</p>
      </main>
    );
  if (data.error || data.ok === false)
    return (
      <main className="container">
        <h1 className="h2">A/B Report</h1>
        <p className="muted">Errore: {data.error}</p>
      </main>
    );

  const r = data.report7d || {};
  const trend = data.trend14d || [];
  const days = Array.from(new Set(trend.map((x) => x.day_it))).sort();
  const seriesA = days.map((d) => {
    const row = trend.find((x) => x.day_it === d && x.variant === 'A');
    return row ? Number(row.ctr_pct) : null;
  });
  const seriesB = days.map((d) => {
    const row = trend.find((x) => x.day_it === d && x.variant === 'B');
    return row ? Number(row.ctr_pct) : null;
  });

  const aCtr =
    (r.ctr_a_pct ?? null) !== null ? `${Number(r.ctr_a_pct).toFixed(2)}%` : 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“';
  const bCtr =
    (r.ctr_b_pct ?? null) !== null ? `${Number(r.ctr_b_pct).toFixed(2)}%` : 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“';
  const z = (r.z_score ?? null) !== null ? Number(r.z_score).toFixed(3) : 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“';
  const lift =
    (r.lift_b_vs_a_pct ?? null) !== null
      ? `${Number(r.lift_b_vs_a_pct).toFixed(2)}%`
      : 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“';

  return (
    <main className="container admin-wrap">
      <header
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <h1 className="h2" style={{ margin: 0 }}>
          A/B Report Ãƒâ€šÃ‚Â· Hero
        </h1>
        <DecisionPill decision={r.decision} reason={r.decision_reason} />
      </header>

      <section className="kpi-grid" aria-label="Metriche 7 giorni">
        <KPI title="Exposures A" value={r.exposures_a ?? 0} />
        <KPI title="Clicks A" value={r.clicks_a ?? 0} />
        <KPI
          title="CTR A"
          value={aCtr}
          sub={`95% CI: ${r.ctr_a_low95_pct ?? 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“'}% ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${r.ctr_a_high95_pct ?? 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“'}%`}
        />

        <KPI title="Exposures B" value={r.exposures_b ?? 0} />
        <KPI title="Clicks B" value={r.clicks_b ?? 0} />
        <KPI
          title="CTR B"
          value={bCtr}
          sub={`95% CI: ${r.ctr_b_low95_pct ?? 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“'}% ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¢ ${r.ctr_b_high95_pct ?? 'ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Å“'}%`}
        />

        <KPI title="z-score" value={z} />
        <KPI title="Lift B vs A" value={lift} />
      </section>

      <section aria-label="Sparkline CTR (14 giorni)">
        <div className="spark-card">
          <div className="muted small" style={{ marginBottom: 6 }}>
            CTR % Ã¢â‚¬â€ <strong style={{ color: 'var(--abA)' }}>A</strong> vs{' '}
            <strong style={{ color: 'var(--abB)' }}>B</strong>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <SparklineDual
              seriesA={seriesA}
              seriesB={seriesB}
              width={560}
              height={72}
              ariaLabel="Andamento CTR: A (blu) e B (arancio)"
            />
          </div>
        </div>
      </section>
      <section aria-label="Trend 14 giorni">
        <h2 className="h3" style={{ margin: '8px 0' }}>
          Trend 14 giorni
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Variante</th>
                <th>Exposures</th>
                <th>Clicks</th>
                <th>CTR</th>
              </tr>
            </thead>
            <tbody>
              {trend.map((row, i) => (
                <tr key={i}>
                  <td>{row.day_it}</td>
                  <td>{row.variant}</td>
                  <td>{row.exposures}</td>
                  <td>{row.clicks}</td>
                  <td>{Number(row.ctr_pct ?? 0).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted">
          Aggiornato: {new Date(data.generated_at || Date.now()).toLocaleString()}
        </p>
      </section>
    </main>
  );
}
