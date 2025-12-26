import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiFetch } from "../lib/devApi.js";
import BadgePremium from "../components/BadgePremium.jsx";

export default function Premium(){
  const [row,setRow] = useState(null);
  const [loading,setLoading] = useState(true);
  const { search } = useLocation();
  const status = new URLSearchParams(search).get("status");

  useEffect(() => {
    let cancel=false;
    (async () => {
      try{
        const j = await apiFetch("/api/my-premium");
        if(!cancel) setRow(j.row || null);
      }catch(e){ console.warn(e); }
      finally{ if(!cancel) setLoading(false); }
    })();
    return ()=>{cancel=true};
  },[]);

  return (
    <div style={{padding:"24px",color:"#eee"}}>
      {status==="success" && (
        <div role="status" aria-live="polite" style={banner.ok}>
          Pagamento completato. Stiamo aggiornando il tuo account…
          <Link to="/premium" style={banner.link}> Torna alla pagina Premium</Link>
        </div>
      )}

      <h1>Premium <small style={{fontSize:14,opacity:.8}}>— Demo</small></h1>

      <div style={{margin:"12px 0"}}>
        <BadgePremium scadenza={row?.scadenza}/>
      </div>

      <p>Se vuoi riprovare il flusso di checkout in ambiente di test:</p>
      <p><Link to="/premium-checkout-test" style={s.link}>Vai al checkout test</Link></p>

      {loading && <div style={{opacity:.6}}>Caricamento stato…</div>}
    </div>
  );
}

const s={ link:{ color:"#93c5fd", textDecoration:"underline" } };
const banner = {
  ok:{ background:"#16a34a", color:"#062e0e", padding:"10px 14px", borderRadius:8, marginBottom:12, display:"inline-block" },
  link:{ color:"#062e0e", fontWeight:700, marginLeft:6 }
};
