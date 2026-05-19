// src/app/api/blog/categories/route.ts
// Returns all blog categories for the public blog listing filter

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from("blog_categories")
      .select("id, name, slug, color")
      .order("name", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, categories: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
