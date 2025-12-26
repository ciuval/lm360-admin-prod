import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { attivaAbbonamento } from "../utils/abbonamenti";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";

export default function AttivaPremium() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAbbonamento = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const res = await attivaAbbonamento(user?.id);

    if (res.error) {
      toast.error("Errore: " + res.error);
    } else {
      toast.success("🎉 Abbonamento attivato!");
      navigate("/profilo");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center", color: "#fff" }}>
      <h2>💎 Attiva Premium</h2>
      <p>Accedi a tutte le funzioni extra di LoveMatch360.</p>
      <button
        onClick={handleAbbonamento}
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "1rem 2rem",
          backgroundColor: "#f08fc0",
          color: "#000",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {loading ? "Attivazione in corso..." : "✨ Attiva Premium"}
      </button>
    </div>
  );
}
