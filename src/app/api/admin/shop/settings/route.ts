// src/app/api/admin/shop/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("*")
      .in("key", ["shop_enabled", "shop_default_country", "shop_country_mode", "shop_amazon_tag_usa", "shop_amazon_tag_india"]);

    if (error) throw error;

    const settings: any = {};
    data?.forEach((item: any) => { settings[item.key] = item.value; });

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { key, value } = body;

    if (!key) return NextResponse.json({ error: "Key is required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}