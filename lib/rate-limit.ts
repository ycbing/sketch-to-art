import { NextRequest, NextResponse } from "next/server";

const windowMs = 60 * 1000;
const maxRequests = 30;

const ipAttempts = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export function rateLimit(request: NextRequest): NextResponse | null {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = ipAttempts.get(ip);

  if (!entry || now > entry.resetTime) {
    ipAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  return null;
}

// Periodic cleanup of stale entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of ipAttempts.entries()) {
      if (now > entry.resetTime) {
        ipAttempts.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}