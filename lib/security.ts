import { NextResponse } from "next/server";

export function secureJson<T>(body: T, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  return res;
}

export function sanitizeText(value: string) {
  return value.replace(/[<>]/g, "").trim();
}
