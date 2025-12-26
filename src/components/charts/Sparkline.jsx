import React from 'react';
/** Sparkline minimal: props {points,width,height,stroke,strokeWidth,fill} */
export default function Sparkline({
  points = [],
  width = 220,
  height = 60,
  stroke = 'currentColor',
  strokeWidth = 2,
  fill = 'none',
}) {
  const w = width,
    h = height,
    pad = strokeWidth;
  const min = Math.min(0, ...points);
  const max = Math.max(1, ...points);
  const sx = (i) => (i / Math.max(points.length - 1, 1)) * (w - pad * 2) + pad;
  const sy = (v) => h - ((v - min) / Math.max(max - min, 1)) * (h - pad * 2) - pad;

  const d = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`)
    .join(' ');

  const last = points.length ? points[points.length - 1] : 0;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`trend ${last}`}>
      <path
        d={d || `M ${pad} ${h - pad} L ${w - pad} ${h - pad}`}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.length > 0 && (
        <circle cx={sx(points.length - 1)} cy={sy(last)} r={strokeWidth + 1} fill={stroke} />
      )}
    </svg>
  );
}
