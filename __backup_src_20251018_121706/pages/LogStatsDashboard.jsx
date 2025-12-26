// ✅ File: src/pages/LogStatsDashboard.jsx
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../lib/supabaseClient";

export default function LogStatsDashboard() {
  const [stats, setStats] = useState([]);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("log_attività")
        .select("tipo_azione, created_at");

      if (error) return;

      // Contatori per tipo_azione
      const counterMap = {};
      data.forEach((log) => {
        counterMap[log.tipo_azione] = (counterMap[log.tipo_azione] || 0) + 1;
      });
      const counters = Object.entries(counterMap).map(([tipo, count]) => ({ tipo, count }));
      setStats(counters);

      // Raggruppamento per giorno (grafico timeline)
      const byDate = {};
      data.forEach((log) => {
        const date = new Date(log.created_at).toLocaleDateString();
        byDate[date] = (byDate[date] || 0) + 1;
      });
      const timelineData = Object.entries(byDate).map(([day, count]) => ({ day, count }));
      setTimeline(timelineData);
    };

    fetchStats();
  }, []);

  return (
    <div style={{ padding: "2rem", backgroundColor: "#121212", color: "#fff", fontFamily: "monospace" }}>
      <h2 style={{ color: "#f08fc0" }}>📊 Statistiche Log Attività</h2>

      <h3 style={{ marginTop: "2rem" }}>🔢 Totale per tipo_azione</h3>
      <ul>
        {stats.map((entry) => (
          <li key={entry.tipo}>
            <strong>{entry.tipo}</strong>: {entry.count} azioni
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: "2rem" }}>📈 Attività nel tempo (per giorno)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={timeline}>
          <XAxis dataKey="day" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="count" fill="#f08fc0" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
