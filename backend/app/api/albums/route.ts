import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const albums = await prisma.album.findMany({
    orderBy: { date: "desc" },
    include: { photos: true, videos: true },
  });

  // Prisma client may not know about `thumbnail` yet — fetch via raw SQL and merge
  const thumbs = await prisma.$queryRaw<{ id: string; thumbnail: string | null }[]>`
    SELECT "id", "thumbnail" FROM "Video"
  `;
  const thumbMap = new Map(thumbs.map((t) => [t.id, t.thumbnail]));

  const result = albums.map((album) => ({
    ...album,
    videos: album.videos.map((v) => ({ ...v, thumbnail: thumbMap.get(v.id) ?? null })),
  }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, date, folder } = await req.json();
  if (!title || !date || !folder) {
    return NextResponse.json({ error: "title, date e folder são obrigatórios" }, { status: 400 });
  }

  const album = await prisma.album.create({ data: { title, date, folder } });
  return NextResponse.json(album, { status: 201 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
