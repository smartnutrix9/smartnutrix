// src/app/api/contact/route.ts
// Contact form API - sends email to smartnutrix9@gmail.com

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email to your Gmail
    await resend.emails.send({
      from: "SmartNutrix Contact <onboarding@resend.dev>",
      to: "smartnutrix9@gmail.com",
      replyTo: email,
      subject: `[SmartNutrix Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1D9E75; padding: 20px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 100px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;"><a href="mailto:${email}" style="color: #1D9E75;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Subject:</strong></td>
                <td style="padding: 8px 0; color: #111827; font-size: 14px;">${subject}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
            <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;"><strong>Message:</strong></div>
            <div style="color: #111827; font-size: 14px; line-height: 1.6; background: #f9fafb; padding: 16px; border-radius: 8px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Sent from SmartNutrix Contact Form • You can reply directly to this email to respond to ${name}.
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message received! We'll get back to you within 24-48 hours.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}