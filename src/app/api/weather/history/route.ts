export const runtime = "nodejs";

import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  // 1) Autenticación
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parámetro cityId
  const cityIdParam = req.nextUrl.searchParams.get("cityId");
  if (!cityIdParam) {
    return NextResponse.json({ error: "Missing cityId" }, { status: 400 });
  }
  const cityId = Number(cityIdParam);
  if (Number.isNaN(cityId)) {
    return NextResponse.json({ error: "Invalid cityId" }, { status: 400 });
  }

  // 3) Parámetros from/to (ISO dates)
  const fromParam = req.nextUrl.searchParams.get("from");
  const toParam = req.nextUrl.searchParams.get("to");

  // 4) Construye filtro
  const where: Prisma.WeatherDataWhereInput = { userId, cityId };
  const tsFilter: Prisma.DateTimeFilter = {};

  if (fromParam) {
    const d = new Date(fromParam);
    if (!isNaN(d.valueOf())) tsFilter.gte = d;
  }
  if (toParam) {
    const d = new Date(toParam);
    if (!isNaN(d.valueOf())) tsFilter.lte = d;
  }
  if (Object.keys(tsFilter).length > 0) {
    where.timestamp = tsFilter;
  }

  // 5) Consulta a la BD
  const data = await prisma.weatherData.findMany({
    where,
    orderBy: { timestamp: "asc" },
  });

  return NextResponse.json(data);
}
