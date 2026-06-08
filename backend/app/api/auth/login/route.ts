import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "email e password obrigatórios" }, { status: 400 });
  }

  const admin = await prisma.admin.findUnique({ where: { email: body.email } });
  if (!admin) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });

  const valid = await bcrypt.compare(body.password, admin.password);
  if (!valid) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });

  const token = await signToken({ id: admin.id, email: admin.email });
  return NextResponse.json({ token, name: admin.name, email: admin.email });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
