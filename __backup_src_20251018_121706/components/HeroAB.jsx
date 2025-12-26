import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { getAbVariant } from "../lib/abTests";
import { track } from "../lib/analytics";
import { supabase } from "../lib/supabaseClient";

import PremiumBadge from '../components/PremiumBadge';
const copies = {
  A:{h:"Trova chi Ã¨ davvero compatibile (100/100).", s:"Chat solo con match reciproci â€” zero perdite di tempo.", cta:"Inizia ora"},
  B:{h:"Match perfetti, conversazioni reali.", s:"Completa il profilo, sblocca lo score 100 e scrivi subito.", cta:"Crea il profilo"},
  C:{h:"PiÃ¹ affinitÃ , meno swipe.", s:"Algoritmo trasparente, chat solo a compatibilitÃ  100/100.", cta:"Scopri i match"},
  D:{h:"Incontri di qualitÃ , non di quantitÃ .", s:"Profilo al completo â†’ piÃ¹ match reali â†’ piÃ¹ chat.", cta:"Completa il profilo"},
  E:{h:"Premium quando serve davvero.", s:"Filtri pro, boost visibilitÃ  e chat prioritarie.", cta:"Prova Premium"},
};
export default function HeroAB({ userId }){
  const [v,setV]=useState("A");
  const data = copies[v];

  useEffect(()=>{ (async()=>{
    const uid = userId ?? (await supabase.auth.getUser()).data.user?.id ?? null;
    const variant = await getAbVariant(uid, "hero_copy", ["A","B","C","D","E"]);
    setV(variant);
  })(); },[userId]);

  function onCTA(){
    track("paywall_view",{placement:"hero_ab", variant:v}, userId);
    // qui puoi fare navigate al paywall o onboarding
    const el = document.getElementById("cta-primary");
    if(el) el.blur();
  }
  return (
    <Card style={{margin:"1rem auto",maxWidth:900,textAlign:"center"}}>
      <h1 style={{margin:"0 0 .5rem 0"}}>{data.h}</h1>
      <PremiumBadge />
      <p style={{opacity:.85,margin:"0 0 1rem 0"}}>{data.s}</p>
      <Button id="cta-primary" onClick={onCTA}> {data.cta} </Button>
      <div style={{marginTop:8,opacity:.6,fontSize:12}}>Variante: {v}</div>
    </Card>
  );
}

