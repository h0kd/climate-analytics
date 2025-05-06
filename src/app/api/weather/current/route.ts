// src/app/api/weather/current/route.ts
export const runtime = "nodejs";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { fetchCurrentWeather } from "@/lib/weather";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // 1) Autenticación
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Obtén el objeto completo de usuario
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";

  // 3) Upsert en tu tabla User
  await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email,
    },
  });

  // 4) Parámetro city
  const cityName = req.nextUrl.searchParams.get("city");
  if (!cityName) {
    return NextResponse.json({ error: "Missing ?city=" }, { status: 400 });
  }

  try {
    // 5) Fetch externo
    const weather = await fetchCurrentWeather(cityName);

    // 6) Guarda en BD (ya existe userId en User)
    const cityRecord = await prisma.city.findUnique({
      where: { name: cityName },
    });
    if (cityRecord) {
      await prisma.weatherData.create({
        data: {
          cityId: cityRecord.id,
          userId, // FK válida
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
