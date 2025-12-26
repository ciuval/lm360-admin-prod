import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const PremiumContext = createContext({ loading: true, premium: false, scadenza: null, row: null });

export function PremiumProvider({ children }) {
  const [state, setState] = useState({ loading: true, premium: false, scadenza: null, row: null });

  useEffect(() => {
    let stop = false;

    async function load() {
      try {
        const tok = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        const headers = tok ? { Authorization: "Bearer " + tok } : {};
        const r = await fetch("/api/my-premium", { headers });
        const j = await r.json();
        if (!stop) {
          setState({
            loading: false,
            premium: !!j?.premium,
            scadenza: j?.row?.scadenza ?? null,
            row: j?.row ?? null,
          });
        }
      } catch {
        if (!stop) setState((s) => ({ ...s, loading: false }));
      }
    }

    load();
    const id = setInterval(load, 60_000);  // in dev aggiorna ogni 60s
    return () => { stop = true; clearInterval(id); };
  }, []);

  const value = useMemo(() => state, [state]);
  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export function usePremium() {
  return useContext(PremiumContext);
}
