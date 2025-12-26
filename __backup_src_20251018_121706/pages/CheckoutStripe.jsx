// src/pages/CheckoutStripe.jsx
// Pagina ponte: crea la sessione e redirige a Stripe

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../hooks/useLoader";

export default function CheckoutStripe() {
  const nav = useNavigate();
  const { withAsync } = useLoader();

  useEffect(() => {
    (async () => {
      await withAsync(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast("Accedi per continuare");
          nav("/login");
          return;
        }

        try {
          const price = import.meta.env.VITE_PRICE_ID || "";
          const body = new URLSearchParams({
            userId: user.id,
            email: user.email || "",
          });
          if (price) body.set("price", price);

          const res = await fetch("/api/checkout-create", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body,
          });

          const j = await res.json();
          if (!res.ok || !j?.url) {
            throw new Error(j?.error || "Errore checkout");
          }

          window.location.href = j.url;
        } catch (e) {
          console.error("Checkout error:", e);
          toast.error(e.message || "Checkout non riuscito");
          nav("/premium");
        }
      });
    })();
  }, [nav, withAsync]);

  return (
    <section className="p-8 bg-dark text-light min-h-screen flex items-center justify-center">
      <div className="bg-[#1e1e1e] rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-extrabold mb-3 text-primary flex items-center justify-center gap-2">
          <span role="img" aria-label="credit card">💳</span>
          Reindirizzamento al checkout…
        </h1>
        <p className="text-gray-300">
          Stiamo creando la tua sessione di pagamento sicura.
        </p>
        <p className="text-sm text-gray-500 mt-3">
          Se non succede nulla, torna alla pagina{" "}
          <a href="/#/premium" className="text-primary hover:underline">
            Premium
          </a>.
        </p>
      </div>
    </section>
  );
}
