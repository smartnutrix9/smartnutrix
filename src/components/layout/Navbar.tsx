"use client";
// src/components/layout/Navbar.tsx

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, Leaf, Loader2, BookOpen, UtensilsCrossed } from "lucide-react";

const navLinks = [
  { label: "Nutrition Search", href: "/" },
  { label: "Food Compare",     href: "/compare" },
  {
    label: "Calculators",
    href: "/calculator",
    dropdown: [
      { label: "BMI Calculator",     href: "/calculator/bmi" },
      { label: "BMR Calculator",     href: "/calculator/bmr" },
      { label: "Calorie Calculator", href: "/calculator/calories" },
      { label: "Water Intake",       href: "/calculator/water" },
      { label: "Protein Intake",     href: "/calculator/protein" },
    ],
  },
  { label: "AI Nutrition", href: "/ai" },
  { label: "Blog",         href: "/blog" },
  { label: "Shop",         href: "/shop" },
  { label: "Contact",      href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [searchResults, setSearchResults] = useState<{ blogs: any[]; foods: any[] }>({ blogs: [], foods: [] });
  const [searching,     setSearching]     = useState(false);
  const [searchTimer,   setSearchTimer]   = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router    = useRouter();

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  function handleSearch(query: string) {
    setSearchQuery(query);
    if (searchTimer) clearTimeout(searchTimer);
    if (query.trim().length < 2) {
      setSearchResults({ blogs: [], foods: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/site-search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) setSearchResults({ blogs: data.blogs, foods: data.foods });
      } catch {
        setSearchResults({ blogs: [], foods: [] });
      } finally {
        setSearching(false);
      }
    }, 300);
    setSearchTimer(timer);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchQuery("");
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  function navigateAndClose(href: string) {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults({ blogs: [], foods: [] });
    router.push(href);
  }

  const hasResults = searchResults.blogs.length > 0 || searchResults.foods.length > 0;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 font-bold text-2xl text-gray-900 flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: "#1D9E75" }}>
              <Leaf className="w-5 h-5" style={{ color: "white" }} />
            </div>
            <span>Smart<span style={{ color: "#0F6E56" }}>Nutrix</span></span>
          </Link>

          {/* ── Desktop navigation ── */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                // Calculators dropdown
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                    {link.label}
                    <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {/* Dropdown panel */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 min-w-[200px]">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block px-4 py-2.5 text-base text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition-colors"
                            onClick={() => setDropdownOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Regular nav link
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* ── Search icon + Search panel ── */}
          <div className="flex items-center gap-2">
            <div ref={searchRef} className="relative">
              <button
                onClick={() => { setSearchOpen(!searchOpen); setSearchQuery(""); setSearchResults({ blogs: [], foods: [] }); }}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <form onSubmit={handleSearchSubmit} className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search foods, articles..."
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        autoFocus
                      />
                      {searching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                      )}
                    </div>
                  </form>

                  {/* Results */}
                  {hasResults && (
                    <div className="max-h-72 overflow-y-auto">
                      {searchResults.blogs.length > 0 && (
                        <div>
                          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">Articles</p>
                          {searchResults.blogs.map((blog: any) => (
                            <button
                              key={blog.slug}
                              onClick={() => navigateAndClose(`/blog/${blog.slug}`)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                            >
                              <BookOpen className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700 line-clamp-1">{blog.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searchResults.foods.length > 0 && (
                        <div>
                          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-t border-gray-50">Foods</p>
                          {searchResults.foods.map((food: any) => (
                            <button
                              key={food.fdcId}
                              onClick={() => navigateAndClose(`/food/${food.fdcId}-${food.description?.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                            >
                              <UtensilsCrossed className="w-4 h-4 text-orange-400 flex-shrink-0" />
                              <span className="text-sm text-gray-700 line-clamp-1">{food.description}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* No results */}
                  {searchQuery.length >= 2 && !searching && !hasResults && (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">
                      No results for "{searchQuery}"
                    </div>
                  )}

                  {/* Prompt */}
                  {searchQuery.length < 2 && (
                    <div className="px-4 py-4 text-center text-sm text-gray-400">
                      Type to search foods and articles...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label}>
                  <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {link.label}
                  </p>
                  {link.dropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-6 py-2 text-base text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
