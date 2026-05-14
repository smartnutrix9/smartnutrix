// src/app/api/search/route.ts
// Backend API for food search

import { NextRequest, NextResponse } from "next/server";
import { searchFoods } from "@/lib/usda";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!query || query.trim().length < 2) {
    return NextResponse.json(
      { error: "Search query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const results = await searchFoods(query.trim(), Math.min(limit, 20));

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search foods. Please try again." },
      { status: 500 }
    );
  }
}