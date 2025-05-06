import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { fetchCurrentWeather } from "@/lib/weather";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cities = await prisma.city.findMany();
  for (const city of cities) {
    try {
      const w = await fetchCurrentWeather(city.name);
      await prisma.weatherData.create({
        data: {
          cityId: city.id,
          userId: "system-user",
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
