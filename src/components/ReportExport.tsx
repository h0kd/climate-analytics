// src/components/ReportExport.tsx
"use client";

import { useState } from "react";
import Papa from "papaparse";

interface Record {
  timestamp: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export default function ReportExport({ data }: { data: Record[] }) {
  const [csvUrl, setCsvUrl] = useState<string>("");

  const generateCsv = () => {
    const csv = Papa.unparse(
      data.map((d) => ({
        Fecha: new Date(d.timestamp).toLocaleDateString(),
        Hora: new Date(d.timestamp).toLocaleTimeString(),
        Temperatura: d.temperature,
        Humedad: d.humidity,
        Viento: d.windSpeed,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv" });
    setCsvUrl(URL.createObjectURL(blob));
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={generateCsv}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
      >
        Generar CSV
      </button>
      {csvUrl && (
        <a
          href={csvUrl}
          download="reporte_clima.csv"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Descargar CSV
        </a>
      )}
    </div>
  );
}
