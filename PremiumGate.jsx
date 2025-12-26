// PremiumGate.jsx
import { useEffect, useState } from "react";
const LIMIT = 50;
const PAY = import.meta.env.VITE_PAYMENT_LINK_URL;

export default function PremiumGate({ children }) {
  const [st, setSt] = useState({ loading: true, allow: false, messages: 0 });

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/premium-stats");
        const j = await r.json();
        if (j.ok) setSt({ loading:false, allow: j.is_premium || j.messages <= LIMIT, messages: j.messages });
        else setSt({ loading:false, allow:false, messages:0 });
      } catch { setSt({ loading:false, allow:false, messages:0 }); }
    })();
  }, []);

  if (st.loading) return <div className="muted">Carico…</div>;
  if (st.allow)   return children;

  return (
    <section className="card center">
      <h2>Chat Premium</h2>
      <p>Hai usato {st.messages} messaggi questo mese. Per continuare, passa a Premium.</p>
      <a className="btn" href={PAY} target="_blank" rel="noreferrer">Sblocca Premium</a>
    </section>
  );
}
