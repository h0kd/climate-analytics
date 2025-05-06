import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/weather/fetch-and-store`,
    {
      headers: {},
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { ok: false, status: res.status, message: text },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
