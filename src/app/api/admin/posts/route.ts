// src/app/api/admin/posts/route.ts
// API for managing blog posts (create, read, update, delete)

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET - Fetch all posts (admin view - includes drafts)
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*, blog_categories(name, slug, color)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, posts: data });
  } catch (error: any) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch posts" }, { status: 500 });
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, excerpt, category_id, cover_image, published, meta_title, meta_description } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Calculate read time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title,
        slug,
        content,
        excerpt: excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ""),
        category_id: category_id || null,
        cover_image: cover_image || null,
        published: published || false,
        read_time: readTime,
        meta_title: meta_title || title,
        meta_description: meta_description || excerpt || content.substring(0, 160).replace(/<[^>]*>/g, ""),
        published_at: published ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: error.message || "Failed to create post" }, { status: 500 });
  }
}

// PUT - Update a post
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, content, excerpt, category_id, cover_image, published, meta_title, meta_description } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    // Recalculate read time
    const wordCount = content ? content.split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Build update object
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }
    if (content !== undefined) {
      updateData.content = content;
      updateData.read_time = readTime;
    }
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (category_id !== undefined) updateData.category_id = category_id || null;
    if (cover_image !== undefined) updateData.cover_image = cover_image;
    if (published !== undefined) {
      updateData.published = published;
      if (published) updateData.published_at = new Date().toISOString();
    }
    if (meta_title !== undefined) updateData.meta_title = meta_title;
    if (meta_description !== undefined) updateData.meta_description = meta_description;

    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, post: data });
  } catch (error: any) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: error.message || "Failed to update post" }, { status: 500 });
  }
}

// DELETE - Delete a post
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete post" }, { status: 500 });
  }
}