// src/app/api/admin/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

function cleanNbsp(text: string): string {
  return text ? text.replace(/&nbsp;/g, " ") : text;
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*, blog_categories(name, slug, color)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, posts: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const {
      title, content, excerpt, category_id, cover_image, published,
      meta_title, meta_description,
      post_image1, post_image1_usa_url, post_image1_india_url,
      post_image2, post_image2_usa_url, post_image2_india_url,
    } = body;

    if (!title || !content) return NextResponse.json({ error: "Title and content are required" }, { status: 400 });

    const cleanContent = cleanNbsp(content);
    const cleanExcerpt = cleanNbsp(excerpt || "");
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const wordCount = cleanContent.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title, slug,
        content: cleanContent,
        excerpt: cleanExcerpt || cleanContent.substring(0, 160).replace(/<[^>]*>/g, ""),
        category_id: category_id || null,
        cover_image: cover_image || null,
        published: published || false,
        read_time: readTime,
        meta_title: meta_title || title,
        meta_description: meta_description || cleanExcerpt || cleanContent.substring(0, 160).replace(/<[^>]*>/g, ""),
        published_at: published ? new Date().toISOString() : null,
        // Post images
        post_image1: post_image1 || null,
        post_image1_usa_url: post_image1_usa_url || null,
        post_image1_india_url: post_image1_india_url || null,
        post_image2: post_image2 || null,
        post_image2_usa_url: post_image2_usa_url || null,
        post_image2_india_url: post_image2_india_url || null,
      })
      .select().single();

    if (error) throw error;
    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const {
      id, title, content, excerpt, category_id, cover_image, published,
      meta_title, meta_description,
      post_image1, post_image1_usa_url, post_image1_india_url,
      post_image2, post_image2_usa_url, post_image2_india_url,
    } = body;

    if (!id) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    const updateData: any = { updated_at: new Date().toISOString() };

    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    if (content !== undefined) {
      const cleanContent = cleanNbsp(content);
      updateData.content = cleanContent;
      updateData.read_time = Math.max(1, Math.ceil(cleanContent.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
    }
    if (excerpt !== undefined) updateData.excerpt = cleanNbsp(excerpt || "");
    if (category_id !== undefined) updateData.category_id = category_id || null;
    if (cover_image !== undefined) updateData.cover_image = cover_image;
    if (published !== undefined) {
      updateData.published = published;
      if (published) updateData.published_at = new Date().toISOString();
    }
    if (meta_title !== undefined) updateData.meta_title = meta_title;
    if (meta_description !== undefined) updateData.meta_description = meta_description;

    // Post images
    if (post_image1 !== undefined) updateData.post_image1 = post_image1 || null;
    if (post_image1_usa_url !== undefined) updateData.post_image1_usa_url = post_image1_usa_url || null;
    if (post_image1_india_url !== undefined) updateData.post_image1_india_url = post_image1_india_url || null;
    if (post_image2 !== undefined) updateData.post_image2 = post_image2 || null;
    if (post_image2_usa_url !== undefined) updateData.post_image2_usa_url = post_image2_usa_url || null;
    if (post_image2_india_url !== undefined) updateData.post_image2_india_url = post_image2_india_url || null;

    const { data, error } = await supabaseAdmin
      .from("blog_posts").update(updateData).eq("id", id).select().single();

    if (error) throw error;
    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete post" }, { status: 500 });
  }
}
