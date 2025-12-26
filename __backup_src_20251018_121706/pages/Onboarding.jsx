import React, { useEffect, useState } from "react";
import BadgePremium from "../components/BadgePremium.jsx";

export default function Onboarding(){
  const [scadenza, setScadenza] = useState(null);

  useEffect(() => {
    const tok = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    const headers = tok ? { Authorization: "Bearer " + tok } : undefined;

    fetch("/api/my-premium", { headers })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(data => {
        const iso = data?.row?.scadenza || null;
        setScadenza(iso);
      })
      .catch(() => { /* silenzioso in dev */ });
  }, []);

  return (
    <div style={{minHeight:"100vh",padding:"24px",color:"#eee",background:"#0b0b0b",fontFamily:"system-ui"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h1 style={{margin:0,fontSize:24}}>Onboarding</h1>
        <BadgePremium scadenza={scadenza} />
      </div>

      <p>Benvenuto/a! Completa i passi per iniziare.</p>
      {/* … resto dell’onboarding */}
    </div>
  );
}
