import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: albumId } = await params;

  const formData = await req.formData();
  const file      = formData.get("file")      as File | null;
  const thumbFile = formData.get("thumbnail") as File | null;
  const title     = (formData.get("title") as string | null) || undefined;

  if (!file) return NextResponse.json({ error: "Arquivo obrigatório" }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads", albumId);
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  const src = `/uploads/${albumId}/${filename}`;

  let thumbnail: string | null = null;
  if (thumbFile) {
    const thumbName = `thumb_${Date.now()}.jpg`;
    await writeFile(path.join(dir, thumbName), Buffer.from(await thumbFile.arrayBuffer()));
    thumbnail = `/uploads/${albumId}/${thumbName}`;
  }

  // Create without thumbnail first (avoids Prisma client version mismatch)
  const video = await prisma.video.create({ data: { src, title: title ?? null, albumId } });

  // Update thumbnail via raw SQL (works even before `prisma generate` is re-run)
  if (thumbnail) {
    await prisma.$executeRaw`UPDATE "Video" SET "thumbnail" = ${thumbnail} WHERE "id" = ${video.id}`;
  }

  return NextResponse.json({ ...video, thumbnail }, { status: 201 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: albumId } = await params;
  const { videoId, pinned } = await req.json();
  const video = await prisma.video.update({ where: { id: videoId, albumId }, data: { pinned } });
  return NextResponse.json(video);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: albumId } = await params;
  const { videoId } = await req.json();
  await prisma.video.delete({ where: { id: videoId, albumId } });
  return NextResponse.json({ ok: true });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
