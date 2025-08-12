import React, { useEffect, useState } from "react";
export default function CmpBanner(){
  const KEY="cmp.analytics";
  const [show,setShow]=useState(false);
  useEffect(()=>{ const v=localStorage.getItem(KEY); if(v===null) setShow(true); },[]);
  if(!show) return null;
  return (
    <div role="dialog" aria-live="polite"
      style={{position:"fixed",inset:"auto 0 0 0",background:"var(--elev)",borderTop:"var(--border)",padding:"12px",display:"flex",gap:8,alignItems:"center",zIndex:100}}>
      <div style={{flex:1}}>Usiamo analytics anonimi per migliorare l’esperienza. Accetti?</div>
      <button onClick={()=>{localStorage.setItem(KEY,"false");setShow(false);}} style={{background:"transparent",color:"var(--txt)",border:"var(--border)",borderRadius:"var(--radius)",padding:"8px 10px"}}>Rifiuta</button>
      <button onClick={()=>{localStorage.setItem(KEY,"true");setShow(false);}} style={{background:"var(--ok)",color:"#121212",border:"none",borderRadius:"var(--radius)",padding:"8px 10px"}}>Accetta</button>
    </div>
  );
}
