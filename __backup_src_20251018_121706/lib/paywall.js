export async function devFetchToken(){
  try{
    const r = await fetch("/api/dev-get-access-token");
    const j = await r.json();
    return j?.access_token || null;
  }catch(e){ return null; }
}

export async function fetchPremiumCached({ ttlMs = 60_000 } = {}){
  const key = "lm360_premium_cache";
  const now = Date.now();

  try{
    const cached = JSON.parse(localStorage.getItem(key) || "null");
    if (cached && (now - (cached.ts || 0) < ttlMs)) return cached.data;
  }catch{}

  let data = { premium: false, scadenza: null };
  try{
    const token = await devFetchToken();
    const headers = token ? { Authorization: "Bearer " + token } : {};
    const r = await fetch("/api/my-premium", { headers });
    const j = await r.json();
    data = { premium: !!j?.premium, scadenza: j?.row?.scadenza || null };
  }catch{}

  try{ localStorage.setItem(key, JSON.stringify({ ts: now, data })); }catch{}
  return data;
}

export function getMeter(){
  const limit = 3; // letture gratuite/giorno
  const day = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const key = "lm360_meter_" + day;
  let used = 0;
  try{
    used = parseInt(localStorage.getItem(key) || "0", 10);
    if (isNaN(used)) used = 0;
  }catch{}
  function bump(){ try{ localStorage.setItem(key, String(used + 1)); }catch{} }
  const remaining = Math.max(0, limit - used);
  return { limit, used, remaining, bump };
}
