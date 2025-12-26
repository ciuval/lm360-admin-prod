import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { goToPayLink } from "../lib/pay";

export default function Premium() {
  const [msg, setMsg] = useState("Controllo stato Premium…");
  const [isPremium, setIsPremium] = useState(false);
  const [ready, setReady] = useState(false);

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const hasReturnMarker = useMemo(() => {
    // se torni da Stripe di solito hai cs o paid=1
    return !!params.get("cs") || params.get("paid") === "1";
  }, [params]);

  useEffect(() => {
    let alive = true;

    (async () => {
      // 1) prova a ristabilire sessione
      await supabase.auth.getSession(); // non stampa nulla, “warm-up”

      const { data: { user } } = await supabase.auth.getUser();

      // 2) se sei tornato da Stripe ma non sei loggato, guida l’utente
      if (!user) {
        if (!alive) return;

        if (hasReturnMarker) {
          // salva destinazione e manda al profilo/login
          try { localStorage.setItem("lm360_after_login", "/premium" + window.location.search); } catch {}
          setMsg("Pagamento ricevuto. Riconnettiti per attivare Premium.");
        } else {
          setMsg("Devi essere loggato per vedere Premium.");
        }

        setReady(true);
        return;
      }

      // 3) leggi stato premium dal DB
      const { data, error } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      if (!alive) return;

      if (error) {
        setMsg("Errore nel controllo Premium. Riprova.");
        setReady(true);
        return;
      }

      const p = !!data?.is_premium;
      setIsPremium(p);
      setMsg(p ? "🎉 Premium attivo." : "Premium non attivo (ancora).");
      setReady(true);
    })();

    return () => { alive = false; };
  }, [hasReturnMarker]);

  const handleLoginRedirect = () => {
    // vai su profilo/login e poi torna a premium
    window.location.assign("/#/profilo");
  };

  return (
    <main id="main" className="section">
      <div className="card card-pad">
        <h1 style={{ margin: 0 }}>Premium</h1>
        <p className="lead" style={{ marginTop: 10 }}>{msg}</p>

        {ready && !isPremium && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn primary" type="button" onClick={goToPayLink}>
              Attiva Premium
            </button>

            <button className="btn" type="button" onClick={handleLoginRedirect}>
              Vai al login
            </button>
          </div>
        )}

        {ready && isPremium && (
          <div className="notice ok" style={{ marginTop: 14 }}>
            Accesso Premium attivo.
          </div>
        )}
      </div>
    </main>
  );
}
