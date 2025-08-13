// ✅ File: src/pages/CheckoutSuccess.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function CheckoutSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("🎉 Pagamento completato con successo!");
    setTimeout(() => navigate("/profilo"), 3000);
  }, [navigate]);

  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
      <h2 style={{ color: "#f08fc0" }}>✅ Pagamento Riuscito!</h2>
      <p>Stai per essere reindirizzato al tuo profilo...</p>
    </div>
  );
}
