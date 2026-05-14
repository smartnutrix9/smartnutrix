// src/components/layout/Footer.tsx
import Link from "next/link";
import { Leaf } from "lucide-react";

const footerLinks = {
  "Nutrition Tools": [
    { label: "Food Search",       href: "/" },
    { label: "Food Comparison",   href: "/compare" },
    { label: "Calorie Counter",   href: "/calculator/calories" },
    { label: "AI Recommendations",href: "/ai" },
  ],
  "Calculators": [
    { label: "BMI Calculator",    href: "/calculator/bmi" },
    { label: "BMR Calculator",    href: "/calculator/bmr" },
    { label: "Water Intake",      href: "/calculator/water" },
    { label: "Protein Intake",    href: "/calculator/protein" },
  ],
  "Indian Foods": [
    { label: "South Indian Foods",href: "/category/south-indian" },
    { label: "North Indian Foods",href: "/category/north-indian" },
    { label: "Dal & Lentils",     href: "/category/dal" },
    { label: "Rice Dishes",       href: "/category/rice" },
  ],
  "Company": [
    { label: "Blog",              href: "/blog" },
    { label: "Shop",              href: "/shop" },
    { label: "About Us",          href: "/about" },
    { label: "Contact Us",        href: "/contact" },
    { label: "Privacy Policy",    href: "/privacy" },
    { label: "Terms of Service",  href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Top section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-3">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-white" />
              </div>
            <span>Smart<span style={{color: '#0F6E56'}}>Nutrix</span></span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your smart companion for food nutrition, calorie tracking, and healthy living.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-brand-600 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SmartNutrix. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 text-center">
            Nutrition data sourced from USDA FoodData Central. For informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}