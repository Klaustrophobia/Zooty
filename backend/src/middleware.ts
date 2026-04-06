import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const configuredOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [];
const fallbackOrigin = "http://localhost:3001";

function resolveOrigin(origin: string | null) {
  if (!origin) return configuredOrigins[0] ?? fallbackOrigin;
  if (configuredOrigins.length === 0) return origin;
  if (configuredOrigins.includes("*")) return origin;
  if (configuredOrigins.includes(origin)) return origin;
  return configuredOrigins[0] ?? fallbackOrigin;
}

function buildCorsHeaders(req: NextRequest) {
  const headers = new Headers();
  const origin = resolveOrigin(req.headers.get("origin"));
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  headers.set("Access-Control-Allow-Headers", req.headers.get("access-control-request-headers") ?? "Content-Type, Authorization");
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Vary", "Origin");
  return headers;
}

export function middleware(req: NextRequest) {
  const headers = buildCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  const res = NextResponse.next();
  for (const [key, value] of headers.entries()) {
    res.headers.set(key, value);
  }
  return res;
}

export const config = {
  matcher: "/api/:path*",
};