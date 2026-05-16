// src/app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";

export const metadata: Metadata = {
  title: {
    default: "SmartNutrix – Food Nutrition Facts & Calorie Calculator",
    template: "%s | SmartNutrix",
  },
  description:
    "Search nutrition facts for 900,000+ foods. Calculate calories, macros, BMI, BMR. Compare foods, get AI-powered diet recommendations. Includes Indian food nutrition data.",
  keywords: [
    "nutrition facts",
    "calorie calculator",
    "food nutrition",
    "BMI calculator",
    "Indian food nutrition",
    "diet tracker",
    "macro calculator",
  ],
  authors: [{ name: "SmartNutrix" }],
  creator: "SmartNutrix",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smartnutrix.com",
    siteName: "SmartNutrix",
    title: "SmartNutrix – Food Nutrition Facts & Calorie Calculator",
    description:
      "Search nutrition facts for 900,000+ foods including Indian foods.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartNutrix – Food Nutrition Facts",
    description: "Search nutrition facts for 900,000+ foods.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}