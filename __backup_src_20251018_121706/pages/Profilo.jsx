import React, { useEffect, useState, useRef } from "react";
import { apiFetch } from "../lib/devApi.js";
import BadgePremium from "../components/BadgePremium.jsx";

export default function Profilo(){
  const [form,setForm] = useState({ display_name:"", bio:"" });
  const [scadenza,setScadenza] = useState(null);
  const [saving,setSaving] = useState(false);
  const timer = useRef(null);

  // load profile + premium
  useEffect(()=>{
    let cancel=false;
    (async ()=>{
      try{
        const p = await apiFetch("/api/profile"); // GET
        const row = p.profile || p.row || p.data || {};
        if(!cancel) setForm(f=>({ ...f, display_name: row.display_name ?? row.name ?? "", bio: row.bio ?? "" }));
      }catch(e){
        const ls = localStorage.getItem("lm360.profile.draft");
        if(ls && !cancel) try{ setForm(JSON.parse(ls)); }catch{}
      }
      try{
        const mp = await apiFetch("/api/my-premium");
        if(!cancel) setScadenza(mp?.row?.scadenza ?? null);
      }catch{}
    })();
    return ()=>{cancel=true; if(timer.current) clearTimeout(timer.current);};
  },[]);

  function scheduleSave(next){
    setForm(next);
    localStorage.setItem("lm360.profile.draft", JSON.stringify(next));
    if(timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async ()=>{
      setSaving(true);
      try{
        await apiFetch("/api/profile", { method:"POST", body: JSON.stringify(next) });
      }catch(e){ console.warn("save failed", e); }
      finally{ setSaving(false); }
    }, 500);
  }

  return (
    <div style={{padding:24, color:"#eee", maxWidth:720, margin:"0 auto"}}>
      <div style={{display:"flex", alignItems:"center", gap:12}}>
        <h1 style={{margin:0}}>Profilo</h1>
        <BadgePremium scadenza={scadenza}/>
      </div>

      <label style={s.label}>Nome pubblico</label>
      <input style={s.input} value={form.display_name} placeholder="Es. Alex"
             onChange={e=>scheduleSave({ ...form, display_name: e.target.value })} aria-label="Nome pubblico"/>

      <label style={s.label}>Bio</label>
      <textarea style={s.textarea} rows={5} value={form.bio}
                onChange={e=>scheduleSave({ ...form, bio: e.target.value })} aria-label="Biografia" />

      <div style={{opacity:.7, marginTop:8}} aria-live="polite">{saving ? "Salvataggio…" : "Salvato"}</div>
    </div>
  );
}

const s = {
  label:{ display:"block", marginTop:16, marginBottom:6, fontWeight:600 },
  input:{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #374151", background:"#0f172a", color:"#e5e7eb" },
  textarea:{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid #374151", background:"#0f172a", color:"#e5e7eb" }
};
