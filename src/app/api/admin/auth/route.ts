import { setAdminSession, clearAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

// Rate limiting map (in production, use Redis)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(identifier);

  if (!attempt || now > attempt.resetTime) {
    loginAttempts.set(identifier, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 min window
    return true;
  }

  if (attempt.count >= 5) {
    return false; // Block after 5 attempts
  }

  attempt.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";

    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { username, password, action } = body;

    // Input validation
    if (!username || !password || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof username !== "string" || typeof password !== "string" || typeof action !== "string") {
      return NextResponse.json({ error: "Invalid input format" }, { status: 400 });
    }

    if (action === "logout") {
      await clearAdminSession();
      return NextResponse.json({ success: true });
    }

    // Timing-safe comparison to prevent timing attacks
    const adminUsername = process.env.ADMIN_USERNAME || "";
    const adminPassword = process.env.ADMIN_PASSWORD || "";

    if (!adminUsername || !adminPassword) {
      console.error("Admin credentials not configured in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
      const usernameMatch = timingSafeEqual(
        Buffer.from(username),
        Buffer.from(adminUsername)
      );
      const passwordMatch = timingSafeEqual(
        Buffer.from(password),
        Buffer.from(adminPassword)
      );

      if (usernameMatch && passwordMatch) {
        await setAdminSession();
        return NextResponse.json({ success: true });
      }
    } catch {
      // timingSafeEqual throws if lengths don't match - that's OK
    }

    // Log failed attempt (in production, use proper logging)
    console.warn(`Failed login attempt from IP: ${clientIp}`);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
