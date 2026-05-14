// src/app/api/contact/route.ts
// Contact form API (saves to database, email coming in Phase 2)

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // For now, just log it (we'll add email sending in Phase 2)
    console.log("📧 New Contact Form Submission:");
    console.log(`From: ${name} (${email})`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log("---");

    // TODO Phase 2: Save to database & send email to smartnutrix9@gmail.com
    
    return NextResponse.json({
      success: true,
      message: "Message received! We'll get back to you within 24-48 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}