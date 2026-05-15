// src/app/api/admin/categories/route.ts
// API for fetching, creating, and deleting blog categories

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// GET - Fetch all categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("blog_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, categories: data });
  } catch (error: any) {
    console.error("Fetch categories error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch categories" }, { status: 500 });
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const colors = ["#1D9E75", "#2563EB", "#7C3AED", "#EA580C", "#0891B2", "#DC2626", "#059669", "#D97706"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const { data, error } = await supabaseAdmin
      .from("blog_categories")
      .insert({ name: name.trim(), slug, color })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, category: data });
  } catch (error: any) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    // Remove category from posts that use it (set to null)
    await supabaseAdmin
      .from("blog_posts")
      .update({ category_id: null })
      .eq("category_id", id);

    // Delete the category
    const { error } = await supabaseAdmin
      .from("blog_categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 });
  }
}