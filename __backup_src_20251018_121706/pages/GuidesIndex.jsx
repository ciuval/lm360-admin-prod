import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function GuidesIndex() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all | free | premium
  const [sort, setSort] = useState("new");     // new | old
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuth(!!user);
      } catch {}
    })();
  }, []);

  useEffect(() => { load(); }, [filter, sort]);

  async function load() {
    setLoading(true);
    try {
      let qy = supabase
        .from("guides")
        .select("id,titolo,slug,sommario,cover_url,premium_only,created_at")
        .order("created_at", { ascending: (sort === "old") })
        .limit(24);

      if (filter === "free")    qy = qy.eq("premium_only", false);
      if (filter === "premium") qy = qy.eq("premium_only", true);

      const { data, error } = await qy;
      if (error) throw error;
      setRows(data || []);
    } catch (e) {
      console.warn("guides fallback", e?.message);
      // Fallback solo se c’è errore di rete/permessi
      const all = [
        { id:"x1", titolo:"Benvenuto su LM360", slug:"benvenuto-lm360", sommario:"Da dove iniziare per ottenere valore in 24 ore.", cover_url:"https://placehold.co/600x400?text=Benvenuto", premium_only:false, created_at:new Date().toISOString() },
        { id:"x2", titolo:"Diagnosi Rapida", slug:"diagnosi-rapida", sommario:"Questionario in 60s per capire il percorso.", cover_url:"https://placehold.co/600x400?text=Diagnosi", premium_only:false, created_at:new Date().toISOString() },
        { id:"x3", titolo:"Percorsi PRO", slug:"percorsi-pro", sommario:"Template e modelli per accelerare.", cover_url:"https://placehold.co/600x400?text=PRO", premium_only:true,  created_at:new Date().toISOString() },
      ];
      let list = all;
      if (filter === "free")    list = all.filter(x => !x.premium_only);
      if (filter === "premium") list = all.filter(x =>  x.premium_only);
      if (sort === "old") list = [...list].reverse();
      setRows(list);
    } finally { setLoading(false); }
  }

  const filtered = useMemo(() => {
    const term = (q || "").toLowerCase();
    if (!term) return rows;
    return rows.filter(r =>
      (r.titolo || "").toLowerCase().includes(term) ||
      (r.sommario || "").toLowerCase().includes(term)
    );
  }, [q, rows]);

  return (
    <div style={{maxWidth: 980, margin:"0 auto", padding:"1rem"}}>
      <h2 style={{color:"#f08fc0", marginBottom:8}}>Guide</h2>

      {/* Controls */}
      <div style={{display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginBottom:16}}>
        <div role="group" aria-label="Filtra guide" style={{display:"flex", gap:8}}>
          <button onClick={()=>setFilter("all")}     aria-pressed={filter==="all"}     style={segBtn(filter==="all")}>Tutte</button>
          <button onClick={()=>setFilter("free")}    aria-pressed={filter==="free"}    style={segBtn(filter==="free")}>Solo Free</button>
          <button onClick={()=>setFilter("premium")} aria-pressed={filter==="premium"} style={segBtn(filter==="premium")}>Solo Premium</button>
        </div>

        <select aria-label="Ordina" value={sort} onChange={e=>setSort(e.target.value)} style={select}>
          <option value="new">Più recenti</option>
          <option value="old">Meno recenti</option>
        </select>

        <Link to="/diagnosi" style={btnPrimary}>🔎 Diagnosi (60s)</Link>

        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Cerca una guida…"
          style={{...input, minWidth:220}}
          aria-label="Cerca"
        />
      </div>

      {loading && <p style={{opacity:0.8}}>⏳ Caricamento…</p>}

      {/* Grid */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:16}}>
        {filtered.map(g => (
          <Link key={g.id} to={"/guide/" + g.slug} style={card}>
            {g.premium_only && <span style={badge}>Premium</span>}
            <div
              role="img"
              aria-label={g.titolo}
              style={{
                height:140, background:"#222", borderRadius:8, marginBottom:8,
                backgroundImage: g.cover_url ? "url(" + g.cover_url + ")" : "none",
                backgroundSize:"cover", backgroundPosition:"center"
              }}
            />
            <div>
              <div style={{fontWeight:600, marginBottom:4}}>{g.titolo}</div>
              <div style={{opacity:0.7, fontSize:14}}>{g.sommario}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty states */}
      {!loading && filtered.length === 0 && (
        <div style={{opacity:0.8, marginTop:16}}>
          {filter === "premium"
            ? (<p>Nessuna guida Premium visibile. {isAuth
                ? <>Se non hai Premium, <Link style={link} to="/premium">sblocca l’accesso</Link>.</>
                : <>Accedi per vedere se hai accesso, oppure <Link style={link} to="/premium">attiva Premium</Link>.</>}
              </p>)
            : (<p>Nessun risultato per “{q}”.</p>)
          }
        </div>
      )}
    </div>
  );
}

const btnPrimary = {
  background:"#1e88e5", color:"#fff", padding:"0.6rem 1rem",
  borderRadius:8, textDecoration:"none", fontWeight:600
};
const link = { color:"#1e88e5", textDecoration:"underline" };
const input = {
  flex:1, padding:"0.6rem 0.8rem", borderRadius:8, border:"none",
  background:"#1e1e1e", color:"#fff"
};
const select = {
  padding:"0.55rem 0.7rem", borderRadius:8, border:"1px solid #2a2a2a",
  background:"#171717", color:"#fff"
};
const card = {
  display:"block", textDecoration:"none", color:"inherit",
  background:"#171717", border:"1px solid #232323", borderRadius:12,
  padding:12, position:"relative"
};
const badge = {
  position:"absolute", top:10, left:10, background:"#6b21a8",
  color:"#fff", fontSize:12, padding:"2px 6px", borderRadius:6
};
function segBtn(active){ return {
  background: active ? "#2a2a2a" : "#171717",
  color:"#fff", border:"1px solid #2a2a2a", padding:"0.45rem 0.8rem",
  borderRadius:8, cursor:"pointer"
}; }
