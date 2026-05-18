// src/app/api/redirect/route.ts
// Smart country-based affiliate redirect

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const usaLink    = searchParams.get("usa")   || "";
  const indiaLink  = searchParams.get("india") || "";

  // Vercel injects this header automatically on all requests
  const country = request.headers.get("x-vercel-ip-country") || "US";

  let destination = "";

  if (country === "IN") {
    // India user → prefer India link, fallback USA, fallback shop
    destination = indiaLink || usaLink || "https://smartnutrix.com/shop";
  } else if (country === "US") {
    // USA user → prefer USA link, fallback shop
    destination = usaLink || "https://smartnutrix.com/shop";
  } else {
    // All other countries → shop page
    destination = "https://smartnutrix.com/shop";
  }

  return NextResponse.redirect(destination);
}
