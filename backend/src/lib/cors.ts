import { NextRequest, NextResponse } from "next/server";

const configuredOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean) ?? [];
const fallbackOrigin = "http://localhost:3001";

export function resolveOrigin(origin: string | null) {
  if (!origin) return configuredOrigins[0] ?? fallbackOrigin;
  if (configuredOrigins.length === 0) return origin;
  if (configuredOrigins.includes("*")) return origin;
  if (configuredOrigins.includes(origin)) return origin;
  return configuredOrigins[0] ?? fallbackOrigin;
}

export function applyCorsHeaders(req: NextRequest, res: NextResponse, methods = "GET,POST,PUT,DELETE,OPTIONS") {
  const origin = resolveOrigin(req.headers.get("origin"));
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", methods);
  res.headers.set(
    "Access-Control-Allow-Headers",
    req.headers.get("access-control-request-headers") ?? "Content-Type, Authorization"
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  res.headers.set("Vary", "Origin");
  return res;
}