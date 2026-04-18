import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [working, setWorking] = useState(true);

  useEffect(() => {
    let alive = true;

    async function run() {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          toast.error("Sessione checkout mancante.");
          navigate("/premium", { replace: true });
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user?.id) {
          toast.error("Utente non autenticato.");
          navigate("/login", { replace: true });
          return;
        }

        const premiumStart = new Date();
        const premiumEnd = new Date();
        premiumEnd.setMonth(premiumEnd.getMonth() + 1);

        const { error: profileError } = await supabase
          .from("profili")
          .upsert(
            {
              id: user.id,
              premium: true,
              ruolo: "premium",
              tipo_abbonamento: "premium_test",
              premium_start: premiumStart.toISOString(),
              premium_fine: premiumEnd.toISOString(),
              status_account: "attivo",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          );

        if (profileError) {
          console.error("Errore aggiornamento profilo premium:", profileError);
          toast.error("Pagamento riuscito, ma stato premium non aggiornato.");
          navigate("/profilo", { replace: true });
          return;
        }

        const { error: subscriptionError } = await supabase
          .from("abbonamenti")
          .upsert(
            {
              user_id: user.id,
              tipo: "premium_test",
              status: "attivo",
              inizio: premiumStart.toISOString(),
              stripe_session_id: sessionId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (subscriptionError) {
          console.error("Errore aggiornamento abbonamento:", subscriptionError);
        }

        if (!alive) return;

        toast.success("🎉 Pagamento completato con successo!");
        navigate("/profilo", { replace: true });
      } catch (error) {
        console.error("CheckoutSuccess error:", error);
        toast.error("Errore nel completamento del checkout.");
        navigate("/premium", { replace: true });
      } finally {
        if (alive) {
          setWorking(false);
        }
      }
    }

    run();

    return () => {
      alive = false;
    };
  }, [navigate, searchParams]);

  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
      <h2 style={{ color: "#f08fc0" }}>✅ Pagamento riuscito</h2>
      <p>
        {working
          ? "Stiamo aggiornando il tuo account premium..."
          : "Reindirizzamento in corso..."}
      </p>
    </div>
  );
}