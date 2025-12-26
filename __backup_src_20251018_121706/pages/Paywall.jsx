/* src/pages/Paywall.jsx
   Premium = libreria guide completa + piano passo‑passo dalla diagnosi + mentori verificati + modelli/checklist + supporto prioritario.
   Checkout: Stripe (/api/checkout-create). Tracciamento soft su Supabase: paywall_view, checkout_started.
*/
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabaseClient";
import { useLoader } from "../hooks/useLoader";

export default function Paywall(){
  const nav = useNavigate();
  const { withAsync } = useLoader();
  const [user,setUser] = useState(null);

  // --- analytics soft (non rompe se la tabella events non esiste) ---
  async function track(name, props = {}) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("events").insert({ user_id: user?.id ?? null, name, props });
    } catch {}
  }

  useEffect(()=>{ (async ()=>{
    const { data:{ user } } = await supabase.auth.getUser();
    setUser(user||null);
    track("paywall_view");
  })(); },[]);

  const startCheckout = async ()=>{
    await withAsync(async ()=>{
      // se non loggato → login
      const { data:{ user } } = await supabase.auth.getUser();
      if(!user){ toast("Accedi per attivare Premium"); nav("/login"); return; }

      try{
        const price = import.meta.env.VITE_PRICE_ID || ""; // opzionale override via env
        const body = new URLSearchParams({ userId:user.id, email:user.email || "" });
        if(price) body.set("price", price);

        track("checkout_started", { price: price || "default" });

        const res = await fetch("/api/checkout-create",{
          method:"POST",
          headers:{ "Content-Type":"application/x-www-form-urlencoded" },
          body
        });
        const j = await res.json();
        if(!res.ok || !j?.url){ throw new Error(j?.error || "Errore checkout"); }
        window.location.href = j.url;
      }catch(e){
        toast.error(e.message || "Checkout non riuscito");
      }
    });
  };

  return (
    <section className="lm-page" aria-labelledby="premium-title" style={page}>
      <div className="lm-wrap" style={{maxWidth:980, width:"100%"}}>
        <header style={head}>
          <h1 id="premium-title" style={h1}>Premium quando serve davvero</h1>
          <p style={sub}>Percorsi chiari, strumenti pronti, mentori verificati. Zero fuffa: solo passi che puoi misurare.</p>
        </header>

        <div style={grid}>
          {/* FREE vs PREMIUM */}
          <article style={card} aria-labelledby="free-tier">
            <h2 id="free-tier" style={tierTitle}>Free</h2>
            <ul style={list}>
              <li>✅ 1 guida gratuita per iniziare</li>
              <li>✅ Diagnosi base (60s)</li>
              <li>✅ Account personale e salvataggi</li>
            </ul>
            <div style={priceWrap}>
              <div style={priceFree}>0 €</div>
            </div>
            <div style={actions}>
              <Link to="/diagnosi" style={btnGhost} aria-label="Fai la diagnosi">Fai la diagnosi</Link>
            </div>
          </article>

          <article style={{...card, borderColor:"#3b2a35"}} aria-labelledby="pro-tier">
            <div style={badgeBest} aria-label="Piano consigliato">Consigliato</div>
            <h2 id="pro-tier" style={tierTitle}>Premium</h2>
            <ul style={list}>
              <li>✅ Libreria completa di guide (nuove ogni settimana)</li>
              <li>✅ Piano passo‑passo dalla tua diagnosi</li>
              <li>✅ Mentori verificati (richieste/slot)</li>
              <li>✅ Modelli, checklist e calcolatori scaricabili</li>
              <li>✅ Community moderata + supporto prioritario</li>
              <li>✅ Cancelli quando vuoi dal profilo</li>
            </ul>
            <div style={priceWrap}>
              <div style={price}>9,99 €<span style={per}>/mese</span></div>
            </div>
            <div style={actions}>
              <button onClick={startCheckout} className="lm-btn-primary" style={btnPrimary}>Attiva Premium</button>
              {!user && (
                <div className="lm-actions" style={{marginTop:8}}>
                  <span>Non hai un account?</span>{" "}
                  <Link to="/registrati" className="lm-link" style={link}>Registrati</Link>
                </div>
              )}
            </div>
            <p style={tinyMuted}>7 giorni per cambiare idea. Nessuna promessa miracolosa: solo impegno e metodo.</p>
          </article>
        </div>

        {/* FAQ minime accessibili */}
        <section aria-labelledby="faq-title" style={{marginTop:24}}>
          <h2 id="faq-title" style={faqTitle}>Domande frequenti</h2>
          <details style={details}>
            <summary style={summary}>Posso annullare quando voglio?</summary>
            <p style={faqP}>Sì, dal tuo profilo apri il Billing Portal e annulli in autonomia.</p>
          </details>
          <details style={details}>
            <summary style={summary}>Serve essere loggati per acquistare?</summary>
            <p style={faqP}>Sì, così le guide Premium e il piano vengono collegati al tuo account.</p>
          </details>
          <details style={details}>
            <summary style={summary}>Come funziona con i mentori?</summary>
            <p style={faqP}>Con Premium puoi inviare richieste a mentori verificati. Le sessioni possono avere costi aggiuntivi, sempre chiari.</p>
          </details>
        </section>

        <footer style={{marginTop:20, color:"#8C97A6", fontSize:".95rem"}}>
          Hai già Premium?{" "}
          <button className="lm-link" onClick={()=>nav("/profilo")} style={link}>Gestisci abbonamento</button>
          {" · "}
          <Link to="/profilo" className="lm-link" style={link}>Vai al profilo</Link>
        </footer>
      </div>
    </section>
  );
}

