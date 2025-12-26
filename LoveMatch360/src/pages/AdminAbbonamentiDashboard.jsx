// ✅ File: src/pages/AdminAbbonamentiDashboard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { format, parseISO } from "date-fns";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function AdminAbbonamentiDashboard() {
  const [lista, setLista] = useState([]);
  const [grafico, setGrafico] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroStato, setFiltroStato] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroDataDa, setFiltroDataDa] = useState("");
  const [filtroDataA, setFiltroDataA] = useState("");

  useEffect(() => {
    const fetchAbbonamenti = async () => {
      const { data, error } = await supabase
        .from("abbonamenti")
        .select("*, profili(nome, email)")
        .order("inizio", { ascending: false });

      if (!error && data) {
        setLista(data);

        const perMese = {};
        data.forEach((a) => {
          const month = format(new Date(a.inizio), "yyyy-MM");
          perMese[month] = (perMese[month] || 0) + 1;
        });

        const chartData = Object.entries(perMese).map(([month, count]) => ({ month, count }));
        setGrafico(chartData);
      }
    };

    fetchAbbonamenti();
  }, []);

  const esportaCSV = () => {
    const righe = listaFiltrata.map(a => {
      return `"${a.profili?.nome || ''}","${a.tipo}","${a.status}","${a.inizio}","${a.fine || ''}"`;
    });
    const header = "Nome,Tipo,Status,Inizio,Fine";
    const csv = [header, ...righe].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "abbonamenti.csv";
    link.click();
  };

  const listaFiltrata = lista.filter(a => {
    const matchTipo = filtroTipo ? a.tipo === filtroTipo : true;
    const matchStato = filtroStato ? a.status === filtroStato : true;
    const matchNome = filtroNome ? a.profili?.nome?.toLowerCase().includes(filtroNome.toLowerCase()) : true;
    const inizioDate = new Date(a.inizio);
    const matchDataDa = filtroDataDa ? inizioDate >= new Date(filtroDataDa) : true;
    const matchDataA = filtroDataA ? inizioDate <= new Date(filtroDataA) : true;
    return matchTipo && matchStato && matchNome && matchDataDa && matchDataA;
  });

  const tipiUnici = [...new Set(lista.map(a => a.tipo))];
  const statiUnici = [...new Set(lista.map(a => a.status))];

  return (
    <div style={{ padding: "2rem", color: "#fff", fontFamily: "monospace" }}>
      <h2 style={{ color: "#f08fc0" }}>📊 Dashboard Abbonamenti (Admin)</h2>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input type="text" placeholder="🔍 Cerca nome" value={filtroNome} onChange={e => setFiltroNome(e.target.value)} style={selectStyle} />
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={selectStyle}>
          <option value="">Tutti i tipi</option>
          {tipiUnici.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filtroStato} onChange={e => setFiltroStato(e.target.value)} style={selectStyle}>
          <option value="">Tutti gli stati</option>
          {statiUnici.map(s => <option key={s}>{s}</option>)}
        </select>
        <input type="date" value={filtroDataDa} onChange={e => setFiltroDataDa(e.target.value)} style={selectStyle} />
        <input type="date" value={filtroDataA} onChange={e => setFiltroDataA(e.target.value)} style={selectStyle} />
        <button onClick={esportaCSV} style={buttonStyle}>⬇️ Esporta CSV</button>
      </div>

      <h4>📈 Abbonamenti per mese</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={grafico}>
          <XAxis dataKey="month" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip />
          <Bar dataKey="count" fill="#f08fc0" />
        </BarChart>
      </ResponsiveContainer>

      <h4 style={{ marginTop: "2rem" }}>📋 Lista filtrata</h4>
      <table style={{ width: "100%", marginTop: "1rem", backgroundColor: "#1e1e1e", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#333" }}>
            <th style={th}>Nome</th>
            <th style={th}>Tipo</th>
            <th style={th}>Stato</th>
            <th style={th}>Inizio</th>
            <th style={th}>Fine</th>
          </tr>
        </thead>
        <tbody>
          {listaFiltrata.map((a, i) => (
            <tr key={i}>
              <td style={td}>{a.profili?.nome || "-"}</td>
              <td style={td}>{a.tipo}</td>
              <td style={td}>{a.status}</td>
              <td style={td}>{format(new Date(a.inizio), "dd/MM/yyyy")}</td>
              <td style={td}>{a.fine ? format(new Date(a.fine), "dd/MM/yyyy") : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: "0.5rem",
  borderBottom: "1px solid #555",
  textAlign: "left",
  color: "#f08fc0",
};

const td = {
  padding: "0.5rem",
  borderBottom: "1px solid #333",
};

const selectStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  backgroundColor: "#1e1e1e",
  color: "#fff",
  border: "1px solid #555",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  backgroundColor: "#f08fc0",
  color: "black",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer"
};
