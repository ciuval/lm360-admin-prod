import { getJson, setJson } from '../lib/storage';
import { useMemo } from 'react';

/**
 * Converte il trend giornaliero in 2 serie CTR (A/B)
 * rows: [{ day: 'YYYY-MM-DD', variant: 'A'|'B', exposures: number, clicks: number }]
 */
export function useCtrSeries(rows = []) {
  return useMemo(() => {
    const A = [],
      B = [];
    for (const r of rows) {
      const ctr = r.exposures > 0 ? r.clicks / r.exposures : 0;
      if (r.variant === 'A') A.push(ctr);
      else if (r.variant === 'B') B.push(ctr);
    }
    return { seriesA: A, seriesB: B };
  }, [rows]);
}
