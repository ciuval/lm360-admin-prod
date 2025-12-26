const STOP = new Set([
  "di","del","della","delle","dei","a","al","alla","alle","allo","agli",
  "da","dal","dalla","dalle","dai","in","nel","nella","nelle","nei",
  "con","col","sul","sulla","sulle","sui","su","per","tra","fra","e","ed",
  "che","non","più","meno","un","una","uno","le","la","lo","gli","i","il",
  "mi","ti","ci","vi","si","o","ma","come","quando","dove","quale","quali",
  "sono","sei","sia","essere","avere","può","puoi","può","puo","può","fare",
  "anche","solo","molto","sempre","mai","tutto","tutti","tutte","tutta"
]);

function norm(s=""){ return s
  .toLowerCase()
  .normalize("NFD").replace(/\p{Diacritic}/gu,"")
  .replace(/[^a-z0-9\s]/g," ");
}

export function extractTags(text="", max=4) {
  const words = norm(text).split(/\s+/).filter(w => w && !STOP.has(w) && w.length>=4);
  if (!words.length) return [];
  const freq = new Map();
  for (const w of words) freq.set(w, (freq.get(w)||0) + 1);
  const top = [...freq.entries()].sort((a,b)=>b[1]-a[1]).slice(0, max).map(([w])=>w);
  // Capitalizza per chip
  return top.map(w => w.charAt(0).toUpperCase() + w.slice(1));
}
