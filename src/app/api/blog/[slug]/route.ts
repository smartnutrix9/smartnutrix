// src/app/api/blog/[slug]/route.ts
// Public API for fetching a single blog post by slug

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*, blog_categories(name, slug, color)")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Increment view count
    await supabaseAdmin
      .from("blog_posts")
      .update({ views: (data.views || 0) + 1 })
      .eq("id", data.id);

    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    console.error("Blog post API error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}