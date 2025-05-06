// src/app/api/weather/history/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const cityId = Number(url.searchParams.get("cityId") ?? NaN);
  const fromParam = url.searchParams.get("from");
  const toParam = url.searchParams.get("to");

  if (isNaN(cityId)) {
    return NextResponse.json(
      { error: "Missing or invalid cityId" },
      { status: 400 }
    );
  }

  // Preparamos el filtro base
  const where: Prisma.WeatherDataWhereInput = { cityId };

  // Construimos un filtro de timestamp dinámico
  const timestampFilter: Prisma.DateTimeFilter = {};

  if (fromParam) {
    const fromDate = new Date(fromParam);
    if (!isNaN(fromDate.valueOf())) {
      timestampFilter.gte = fromDate;
    }
  }

  if (toParam) {
    const toDate = new Date(toParam);
    if (!isNaN(toDate.valueOf())) {
      // Llevamos al final del día
      toDate.setHours(23, 59, 59, 999);
      timestampFilter.lte = toDate;
    }
  }

  // Si al menos una de las dos propiedades está, lo añadimos a `where`
  if (timestampFilter.gte || timestampFilter.lte) {
    where.timestamp = timestampFilter;
  }

  // Ahora hacemos la consulta con el filtro final
  const data = await prisma.weatherData.findMany({
    where,
    orderBy: { timestamp: "asc" },
  });

  return NextResponse.json(data);
}
