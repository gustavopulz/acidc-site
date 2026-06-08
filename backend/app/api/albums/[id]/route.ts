import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: { photos: true, videos: true },
  });
  if (!album) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Prisma client may not know about `thumbnail` yet — fetch via raw SQL and merge
  const thumbs = await prisma.$queryRaw<{ id: string; thumbnail: string | null }[]>`
    SELECT "id", "thumbnail" FROM "Video" WHERE "albumId" = ${id}
  `;
  const thumbMap = new Map(thumbs.map((t) => [t.id, t.thumbnail]));

  return NextResponse.json({
    ...album,
    videos: album.videos.map((v) => ({ ...v, thumbnail: thumbMap.get(v.id) ?? null })),
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { title, date, folder } = await req.json();
  const album = await prisma.album.update({ where: { id }, data: { title, date, folder } });
  return NextResponse.json(album);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.album.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
