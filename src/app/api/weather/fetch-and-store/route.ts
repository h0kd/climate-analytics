export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import { fetchCurrentWeather } from "@/lib/weather";
import { NextResponse } from "next/server";

export async function GET() {
  const cities = await prisma.city.findMany();

  for (const city of cities) {
    try {
      const w = await fetchCurrentWeather(city.name);

      await prisma.weatherData.create({
        data: {
          cityId: city.id,
          userId: "system-user", // ← obligatorio ahora
          timestamp: new Date(w.timestamp),
          temperature: w.temperature,
          humidity: w.humidity,
          windSpeed: w.windSpeed,
        },
      });
    } catch (err) {
      console.error(`Error al obtener clima de ${city.name}:`, err);
    }
  }

  return NextResponse.json({ success: true });
}
