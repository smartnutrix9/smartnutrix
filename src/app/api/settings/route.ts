// src/app/api/settings/route.ts
// Public API to read site settings (ai_enabled, etc.)

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin)
      return NextResponse.json({ error: "DB not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      // Fetch a single setting
      const { data, error } = await supabaseAdmin
        .from("site_settings")
        .select("value")
        .eq("key", key)
        .single();
      if (error) return NextResponse.json({ value: null });
      return NextResponse.json({ value: data.value });
    }

    // Fetch all settings
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key, value");
    if (error) throw error;

    const settings: Record<string, string> = {};
    for (const row of data || []) settings[row.key] = row.value;
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin)
      return NextResponse.json({ error: "DB not configured" }, { status: 500 });

    const { key, value } = await request.json();
    if (!key) return NextResponse.json({ error: "Key required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key, value }, { onConflict: "key" });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}
