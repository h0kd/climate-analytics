"use client";

import { useState, useEffect } from "react";

interface City {
  id: number;
  name: string;
  country: string;
}

interface Props {
  onChange: (city: City) => void;
}

export default function CitySelector({ onChange }: Props) {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cities")
      .then((res) => res.json())
      .then((data: City[]) => {
        setCities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando ciudades…</p>;
  if (cities.length === 0) return <p>No hay ciudades disponibles</p>;

  return (
    <select
      className={`
        w-full
        bg-white dark:bg-gray-800
        text-gray-900 dark:text-gray-100
        border border-gray-300 dark:border-gray-600
        rounded
        px-3 py-2
        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300
      `}
      onChange={(e) => {
        const city = cities.find((c) => c.id === Number(e.target.value));
        if (city) onChange(city);
      }}
      defaultValue=""
    >
      <option value="" disabled>
        Selecciona una ciudad
      </option>
      {cities.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}, {c.country}
        </option>
      ))}
    </select>
  );
}
