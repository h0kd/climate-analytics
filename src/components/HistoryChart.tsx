"use client";

import { useState, useEffect } from "react";
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
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoryRecord {
  timestamp: string; // ISO string
  temperature: number;
}

interface Props {
  cityId: number;
  from: string;
  to: string;
  refresh: number;
}

export default function HistoryChart({ cityId, from, to, refresh }: Props) {
  const [data, setData] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    fetch(`/api/weather/history?cityId=${cityId}&from=${from}&to=${to}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error);
  }, [cityId, from, to, refresh]);

  const labels = data.map((d) => new Date(d.timestamp).toLocaleDateString());
  const temps = data.map((d) => d.temperature);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: temps,
        borderColor: "rgb(59, 130, 246)", // blue-500
        backgroundColor: "rgba(59, 130, 246,0.5)",
        pointBackgroundColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: { color: "#E5E7EB" }, // gray-200
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#E5E7EB" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#F9FAFB" }, // gray-50
      },
      title: {
        display: true,
        text: "Histórico de Temperatura",
        color: "#F9FAFB",
      },
    },
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <Line data={chartData} options={options} />
    </div>
  );
}
