// src/app/api/admin/auth/route.ts
// Admin authentication - simple password-based login

import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "smartnutrix2025";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      // Create a simple token (in production, use JWT)
      const token = Buffer.from(`admin:${Date.now()}:${ADMIN_PASSWORD}`).toString("base64");

      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// Verify admin token
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const decoded = Buffer.from(token, "base64").toString();
    const parts = decoded.split(":");

    if (parts[0] === "admin" && parts[2] === ADMIN_PASSWORD) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}