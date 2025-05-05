"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface City {
  id: number;
  name: string;
  country: string;
}

interface Weather {
  timestamp: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface Props {
  city: City;
  onFetch?: () => void;
}

export default function CurrentWeather({ city, onFetch }: Props) {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!city) return;
    setWeather(null);
    setError(null);

    fetch(`/api/weather/current?city=${encodeURIComponent(city.name)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error fetching weather");
        return data as Weather;
      })
      .then((w) => {
        setWeather(w);
        onFetch?.(); // <-- notificamos al padre que terminó
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      });
  }, [city, onFetch]);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }
  if (!weather) {
    return <p>Cargando clima para {city.name}…</p>;
  }

  const date = new Date(weather.timestamp).toLocaleTimeString();
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 grid grid-cols-[auto,1fr] gap-4 items-center">
        <Image
          src={iconUrl}
          alt={weather.description}
          width={80}
          height={80}
          className="w-20 h-20"
        />
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {city.name}, {city.country}
          </h3>
          <p className="italic text-gray-600 dark:text-gray-300">
            {weather.description}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-medium">
            {weather.temperature.toFixed(1)}°C
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Temperatura
          </p>
        </div>
        <div>
          <p className="text-lg font-medium">{weather.humidity}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Humedad</p>
        </div>
        <div>
          <p className="text-lg font-medium">
            {weather.windSpeed.toFixed(1)} m/s
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Viento</p>
        </div>
      </div>

      <div className="px-6 pb-4">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Última actualización: {date}
        </p>
      </div>
    </div>
  );
}
