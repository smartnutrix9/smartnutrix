// src/app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { slug } = await params;

    // Clean the slug — collapse multiple hyphens into one
    // This fixes old broken URLs like "japanese-diet---secrets" → "japanese-diet-secrets"
    const cleanSlug = slug.replace(/-{2,}/g, "-").replace(/^-|-$/g, "");

    // Try clean slug first
    let { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*, blog_categories(name, slug, color)")
      .eq("slug", cleanSlug)
      .eq("published", true)
      .single();

    // If not found with clean slug, try original slug as fallback
    if (error || !data) {
      const fallback = await supabaseAdmin
        .from("blog_posts")
        .select("*, blog_categories(name, slug, color)")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      data = fallback.data;
      error = fallback.error;
    }

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