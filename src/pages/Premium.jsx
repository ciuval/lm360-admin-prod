import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { goToPayLink } from "../lib/pay";

export default function Premium() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const qs = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
    const cs = qs.get("cs");
    const isPaid = qs.get("paid") === "1" || qs.get("redirect_status") === "succeeded";
    const run = async () => {
      if (isPaid && cs) {
        setMsg("Pagamento riuscito. Verifico e attivo il Premium…");
        try { await fetch(`/api/stripe-verify?cs=${encodeURIComponent(cs)}`, { method: "GET" }); } catch {}
        let tries = 0;
        const tick = async () => {
          tries++;
          const { data } = await supabase.from("profiles").select("is_premium, plan, tier").single();
          const ok = data && (data.is_premium === true || data.plan === "premium" || data.tier === "premium");
          if (ok) {
            setMsg("Premium attivo! ✨");
            let back = "#/discover";
            try {
              const stored = sessionStorage.getItem("returnAfterPay");
              if (stored) back = stored;
              sessionStorage.removeItem("returnAfterPay");
            } catch {}
            setTimeout(() => (window.location.hash = back), 800);
            return;
          }
          if (tries < 10) setTimeout(tick, 1500);
          else setMsg("Pagamento OK. Se non vedi Premium, ricarica tra un attimo.");
        };
        tick();
      }
    };
    run();
  }, []);

  return (
    <main className="container">
      <h1>Premium</h1>
      <p>Match più veloci, strumenti extra, community moderata.</p>
      <button onClick={goToPayLink} className="btn btn-primary" aria-label="Scopri Premium (9,99€)">
        Scopri Premium (9,99€)
      </button>
      <button onClick={() => (window.location.hash = "#/home")} className="btn" style={{ marginLeft: 12 }}>
        Torna indietro
      </button>
      {msg && <div role="status" aria-live="polite" style={{ marginTop: 16 }}>{msg}</div>}
    </main>
  );
}
