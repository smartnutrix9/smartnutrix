"use client";
// src/components/layout/Navbar.tsx

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Leaf } from "lucide-react";

const navLinks = [
  { label: "Nutrition Search", href: "/" },
  { label: "Food Compare",     href: "/compare" },
  {
    label: "Calculators",
    href: "/calculator",
    dropdown: [
      { label: "BMI Calculator",      href: "/calculator/bmi" },
      { label: "BMR Calculator",      href: "/calculator/bmr" },
      { label: "Calorie Calculator",  href: "/calculator/calories" },
      { label: "Water Intake",        href: "/calculator/water" },
      { label: "Protein Intake",      href: "/calculator/protein" },
    ],
  },
  { label: "AI Nutrition",  href: "/ai" },
  { label: "Blog",          href: "/blog" },
  { label: "Shop",          href: "/shop" },
  { label: "Contact",       href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

      {/* Logo */}
      <Link
        href="/"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="flex items-center gap-2 font-bold text-xl text-gray-900"
        >
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <span>Smart<span style={{color: '#0F6E56'}}>Nutrix</span></span>
      </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="px-4 py-2 text-sm text-gray-600 hover:text-brand-600 font-medium rounded-lg hover:bg-brand-50 transition-colors flex items-center gap-1">
                    {link.label}
                    <span className="text-xs">▾</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-card border border-gray-100 py-2 z-50">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-brand-600 font-medium rounded-lg hover:bg-brand-50 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/search" className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-sm py-2 px-4">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <div key={link.label}>
              <Link
                href={link.href}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
              {link.dropdown?.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block pl-6 py-2 text-sm text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="pt-3 border-t border-gray-100 flex gap-3">
            <Link href="/login"  className="flex-1 btn-outline text-sm py-2 text-center justify-center">Sign In</Link>
            <Link href="/signup" className="flex-1 btn-primary text-sm py-2 text-center justify-center">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}