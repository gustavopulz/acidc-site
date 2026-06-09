import { createReadStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import { Readable } from "stream";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const uploadsRoot = path.resolve(process.cwd(), "public", "uploads");

const contentTypes: Record<string, string> = {
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".webp": "image/webp",
};

function resolveUploadPath(segments: string[]) {
  const filePath = path.resolve(uploadsRoot, ...segments);
  if (filePath !== uploadsRoot && !filePath.startsWith(`${uploadsRoot}${path.sep}`)) {
    return null;
  }
  return filePath;
}

function fileStream(filePath: string, start?: number, end?: number) {
  return Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream<Uint8Array>;
}

async function serveUpload(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
  includeBody: boolean
) {
  const { path: segments } = await params;
  const filePath = resolveUploadPath(segments);

  if (!filePath) {
    return NextResponse.json({ error: "Invalid upload path" }, { status: 400 });
  }

  let file;
  try {
    file = await stat(filePath);
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  if (!file.isFile()) {
    return new NextResponse(null, { status: 404 });
  }

  const contentType = contentTypes[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
  const range = req.headers.get("range");
  const commonHeaders = {
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Type": contentType,
  };

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${file.size}` },
      });
    }

    const requestedStart = match[1] ? Number(match[1]) : undefined;
    const requestedEnd = match[2] ? Number(match[2]) : undefined;
    const start = requestedStart ?? Math.max(file.size - (requestedEnd ?? 0), 0);
    const end = requestedStart === undefined
      ? file.size - 1
      : Math.min(requestedEnd ?? file.size - 1, file.size - 1);

    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= file.size) {
      return new NextResponse(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${file.size}` },
      });
    }

    return new NextResponse(includeBody ? fileStream(filePath, start, end) : null, {
      status: 206,
      headers: {
        ...commonHeaders,
        "Content-Length": String(end - start + 1),
        "Content-Range": `bytes ${start}-${end}/${file.size}`,
      },
    });
  }

  return new NextResponse(includeBody ? fileStream(filePath) : null, {
    headers: {
      ...commonHeaders,
      "Content-Length": String(file.size),
    },
  });
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return serveUpload(req, context, true);
}

export async function HEAD(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return serveUpload(req, context, false);
}
