import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ROOM_MIN_SCORE } from "../lib/stanza360.js";
import { track } from "../lib/analytics.js";

export default function Stanza360Page() {
  const { id } = useParams();
  const [state, setState] = useState({ loading:true, allowed:false, compatibility:null, name:"" });

  useEffect(() => {
    let alive = true;
    async function load() {
      const { data:{ user } } = await supabase.auth.getUser();
      if (!user?.id || !id || user.id === id) { if (alive) setState({ loading:false, allowed:false, compatibility:null, name:"" }); return; }
      const pair = [user.id, id].sort();
      const [roomResult, match, profile] = await Promise.all([
        supabase.rpc("get_stanza_compatibility", { target_user_id: id }).maybeSingle(),
        supabase.from("match_scores").select("user_a,user_b,score").eq("user_a",pair[0]).eq("user_b",pair[1]).eq("score",100).maybeSingle(),
        supabase.from("profili").select("nome").eq("id",id).maybeSingle(),
      ]);
      const compatibility = roomResult.data ? {
        ready: Boolean(roomResult.data.both_ready),
        score: roomResult.data.compatibility_score,
        opens: Boolean(roomResult.data.opens),
        sharedQualities: roomResult.data.shared_qualities || [],
      } : null;
      track("room_360_evaluated", {
        score: compatibility?.score ?? -1,
        opens: Boolean(compatibility?.opens),
        reciprocal: Boolean(match.data),
      }).catch(() => {});
      if (alive) setState({ loading:false, allowed:Boolean(match.data)&&Boolean(compatibility?.opens), compatibility, name:profile.data?.nome||"questa persona" });
    }
    load().catch(()=>alive&&setState({ loading:false, allowed:false, compatibility:null, name:"" }));
    return()=>{alive=false;};
  },[id]);

  if (state.loading) return <main style={pageStyle}><p role="status">Controlliamo se la porta può aprirsi…</p></main>;
  if (!state.allowed) return <main style={pageStyle}><section style={roomStyle}><p style={eyebrowStyle}>La porta resta protetta</p><h1 style={titleStyle}>La Stanza non si apre ancora.</h1><p style={textStyle}>Servono entrambe le Stanze complete, almeno {ROOM_MIN_SCORE}% di compatibilità reale e interesse reciproco. Nessun pagamento può aggirare queste condizioni.</p><Link to="/scopri-profili" style={linkStyle}>Torna a Scopri</Link></section></main>;

  return <main style={pageStyle}><section style={roomStyle}><p style={eyebrowStyle}>La porta si è aperta</p><h1 style={titleStyle}>Tu e {state.name}: {state.compatibility.score}%</h1><p style={textStyle}>Non significa perfezione. Significa che avete abbastanza qualità riconosciute per concedervi due parole vere.</p><div style={qualitiesStyle}>{state.compatibility.sharedQualities.map((quality)=><span key={quality} style={qualityStyle}>{quality}</span>)}</div><p style={questionStyle}>Quale di queste qualità vorresti vedere nei piccoli gesti di ogni giorno?</p><Link to={`/chat/${id}`} style={openStyle}>Entra e scambia due parole</Link><p style={freeStyle}>La conversazione nasce dal consenso reciproco ed è gratuita.</p></section></main>;
}

const pageStyle={minHeight:"70vh",display:"grid",placeItems:"center",padding:"2rem 1rem",background:"radial-gradient(circle at center,rgba(240,143,192,.14),transparent 40%),#0b0b0f",color:"#fff"};
const roomStyle={width:"min(720px,100%)",padding:"clamp(1.4rem,5vw,3rem)",borderRadius:30,border:"1px solid rgba(240,143,192,.35)",background:"rgba(20,20,28,.96)",boxShadow:"0 30px 100px rgba(0,0,0,.45)",textAlign:"center"};
const eyebrowStyle={color:"#f3b4d4",fontWeight:900,letterSpacing:2,textTransform:"uppercase",fontSize:12};
const titleStyle={fontSize:"clamp(2rem,6vw,4rem)",lineHeight:1,margin:".8rem 0"};
const textStyle={color:"#d8d8e2",lineHeight:1.7};
const qualitiesStyle={display:"flex",justifyContent:"center",flexWrap:"wrap",gap:8,margin:"1.25rem 0"};
const qualityStyle={padding:"8px 13px",borderRadius:999,background:"rgba(240,143,192,.15)",color:"#ffd6ea",textTransform:"capitalize"};
const questionStyle={padding:"1rem",borderRadius:16,background:"rgba(255,255,255,.05)",lineHeight:1.6};
const openStyle={display:"inline-block",marginTop:8,padding:"14px 20px",borderRadius:14,background:"#f08fc0",color:"#170c13",fontWeight:900,textDecoration:"none"};
const linkStyle={...openStyle,background:"transparent",color:"#ffd6ea",border:"1px solid rgba(240,143,192,.4)"};
const freeStyle={color:"#9cf2bd",fontSize:14};
