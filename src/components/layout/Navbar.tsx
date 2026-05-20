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
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [searchResults, setSearchResults] = useState<{ blogs: any[]; foods: any[] }>({ blogs: [], foods: [] });
  const [searching,    setSearching]    = useState(false);
  const [searchTimer,  setSearchTimer]  = useState<any>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  // Search function with debounce
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
        if (data.success) {
          setSearchResults({ blogs: data.blogs, foods: data.foods });
        }
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
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 font-bold text-2xl text-gray-900"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{backgroundColor: '#1D9E75'}}>
              <Leaf className="w-5 h-5" style={{color: 'white'}} />
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
                    <div className="absolute top-full left-0 pt-2 w-52 z-50">
                      <div className="bg-white rounded-xl shadow-card border border-gray-100 py-2">
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

          {/* Right side - Search + Buttons */}
          <div className="hidden md:flex items-center gap-3">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-64">
                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search articles & foods..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                      autoFocus
                    />
                    {searching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(""); setSearchResults({ blogs: [], foods: [] }); }} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search Results Dropdown */}
                  {searchQuery.trim().length >= 2 && (hasResults || searching) && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">

                      {/* Blog Results */}
                      {searchResults.blogs.length > 0 && (
                        <div>
                          <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 flex items-center gap-2">
                            <BookOpen className="w-3 h-3" /> ARTICLES
                          </div>
                          {searchResults.blogs.map((blog: any) => (
                            <button
                              key={blog.slug}
                              onClick={() => navigateAndClose(`/blog/${blog.slug}`)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                            >
                              <div className="text-sm font-medium text-gray-800 leading-snug">{blog.title}</div>
                              {blog.blog_categories && (
                                <span className="text-xs mt-1 inline-block" style={{ color: blog.blog_categories.color }}>
                                  {blog.blog_categories.name}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Food Results */}
                      {searchResults.foods.length > 0 && (
                        <div>
                          <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 flex items-center gap-2">
                            <UtensilsCrossed className="w-3 h-3" /> FOODS
                          </div>
                          {searchResults.foods.map((food: any) => (
                            <button
                              key={food.fdcId}
                              onClick={() => navigateAndClose(`/food/${food.description.toLowerCase().replace(/[^a-z0-9]+/g, "-")}?fdcId=${food.fdcId}`)}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50"
                            >
                              <div className="text-sm text-gray-700">{food.description}</div>
                              {food.category && (
                                <span className="text-xs text-gray-400">{food.category}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Search All link */}
                      <button
                        onClick={() => navigateAndClose(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                        className="w-full text-center px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                        style={{ color: '#1D9E75' }}
                      >
                        Search all results for &ldquo;{searchQuery}&rdquo; →
                      </button>
                    </div>
                  )}

                  {/* No results */}
                  {searchQuery.trim().length >= 2 && !searching && !hasResults && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-6 text-center">
                      <p className="text-sm text-gray-500 mb-2">No results found for &ldquo;{searchQuery}&rdquo;</p>
                      <button
                        onClick={() => navigateAndClose(`/search?q=${encodeURIComponent(searchQuery.trim())}`)}
                        className="text-sm font-medium" style={{ color: '#1D9E75' }}
                      >
                        Try full search →
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>
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

          {/* Mobile search */}
          <form onSubmit={(e) => { e.preventDefault(); if (searchQuery.trim()) { setMobileOpen(false); router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`); } }} className="mb-3">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles & foods..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
              />
            </div>
          </form>

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
          
        </div>
      )}
    </header>
  );
}