// src/app/api/site-search/route.ts
// Search blog posts first, then USDA foods
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { searchFoods } from "@/lib/usda";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ success: true, blogs: [], foods: [] });
  }

  const searchQuery = query.trim();

  try {
    // Search blog posts first
    let blogs: any[] = [];
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin
        .from("blog_posts")
        .select("title, slug, excerpt, blog_categories(name, color)")
        .eq("published", true)
        .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
        .limit(5);

      blogs = data || [];
    }

    // Search USDA foods
    let foods: any[] = [];
    try {
      const results = await searchFoods(searchQuery, 5);
      foods = results || [];
    } catch {
      foods = [];
    }

    return NextResponse.json({ success: true, blogs, foods });
  } catch (error: any) {
    console.error("Site search error:", error);
    return NextResponse.json({ success: true, blogs: [], foods: [] });
  }
}