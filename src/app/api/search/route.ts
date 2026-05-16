// src/app/api/search/route.ts
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

    if (!results || results.length === 0) {
      return NextResponse.json({
        success: true,
        query,
        count: 0,
        results: [],
        message: "No results found. The nutrition database may be temporarily busy. Please try again in a few minutes."
      });
    }

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({
      success: true,
      query,
      count: 0,
      results: [],
      message: "The nutrition database is temporarily unavailable. Please try again in a few minutes."
    });
  }
}