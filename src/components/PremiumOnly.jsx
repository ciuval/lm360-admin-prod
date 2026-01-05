import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function PremiumOnly({ children }) {
  const [isPremium, setIsPremium] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      const { data } = await supabase
        .from("profili")
        .select("ruolo")
        .eq("id", user.id)
        .single();

      setIsPremium(data?.ruolo === "premium");
    };
    check();
  }, []);

  if (isPremium === null) return <p>🔄 Verifica accesso...</p>;
  if (!isPremium) return <p>🚫 Sezione riservata ai Premium.</p>;

  return <>{children}</>;
}


