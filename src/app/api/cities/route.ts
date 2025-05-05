import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const cities = await prisma.city.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(cities);
}
