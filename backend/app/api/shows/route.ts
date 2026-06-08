import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const shows = await prisma.show.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json(shows);
}

export async function POST(req: NextRequest) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, city, venue, status, link } = await req.json();
  if (!date || !city || !venue) {
    return NextResponse.json({ error: "date, city e venue são obrigatórios" }, { status: 400 });
  }

  const show = await prisma.show.create({ data: { date, city, venue, status, link } });
  return NextResponse.json(show, { status: 201 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
