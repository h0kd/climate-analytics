"use client";

import { useState, useEffect, useCallback } from "react";
import CitySelector from "@/components/CitySelector";
import CurrentWeather from "@/components/CurrentWeather";
import HistoryChart from "@/components/HistoryChart";
import ReportExport from "@/components/ReportExport";
import ReportPDF from "@/components/ReportPDF";

interface City {
  id: number;
  name: string;
  country: string;
}

interface HistoryRecord {
  timestamp: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export default function Home() {
  const [city, setCity] = useState<City | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [range, setRange] = useState({
    from: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  });
  const [historyData, setHistoryData] = useState<HistoryRecord[]>([]);

  // Memoiza la función de refresco para que no cambie en cada render
  const handleFetch = useCallback(() => {
    setRefresh((r) => r + 1);
  }, []);

  // Carga el histórico cuando cambian city, rango o el contador `refresh`
  useEffect(() => {
    if (!city) return;
    fetch(
      `/api/weather/history?cityId=${city.id}` +
        `&from=${range.from}&to=${range.to}`
    )
      .then((res) => res.json())
      .then((data: HistoryRecord[]) => setHistoryData(data))
      .catch(console.error);
  }, [city, range.from, range.to, refresh]);

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Clima</h1>

      <section>
        <label className="block mb-2 font-medium">Selecciona ciudad:</label>
        <CitySelector onChange={setCity} />
      </section>

      {city && <CurrentWeather city={city} onFetch={handleFetch} />}

      {city && (
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Histórico de los últimos 7 días
          </h2>
          <div className="mb-4 space-x-2">
            <input
              type="date"
              value={range.from}
              onChange={(e) => setRange({ ...range, from: e.target.value })}
              className="border rounded p-1"
            />
            <input
              type="date"
              value={range.to}
              onChange={(e) => setRange({ ...range, to: e.target.value })}
              className="border rounded p-1"
            />
          </div>

          <div className="flex space-x-4 mb-4">
            <ReportExport data={historyData} />
            <ReportPDF data={historyData} />
          </div>

          <HistoryChart
            cityId={city.id}
            from={range.from}
            to={range.to}
            refresh={refresh}
          />
        </section>
      )}
    </main>
  );
}
