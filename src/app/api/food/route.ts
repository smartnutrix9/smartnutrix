// src/app/api/food/route.ts
// Backend API for individual food nutrition details

import { NextRequest, NextResponse } from "next/server";
import { getFoodNutrition, calculateHealthScore } from "@/lib/usda";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fdcId = searchParams.get("fdcId");

  if (!fdcId) {
    return NextResponse.json({ error: "fdcId is required" }, { status: 400 });
  }

  try {
    const nutrition = await getFoodNutrition(parseInt(fdcId));

    if (!nutrition) {
      return NextResponse.json({ error: "Food not found" }, { status: 404 });
    }

    const healthScore = calculateHealthScore(nutrition);

    return NextResponse.json({ success: true, nutrition, healthScore });
  } catch (error) {
    console.error("Food API error:", error);
    return NextResponse.json(
      { error: "Failed to load food data" },
      { status: 500 }
    );
  }
}