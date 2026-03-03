import { setAdminSession, clearAdminSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password, action } = await request.json();

    if (action === "logout") {
      await clearAdminSession();
      return NextResponse.json({ success: true });
    }

    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      await setAdminSession();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
