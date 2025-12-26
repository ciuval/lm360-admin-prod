import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from "recharts";

const DAYS = 14;

export default function AbTestDashboard() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const since = useMemo(() => new Date(Date.now() - DAYS*24*60*60*1000).toISOString(), []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("ab_events")
        .select("test, variant, event, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) { console.error("ab_events load:", error.message); setRows([]); }
      else setRows(data || []);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [since]);

  const agg = useMemo(() => {
    const map = new Map(); // key: test|variant
    for (const r of rows) {
      const key = `${r.test}|${r.variant}`;
      if (!map.has(key)) map.set(key, { test: r.test, variant: r.variant, exposure:0, click:0, conversion:0 });
      const o = map.get(key);
      if (r.event === "exposure") o.exposure++;
      else if (r.event.startsWith("click")) o.click++;
      else if (r.event === "conversion") o.conversion++;
    }
    const items = Array.from(map.values()).map(o => ({
      ...o,
      ctr: o.exposure ? +(o.click / o.exposure * 100).toFixed(2) : 0,
      conv: o.exposure ? +(o.conversion / o.exposure * 100).toFixed(2) : 0,
    }));
    return {
      hero: items.filter(i => i.test === "hero_v1"),
      paywall: items.filter(i => i.test === "paywall_copy"),
      all: items,
    };
  }, [rows]);

  const Card = ({ title, children }) => (
    <div className="bg-[#1e1e1e] rounded-xl p-6 shadow border border-zinc-800">{children || <div/>}
      <div className="text-sm text-gray-400 mt-2">{title}</div>
    </div>
  );

  return (
    <section className="p-6 max-w-6xl mx-auto text-light">
      <h1 className="text-2xl font-extrabold mb-4">📊 A/B Dashboard (ultimi {DAYS} giorni)</h1>

      {loading ? <p>Caricamento…</p> : (
        <>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <Card title="Hero CTR (%)">
              <TableCompact data={agg.hero} k1="variant" k2="ctr" unit="%" />
            </Card>
            <Card title="Paywall Conversion (%)">
              <TableCompact data={agg.paywall} k1="variant" k2="conv" unit="%" />
            </Card>
            <Card title="Eventi grezzi">
              <div className="text-gray-300 text-sm">
                exposure: {rows.filter(r=>r.event==="exposure").length} ·
                click: {rows.filter(r=>r.event.startsWith("click")).length} ·
                conversion: {rows.filter(r=>r.event==="conversion").length}
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ChartBars title="Hero CTR" data={agg.hero.map(i=>({ name:i.variant, value:i.ctr }))} />
            <ChartBars title="Paywall Conversion" data={agg.paywall.map(i=>({ name:i.variant, value:i.conv }))} />
          </div>
        </>
      )}
    </section>
  );
}

function TableCompact({ data, k1, k2, unit }) {
  return (
    <table className="w-full text-sm">
      <thead><tr className="text-gray-400">
        <th className="text-left font-medium py-1">Variante</th>
        <th className="text-right font-medium py-1">Valore</th>
      </tr></thead>
      <tbody>
        {data.map((r)=>(
          <tr key={r.variant} className="border-t border-zinc-800">
            <td className="py-1">{r[k1]}</td>
            <td className="py-1 text-right">{r[k2]}{unit}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ChartBars({ title, data }) {
  return (
    <div className="bg-[#1e1e1e] rounded-xl p-4 shadow border border-zinc-800">
      <div className="text-sm text-gray-400 mb-2">{title}</div>
      <div style={{width:"100%", height:260}}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis unit="%" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" name="%" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
