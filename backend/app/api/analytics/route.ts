import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

function startOf(unit: "day" | "week" | "month") {
  const d = new Date();
  if (unit === "day") { d.setHours(0, 0, 0, 0); }
  else if (unit === "week") { d.setDate(d.getDate() - d.getDay()); d.setHours(0, 0, 0, 0); }
  else { d.setDate(1); d.setHours(0, 0, 0, 0); }
  return d;
}

export async function GET(req: NextRequest) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from") ? new Date(searchParams.get("from")!) : startOf("month");
  const to   = searchParams.get("to")   ? new Date(searchParams.get("to")!)   : new Date();

  const [total, today, thisWeek, thisMonth, visits] = await Promise.all([
    prisma.visit.count(),
    prisma.visit.count({ where: { createdAt: { gte: startOf("day") } } }),
    prisma.visit.count({ where: { createdAt: { gte: startOf("week") } } }),
    prisma.visit.count({ where: { createdAt: { gte: startOf("month") } } }),
    prisma.visit.findMany({
      where: { createdAt: { gte: from, lte: to } },
      select: { createdAt: true, page: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const byDay: Record<string, number> = {};
  const byPage: Record<string, number> = {};
  for (const v of visits) {
    const day = v.createdAt.toISOString().slice(0, 10);
    byDay[day] = (byDay[day] ?? 0) + 1;
    byPage[v.page] = (byPage[v.page] ?? 0) + 1;
  }

  const dailySeries = Object.entries(byDay).map(([date, count]) => ({ date, count }));
  const topPages = Object.entries(byPage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({ page, count }));

  return NextResponse.json({ total, today, thisWeek, thisMonth, dailySeries, topPages });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
