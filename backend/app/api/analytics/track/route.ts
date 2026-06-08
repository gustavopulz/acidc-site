import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const page = body?.page ?? "/";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null;
  const userAgent = req.headers.get("user-agent") ?? null;

  await prisma.visit.create({ data: { page, ip, userAgent } });
  return NextResponse.json({ ok: true });
}

// Pre-flight for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
