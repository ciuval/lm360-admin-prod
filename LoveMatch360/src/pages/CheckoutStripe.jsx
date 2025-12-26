// ✅ File: src/pages/CheckoutStripe.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function CheckoutStripe() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Errore nel contatto con il server Stripe.");

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error("Errore durante la creazione della sessione Stripe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2 style={{ color: "#f08fc0" }}>💳 Acquista Premium</h2>
      <p>Accedi a funzionalità avanzate tramite Stripe Checkout.</p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#f08fc0",
          color: "black",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Caricamento..." : "Procedi con Stripe"}
      </button>
    </div>
  );
}