/* ---- STILI ---- */
const page = { padding:"2rem 1rem", background:"#0f1115", color:"#E6E8EE", minHeight:"100vh" };
const head = { textAlign:"center", marginBottom:16 };
const h1 = { margin:0, fontSize:"clamp(1.9rem, 4vw, 2.6rem)", color:"#F25F8B" };
const sub = { color:"#A8B3C2", marginTop:8 };

const grid = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",
  gap:16,
  marginTop:16
};
const card = {
  background:"linear-gradient(180deg,#171a1c 0%,#15181a 100%)",
  border:"1px solid rgba(255,255,255,.08)",
  borderRadius:14,
  padding:16,
  position:"relative",
  boxShadow:"0 12px 30px rgba(0,0,0,.35)"
};
const list = { margin:"0 0 10px", paddingLeft:18, color:"#C9D1D9" };

const priceWrap = { display:"flex", alignItems:"baseline", gap:8, margin:"8px 0" };
const price = { fontSize:"2.2rem", fontWeight:900, color:"#ffffff" };
const per = { fontSize:"1rem", opacity:.8, marginLeft:6 };
const priceFree = { fontSize:"1.8rem", fontWeight:800, color:"#C9D1D9" };

const actions = { display:"flex", gap:10, flexWrap:"wrap", marginTop:8 };
const btnPrimary = { background:"#F25F8B", color:"#0f1115", border:"none", padding:"10px 16px", fontWeight:800, borderRadius:10, cursor:"pointer" };
const btnGhost = { background:"transparent", color:"#E6E8EE", border:"1px solid #2A2F3A", padding:"9px 13px", borderRadius:10, textDecoration:"none", fontWeight:600 };
const link = { color:"#7db7ff", textDecoration:"underline", background:"transparent", border:"none", cursor:"pointer" };
const tinyMuted = { color:"#9AA4B2", fontSize:".92rem", marginTop:8 };

const tierTitle = { margin:"0 0 6px", fontSize:"1.15rem", color:"#E6E8EE", fontWeight:800 };
const badgeBest = {
  position:"absolute", top:10, right:10, background:"#F25F8B",
  color:"#0f1115", padding:"4px 8px", borderRadius:999, fontWeight:800, fontSize:".8rem"
};

const faqTitle = { fontSize:"1.15rem", margin:"12px 0 6px", color:"#E6E8EE" };
const details = { background:"#111517", border:"1px solid #2A2F3A", borderRadius:10, padding:"8px 10px", margin:"8px 0" };
const summary = { cursor:"pointer", fontWeight:700, color:"#E6E8EE" };
const faqP = { color:"#C9D1D9", margin:"6px 0 0" };

