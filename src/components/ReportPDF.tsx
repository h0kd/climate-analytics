// src/components/ReportPDF.tsx
"use client";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Record {
  timestamp: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export default function ReportPDF({ data }: { data: Record[] }) {
  const generatePdf = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Clima", 14, 20);

    const rows = data.map((d) => [
      new Date(d.timestamp).toLocaleDateString(),
      new Date(d.timestamp).toLocaleTimeString(),
      d.temperature.toFixed(1),
      d.humidity,
      d.windSpeed.toFixed(1),
    ]);

    // aquí llamamos a la función autoTable(doc, opciones)
    autoTable(doc, {
      head: [["Fecha", "Hora", "Temp (°C)", "Humedad", "Viento (m/s)"]],
      body: rows,
      startY: 30,
    });

    doc.save("reporte_clima.pdf");
  };

  return (
    <button
      onClick={generatePdf}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
    >
      Descargar PDF
    </button>
  );
}
