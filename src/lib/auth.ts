import { cookies } from "next/server";
import { randomBytes } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_TIMEOUT = 60 * 60 * 24; // 24 hours in seconds

// In-memory session store (use Redis in production for distributed systems)
const sessionStore = new Map<string, { createdAt: number; expiresAt: number }>();

function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = generateSessionToken();
  const now = Date.now();
  const expiresAt = now + SESSION_TIMEOUT * 1000;

  // Store session in memory (use Redis in production)
  sessionStore.set(sessionToken, {
    createdAt: now,
    expiresAt,
  });

  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TIMEOUT,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  
  if (sessionToken) {
    sessionStore.delete(sessionToken);
  }
  
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionToken) {
    return false;
  }

  const session = sessionStore.get(sessionToken);

  if (!session) {
    return false;
  }

  // Check if session has expired
  if (Date.now() > session.expiresAt) {
    sessionStore.delete(sessionToken);
    await clearAdminSession();
    return false;
  }

  return true;
}
