import { useEffect, useState } from "react";
import { fetchPremiumCached, getMeter } from "../lib/paywall";

export function usePaywall(){
  const [premium, setPremium] = useState(false);
  const [scadenza, setScadenza] = useState(null);
  const [meter, setMeter] = useState(getMeter());

  useEffect(() => {
    let alive = true;
    fetchPremiumCached().then(d => {
      if (!alive) return;
      setPremium(!!d.premium);
      setScadenza(d.scadenza || null);
    });
    const id = setInterval(() => setMeter(getMeter()), 30_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const requireUpgrade = !premium && meter.remaining <= 0;

  function bumpView(){
    if (!premium) {
      const m = getMeter(); m.bump();
      setMeter(getMeter());
    }
  }

  return { premium, scadenza, meter, requireUpgrade, bumpView };
}
