import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

const memory = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(req: NextRequest, key = "global") {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const windowMs = env.RATE_LIMIT_WINDOW_SECONDS * 1000;
  const hit = memory.get(id);
  if (!hit || hit.resetAt < now) {
    memory.set(id, { count: 1, resetAt: now + windowMs });
    return null;
  }
  hit.count += 1;
  if (hit.count > env.RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  return null;
}
