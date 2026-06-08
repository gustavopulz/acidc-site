import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const all = new URL(req.url).searchParams.get("all") === "true";

  const news = await prisma.news.findMany({
    where: all ? {} : { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverImage: true, published: true, createdAt: true,
    },
  });
  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  if (!await requireAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, slug, content, excerpt, coverImage, published } = await req.json();
  if (!title || !slug || !content) {
    return NextResponse.json({ error: "title, slug e content são obrigatórios" }, { status: 400 });
  }

  const news = await prisma.news.create({
    data: { title, slug, content, excerpt, coverImage, published: published ?? false },
  });
  return NextResponse.json(news, { status: 201 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
