// src/app/api/weather/current/route.ts
export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import { fetchCurrentWeather } from "@/lib/weather";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  if (!city)
    return NextResponse.json({ error: "Missing ?city=" }, { status: 400 });

  try {
    const w = await fetchCurrentWeather(city);

    // 1) Busca el id de la ciudad en tu tabla City
    const cityRecord = await prisma.city.findUnique({ where: { name: city } });
    if (cityRecord) {
      // 2) Inserta el histórico
      await prisma.weatherData.create({
        data: {
          cityId: cityRecord.id,
          timestamp: new Date(w.timestamp),
          temperature: w.temperature,
          humidity: w.humidity,
          windSpeed: w.windSpeed,
        },
      });
    }

    return NextResponse.json(w);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
