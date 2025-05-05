// src/app/api/weather/history/route.ts
export const runtime = "nodejs";

import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const cityIdParam = req.nextUrl.searchParams.get("cityId");
  if (!cityIdParam) {
    return NextResponse.json({ error: "Missing cityId" }, { status: 400 });
  }
  const cityId = Number(cityIdParam);
  if (isNaN(cityId)) {
    return NextResponse.json({ error: "Invalid cityId" }, { status: 400 });
  }

  const fromParam = req.nextUrl.searchParams.get("from");
  const toParam = req.nextUrl.searchParams.get("to");

  // Base del filtro
  const where: Prisma.WeatherDataWhereInput = { cityId };

  // Construimos un filtro de fechas por separado
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
      timestampFilter.lte = toDate;
    }
  }

  // Sólo asignamos si pusimos al menos una condición
  if (Object.keys(timestampFilter).length > 0) {
    where.timestamp = timestampFilter;
  }

  const data = await prisma.weatherData.findMany({
    where,
    orderBy: { timestamp: "asc" },
  });

  return NextResponse.json(data);
}
