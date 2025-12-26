import { getJson, setJson } from '../lib/storage';
import React from 'react';

/** Sparkline duale (A e B) â€” CTR in % (valori numerici o null) */
export default function SparklineDual({
  seriesA = [],
  seriesB = [],
  width = 560,
  height = 72,
  strokeA = 'var(--abA)',
  strokeB = 'var(--abB)',
  ariaLabel = 'Andamento CTR per 14 giorni',
}) {
  const pad = 4;
  const len = Math.max(seriesA.length, seriesB.length);

  const clean = (arr) => arr.map((v) => (v == null || Number.isNaN(v) ? null : Number(v)));
  const A = clean(seriesA);
  const B = clean(seriesB);

  const allVals = [...A, ...B].filter((v) => v != null);
  const min = allVals.length ? Math.min(...allVals) : 0;
  const max = allVals.length ? Math.max(...allVals) : 1;
  const span = max - min || 1;

  const toX = (i) => pad + i * ((width - 2 * pad) / Math.max(1, len - 1));
  const toY = (v) => height - pad - ((v - min) / span) * (height - 2 * pad);

  const buildPath = (arr) => {
    let d = '',
      started = false;
    for (let i = 0; i < len; i++) {
      const v = arr[i];
      if (v == null) {
        started = false;
        continue;
      }
      const x = toX(i),
        y = toY(v);
      d += (started ? ' L ' : ' M ') + x.toFixed(1) + ' ' + y.toFixed(1);
      started = true;
    }
    return d || 'M 0 0';
  };

  const dA = buildPath(A);
  const dB = buildPath(B);

  const lastIdx = (arr) => {
    for (let i = len - 1; i >= 0; i--) if (arr[i] != null) return i;
    return null;
  };
  const la = lastIdx(A),
    lb = lastIdx(B);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      <g>
        <path
          d={dA}
          fill="none"
          stroke={strokeA}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {la != null && <circle cx={toX(la)} cy={toY(A[la])} r="2.6" fill={strokeA} />}
      </g>
      <g>
        <path
          d={dB}
          fill="none"
          stroke={strokeB}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {lb != null && <circle cx={toX(lb)} cy={toY(B[lb])} r="2.6" fill={strokeB} />}
      </g>
    </svg>
  );
}
