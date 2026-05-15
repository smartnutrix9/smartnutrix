// src/app/api/blog/route.ts
// Public API for fetching published blog posts

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("id, title, slug, excerpt, cover_image, read_time, views, published_at, blog_categories(name, slug, color)")
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, posts: data });
  } catch (error: any) {
    console.error("Blog API error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}