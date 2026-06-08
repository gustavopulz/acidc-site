import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-change-me");

export async function signToken(payload: { id: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret());
  return payload as { id: string; email: string };
}

export async function getAuthFromRequest(req: NextRequest) {
  const header = req.headers.get("Authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7);
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAuth(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth) return null;
  return auth;
}
