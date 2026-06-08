import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Parses "dd/mm/aaaa hh:mm" or "dd/mm/aaaa". Returns end-of-day if no time given.
function parseShowDate(dateStr: string): Date | null {
  const m = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/);
  if (!m) return null;
  const [, d, mo, y, h = "23", mi = "59"] = m;
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi));
}

function withActive(show: { date: string; [key: string]: unknown }) {
  const dt = parseShowDate(show.date);
  return { ...show, active: dt ? dt > new Date() : true };
}

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all") === "true";
  const shows = await prisma.show.findMany({ orderBy: { createdAt: "asc" } });
  const withStatus = shows.map(withActive);
  return NextResponse.json(all ? withStatus : withStatus.filter((s) => s.active));
}

export async function POST(req: NextRequest) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, city, venue, status, link } = await req.json();
  if (!date || !city || !venue) {
    return NextResponse.json({ error: "date, city e venue são obrigatórios" }, { status: 400 });
  }

  const show = await prisma.show.create({ data: { date, city, venue, status, link } });
  return NextResponse.json(withActive(show), { status: 201 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
