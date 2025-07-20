import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { saveAs } from "file-saver";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ActivityLogCSVAndGraph() {
  const [log, setLog] = useState([]);

  useEffect(() => {
    fetchLog();
  }, []);

  const fetchLog = async () => {
    const { data, error } = await supabase
      .from("log_attivita")
      .select("id, tipo, descrizione, data")
      .order("data", { ascending: false })
      .limit(500);

    if (!error && data) setLog(data);
    else console.error("Errore nel fetch dei log:", error);
  };

  const exportCSV = () => {
    const csv = ["id,tipo,descrizione,data"];
    log.forEach((entry) => {
      csv.push(
        `${entry.id},"${entry.tipo}","${entry.descrizione}",${entry.data}`
      );
    });
    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "log_attivita.csv");
  };

  const getWeeklyData = () => {
    const counts = {};
    log.forEach((entry) => {
      const date = new Date(entry.data).toISOString().split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    });
    const labels = Object.keys(counts).sort();
    const values = labels.map((label) => counts[label]);
    return { labels, values };
  };

  const weeklyData = getWeeklyData();

  const data = {
    labels: weeklyData.labels,
    datasets: [
      {
        label: "Attività per Giorno",
        data: weeklyData.values,
        borderColor: "#4ade80",
        backgroundColor: "#22c55e88",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Grafico Attività Settimanale",
      },
    },
  };

  return (
    <div className="p-4 max-w-4xl mx-auto text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Esporta & Statistiche</h2>
        <button
          onClick={exportCSV}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          💾 Esporta CSV
        </button>
      </div>

      <div className="bg-gray-900 p-4 rounded-xl">
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
  const weeklyData = getWeeklyData();

  const data = {
    labels: weeklyData.labels,
    datasets: [
      {
        label: "Log per giorno",
        data: weeklyData.values,
        borderColor: "#f08fc0",
        backgroundColor: "rgba(240, 143, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Andamento Log Attività 📈" },
    },
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📊 Log Attività + CSV</h2>

      <button
        onClick={exportCSV}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-6"
      >
        💾 Esporta CSV
      </button>

      <div className="bg-gray-900 p-4 rounded-xl">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
