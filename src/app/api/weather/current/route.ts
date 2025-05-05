export const runtime = "nodejs";

import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { fetchCurrentWeather } from "@/lib/weather";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // 1) Autenticación
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parámetro ciudad
  const cityName = req.nextUrl.searchParams.get("city");
  if (!cityName) {
    return NextResponse.json({ error: "Missing ?city=" }, { status: 400 });
  }

  try {
    // 3) Fetch externo
    const weather = await fetchCurrentWeather(cityName);

    // 4) Guarda en BD con userId
    const cityRecord = await prisma.city.findUnique({
      where: { name: cityName },
    });
    if (cityRecord) {
      await prisma.weatherData.create({
        data: {
          cityId: cityRecord.id,
          userId: userId,
          timestamp: new Date(weather.timestamp),
          temperature: weather.temperature,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
        },
      });
    }

    return NextResponse.json(weather);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
