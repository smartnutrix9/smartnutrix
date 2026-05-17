// src/app/api/shop/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) return NextResponse.json({ success: true, products: [], categories: [], settings: {} });

    // Get shop settings
    const { data: settingsData } = await supabaseAdmin
      .from("site_settings")
      .select("*")
      .in("key", ["shop_enabled", "shop_default_country"]);

    const settings: any = {};
    settingsData?.forEach((item: any) => { settings[item.key] = item.value; });

    // Check if shop is enabled
    if (settings.shop_enabled !== "true") {
      return NextResponse.json({ success: true, enabled: false, settings });
    }

    // Get category filter from query
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Get products
    let query = supabaseAdmin
      .from("shop_products")
      .select("*")
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("sort_order", { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data: products } = await query;

    // Get categories
    const { data: categories } = await supabaseAdmin
      .from("shop_categories")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    return NextResponse.json({
      success: true,
      enabled: true,
      products: products || [],
      categories: categories || [],
      settings,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}