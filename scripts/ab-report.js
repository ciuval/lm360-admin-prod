const fs = require("fs");
const path = process.argv[2] || ".vercel_logs.txt";
const text = fs.readFileSync(path, "utf8");
const lines = text.split(/\r?\n/);

const evts = [];
for (const line of lines){
  const m = line.match(/\{.*"evt":"analytics".*\}/);
  if (m) { try { evts.push(JSON.parse(m[0])); } catch {} }
}

const exps = {};
function push(exp, variant){
  const k = exp+"|"+variant;
  if (!exps[k]) exps[k] = { exp, variant, exposure:0, click:0, open_cta:0, buy:0, paywall_view:0 };
  return exps[k];
}
for (const e of evts){
  if (!e.exp || !e.variant) continue;
  const r = push(e.exp, e.variant);
  if (e.name==="ab_exposure") r.exposure++;
  if (e.name==="ab_click") { r.click++; if (e.where==="open_cta"||e.where==="primary_sticky"||e.where==="secondary_sticky") r.open_cta++; if (e.where==="buy") r.buy++; }
  if (e.name==="paywall_view") r.paywall_view++;
}

const byExp = {};
Object.values(exps).forEach(r => (byExp[r.exp] = byExp[r.exp] || [], byExp[r.exp].push(r)));

function erf(x){const s=x<0?-1:1; x=Math.abs(x); const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911; const t=1/(1+p*x); const y=1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-x*x); return s*y;}
function zTest(c1,n1,c2,n2){ const p1=c1/n1, p2=c2/n2; const p=(c1+c2)/(n1+n2); const se=Math.sqrt(p*(1-p)*(1/n1+1/n2))||1e-9; const z=(p1-p2)/se; const pval=2*(1-erf(Math.abs(z)/Math.SQRT2)); return {z,pval,p1,p2};}
function ci95(p,n){ const se=Math.sqrt((p*(1-p))/Math.max(n,1)); return 1.96*se;}

console.log("=== A/B REPORT ===");
for (const exp of Object.keys(byExp)){
  const rows = byExp[exp];
  if (rows.length<2) { console.log(`\n[${exp}] Dati insufficienti`); continue; }
  const [A,B] = rows;

  let cMetricA, cMetricB, metricName;
  if (exp.includes("sticky_cta")){
    metricName = "CTR sticky (open_cta/exposure)";
    cMetricA = { c:A.open_cta, n:A.exposure }; cMetricB = { c:B.open_cta, n:B.exposure };
  } else if (exp.includes("paywall_timing")){
    metricName = "Open-rate paywall (paywall_view/exposure)";
    cMetricA = { c:A.paywall_view, n:A.exposure }; cMetricB = { c:B.paywall_view, n:B.exposure };
  } else {
    metricName = "CTR click (click/exposure)";
    cMetricA = { c:A.click, n:A.exposure }; cMetricB = { c:B.click, n:B.exposure };
  }

  const z = zTest(cMetricA.c, cMetricA.n, cMetricB.c, cMetricB.n);
  const ciA = ci95(z.p1, cMetricA.n)*100, ciB = ci95(z.p2, cMetricB.n)*100;
  const uplift = (z.p2 - z.p1)*100;
  const winner = (z.pval<0.05) ? (uplift>0 ? B.variant : A.variant) : "nessuno (ancora)";

  function fmt(r){ const p= (r.c/Math.max(r.n,1))*100; return `${r.c}/${r.n} → ${p.toFixed(2)}%`; }

  console.log(`\n[${exp}]  metrica: ${metricName}`);
  console.log(`- ${A.variant}: ${fmt(cMetricA)}  (± ${ciA.toFixed(2)}pp)`);
  console.log(`- ${B.variant}: ${fmt(cMetricB)}  (± ${ciB.toFixed(2)}pp)`);
  console.log(`→ Uplift (B−A): ${uplift.toFixed(2)}pp | z=${z.z.toFixed(2)} | p=${z.pval.toExponential(2)}`);
  console.log(`Winner: ${winner} ${z.pval<0.05 ? '(significativo 95%)' : '(non ancora significativo)'}`);
}
