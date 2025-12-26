import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { openPremiumCheckout } from "../../lib/stripe";

export default function Premium() {
  const [checking, setChecking] = useState(false);
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("success") === "1") {
      let stop = false; setChecking(true);
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.id) return setChecking(false);
        for (let i = 0; i < 15 && !stop; i++) {
          const { data } = await supabase.from("profiles")
            .select("is_premium").eq("id", user.id).single();
          if (data?.is_premium) {
            const url = new URL(window.location.href); url.search = "";
            history.replaceState({}, "", url.toString());
            window.location.hash = "/account"; return;
          }
          await new Promise(r => setTimeout(r, 2000));
        }
        setChecking(false);
      })();
      return () => { stop = true; };
    }
  }, []);
  return (
    <main id="main" className="container" aria-live="polite">
      <h1 className="h2">Premium</h1>
      <p>Match più veloci, strumenti extra, community moderata.</p>
      {checking && <p role="status">Verifico l’attivazione…</p>}
      <div className="actions" style={{ display: "flex", gap: "12px" }}>
        <button className="btn btn-primary" onClick={openPremiumCheckout}>
          Scopri Premium (9,99€)
        </button>
        <a className="btn" href="#/home">Torna indietro</a>
      </div>
    </main>
  );
}
