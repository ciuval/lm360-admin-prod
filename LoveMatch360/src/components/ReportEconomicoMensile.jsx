// ✅ File: src/components/ReportEconomicoMensile.jsx

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { format } from "date-fns";

export default function ReportEconomicoMensile() {
  const [report, setReport] = useState([]);
  const [totale, setTotale] = useState(0);
  const [prezzi, setPrezzi] = useState({});

  useEffect(() => {
    const fetchPrezziStripe = async () => {
      try {
        const response = await fetch("/api/get-prices");
        const result = await response.json();
        const mapping = {};
        result.forEach((p) => {
          mapping[p.id] = p.unit_amount / 100; // da centesimi a euro
        });
        setPrezzi(mapping);
      } catch (err) {
        console.error("Errore caricamento prezzi Stripe:", err);
      }
    };

    fetchPrezziStripe();
  }, []);

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from("abbonamenti")
        .select("stripe_price_id, inizio")
        .eq("status", "attivo");

      if (!error && data) {
        const perMese = {};
        let totaleGenerale = 0;

        data.forEach((a) => {
          const mese = format(new Date(a.inizio), "yyyy-MM");
          const valore = prezzi[a.stripe_price_id] || 0;
          perMese[mese] = (perMese[mese] || 0) + valore;
          totaleGenerale += valore;
        });

        const risultato = Object.entries(perMese).map(([mese, valore]) => ({
          mese,
          valore,
        }));

        setReport(risultato);
        setTotale(totaleGenerale);
      }
    };

    if (Object.keys(prezzi).length > 0) {
      fetchReport();
    }
  }, [prezzi]);

  return (
    <div style={{ marginTop: "2rem", backgroundColor: "#1e1e1e", padding: "1rem", borderRadius: "8px" }}>
      <h3 style={{ color: "#f08fc0" }}>📈 Report Economico Mensile (prezzi Stripe)</h3>
      <table style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr style={{ backgroundColor: "#333" }}>
            <th style={th}>Mese</th>
            <th style={th}>Totale €</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r, i) => (
            <tr key={i}>
              <td style={td}>{r.mese}</td>
              <td style={td}>{r.valore.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ fontWeight: "bold", backgroundColor: "#2c2c2c" }}>
            <td style={td}>Totale complessivo</td>
            <td style={td}>{totale.toFixed(2)} €</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

const th = {
  padding: "0.5rem",
  textAlign: "left",
  color: "#f08fc0",
  borderBottom: "1px solid #555",
};

const td = {
  padding: "0.5rem",
  borderBottom: "1px solid #333",
};
