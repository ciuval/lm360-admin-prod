import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../lib/apiBase";
import { setSEO } from "../lib/seo";
import { extractTags } from "../lib/tags";
import { shareLink } from "../lib/share";

function readingTime(text){ const w=(text||"").trim().split(/\s+/).filter(Boolean).length; return Math.max(1, Math.round(w/200)); }
function fmtDate(iso){ try { return new Date(iso).toLocaleDateString("it-IT"); } catch { return ""; } }
function excerpt(t,n=140){ if(!t) return ""; return t.length>n ? t.slice(0,n)+"…" : t; }

export default function Consigli() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => { setSEO("Consigli utili — LoveMatch360", "Consigli pratici e percorsi guidati."); }, []);

  async function load(p=1, append=false) {
    setLoading(true);
    try {
      const url = `${API_BASE}/api/posts-list?status=published&visibility=public&page=${p}&limit=${limit}`;
      const r = await fetch(url); // no credentials per evitare CORS
      if (!r.ok) throw new Error("Errore API");
      const j = await r.json();
      const list = j?.items || [];
      setPageCount(j?.meta?.pageCount || 1);
      setItems(prev => append ? [...prev, ...list] : list);
    } catch (e) {
      setErr(e.message || "Errore di rete");
    } finally {
      setLoading(false);
    }
  }

  // Primo caricamento
  useEffect(() => { load(1,false); setPage(1); }, []);

  // Observer per infinite scroll
  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      const ent = entries[0];
      if (ent.isIntersecting && !loading && page < pageCount) {
        const next = page + 1;
        setPage(next);
        load(next, true);
      }
    }, { rootMargin: "600px 0px 600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loaderRef.current, page, pageCount, loading]);

  // Filtri/ordinamento lato client
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = items.slice(0);
    if (needle) list = list.filter(p => ((p.title||"") + " " + (p.content||"")).toLowerCase().includes(needle));
    list.sort((a,b) => sort==="recent"
      ? (new Date(b.created_at)) - (new Date(a.created_at))
      : (new Date(a.created_at)) - (new Date(b.created_at)));
    return list;
  }, [items, q, sort]);

  return (
    <main style={{padding:"24px",maxWidth:1100,margin:"0 auto"}}>
      <nav style={{fontSize:12,opacity:.7,marginBottom:8}}>
        <Link to="/">Home</Link> · Consigli
      </nav>

      <header style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"center",marginBottom:14}}>
        <h1 style={{fontSize:"clamp(20px,3vw,28px)",margin:"4px 14px 4px 0"}}>Consigli utili</h1>
        <input
          aria-label="Cerca consigli"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Cerca per titolo o testo…"
          style={{flex:"1 1 260px",minWidth:220,padding:"10px 12px",borderRadius:10,border:"1px solid #243043",background:"#0b1220",color:"#e5e7eb"}}
        />
        <select
          aria-label="Ordina"
          value={sort}
          onChange={(e)=>setSort(e.target.value)}
          style={{padding:"10px 12px",borderRadius:10,border:"1px solid #243043",background:"#0b1220",color:"#e5e7eb"}}
        >
          <option value="recent">Più recenti</option>
          <option value="oldest">Più vecchi</option>
        </select>
      </header>

      {err && <p style={{color:"#ef4444"}}>Errore: {err}</p>}

      <section
        aria-label="Elenco consigli"
        style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",gap:14}}
      >
        {filtered.map(p => {
          const rt = readingTime(p.content||"");
          const tags = extractTags(`${p.title||""} ${p.content||""}`, 3);
          const url = `${location.origin}/#/post/${p.id}`;
          return (
            <article key={p.id} style={{border:"1px solid #1f2937",borderRadius:12,background:"#0b1220",padding:14,display:"grid",gap:8}}>
              <Link to={`/post/${p.id}`} style={{textDecoration:"none",color:"#93c5fd",fontWeight:700}}>
                {p.title || "Senza titolo"}
              </Link>
              <div style={{opacity:.6,fontSize:12}}>{fmtDate(p.created_at)} · {rt} min</div>
              <p style={{margin:0,opacity:.9}}>{excerpt(p.content||"", 150)}</p>

              {/* Tag suggeriti */}
              {tags.length>0 && (
                <div role="list" aria-label="Tag suggeriti" style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:2}}>
                  {tags.map(t => (
                    <button
                      key={t}
                      onClick={()=>setQ(t)}
                      aria-label={`Filtra per tag ${t}`}
                      style={{border:"1px solid #1f2937",background:"#0a1322",color:"#cbd5e1",padding:"4px 8px",borderRadius:999,fontSize:12,cursor:"pointer"}}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6,gap:8}}>
                <Link to={`/post/${p.id}`} style={{textDecoration:"none",padding:"8px 10px",borderRadius:8,background:"#111827",color:"#e5e7eb"}}>Leggi</Link>
                <button
                  onClick={()=>shareLink({ title: p.title || "Consiglio", text: excerpt(p.content||"", 120), url })}
                  aria-label={`Condividi ${p.title || "Consiglio"}`}
                  style={{padding:"8px 10px",borderRadius:8,background:"#0f172a",color:"#e5e7eb",border:"1px solid #1f2937",cursor:"pointer"}}
                >
                  Condividi
                </button>
                <span aria-label="tempo di lettura" style={{fontSize:12,opacity:.65}}>{rt} min</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Sentinella per infinite scroll */}
      <div ref={loaderRef} style={{height:1}}></div>

      {/* Stato caricamento / fine lista */}
      <div style={{textAlign:"center",opacity:.7,marginTop:12}}>
        {loading ? "Caricamento…" : (page >= pageCount ? "Fine elenco" : "")}
      </div>
    </main>
  );
}
