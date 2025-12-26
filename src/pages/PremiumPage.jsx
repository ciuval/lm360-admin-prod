import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function PremiumPage() {
  const [status, setStatus] = useState("Verifica pagamento…");

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const cs = params.get("cs");
      if (!cs) {
        setStatus("Sessione non valida");
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("Devi essere loggato");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_FUNC_BASE}/verify-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cs }),
        }
      );

      setStatus(res.ok ? "🎉 Premium attivo" : "Pagamento non verificato");
    };

    run();
  }, []);

  return (
    <main id="main" className="premium-page">
      <h1>Stato abbonamento</h1>
      <p aria-live="polite">{status}</p>
    </main>
  );
}
