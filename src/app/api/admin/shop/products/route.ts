// src/app/api/admin/shop/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { data, error } = await supabaseAdmin
      .from("shop_products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ success: true, products: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await request.json();
    const { title, description, image_url, category, product_type, price_usd, price_inr, amazon_url_usa, amazon_url_india, rating, review_count, featured } = body;

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("shop_products")
      .insert({
        title, description, image_url,
        category: category || "General",
        product_type: product_type || "physical",
        price_usd: price_usd || null,
        price_inr: price_inr || null,
        amazon_url_usa: amazon_url_usa || null,
        amazon_url_india: amazon_url_india || null,
        rating: rating || 0,
        review_count: review_count || 0,
        featured: featured || false,
      })
      .select().single();

    if (error) throw error;
    return NextResponse.json({ success: true, product: data });
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
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("shop_products")
      .update(updateData)
      .eq("id", id)
      .select().single();

    if (error) throw error;
    return NextResponse.json({ success: true, product: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!supabaseAdmin) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Product ID required" }, { status: 400 });

    const { error } = await supabaseAdmin.from("shop_products").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}