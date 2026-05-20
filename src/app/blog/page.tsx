"use client";
// src/app/blog/page.tsx

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Clock, Eye, X, Loader2, BookOpen } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string | null;
  read_time: number;
  views: number;
  published_at: string;
  blog_categories: { name: string; slug: string; color: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  // Re-filter whenever search or category changes
  useEffect(() => {
    let result = posts;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.blog_categories?.slug === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.blog_categories?.name.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [posts, searchQuery, activeCategory]);

  async function fetchPosts() {
    setLoading(true);
    try {
      // Use the existing /api/blog endpoint that already exists in the project
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
        setFiltered(data.posts);

        // Extract unique categories from the posts
        const seen = new Set<string>();
        const cats: Category[] = [];
        for (const post of data.posts) {
          if (post.blog_categories && !seen.has(post.blog_categories.slug)) {
            seen.add(post.blog_categories.slug);
            cats.push({
              id: post.blog_categories.slug,
              name: post.blog_categories.name,
              slug: post.blog_categories.slug,
              color: post.blog_categories.color,
            });
          }
        }
        // Sort categories alphabetically
        cats.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(cats);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
    setLoading(false);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }

  function clearAll() {
    setSearchQuery("");
    setActiveCategory("all");
    searchRef.current?.focus();
  }

  const isFiltered = searchQuery.trim() !== "" || activeCategory !== "all";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero / Search Section ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Smart<span style={{ color: "#0F6E56" }}>Nutrix</span> Blog
          </h1>
          <p className="text-gray-500 mb-8 text-base">
            Evidence-based nutrition, Indian food guides, health tips, and more
          </p>

          {/* Big search bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles... e.g. 'protein', 'diabetes', 'weight loss'"
              className="w-full pl-14 pr-12 py-4 text-base border-2 rounded-2xl focus:outline-none bg-white shadow-sm transition-colors placeholder-gray-300"
              style={{
                borderColor: searchQuery ? "#1D9E75" : "#E5E7EB",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search result feedback */}
          {searchQuery && !loading && (
            <p className="mt-3 text-sm text-gray-500">
              {filtered.length === 0
                ? `No articles found for "${searchQuery}"`
                : `${filtered.length} article${filtered.length !== 1 ? "s" : ""} found for "${searchQuery}"`}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* ── Category filter pills ── */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all border"
              style={
                activeCategory === "all"
                  ? { backgroundColor: "#1D9E75", color: "white", borderColor: "#1D9E75" }
                  : { backgroundColor: "white", color: "#6B7280", borderColor: "#E5E7EB" }
              }
            >
              All Articles
              <span className="ml-1.5 text-xs opacity-70">({posts.length})</span>
            </button>

            {categories.map((cat) => {
              const count = posts.filter(
                (p) => p.blog_categories?.slug === cat.slug
              ).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all border"
                  style={
                    activeCategory === cat.slug
                      ? { backgroundColor: cat.color, color: "white", borderColor: cat.color }
                      : { backgroundColor: "white", color: "#6B7280", borderColor: "#E5E7EB" }
                  }
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Loading state ── */}
        {loading && (
          <div className="flex items-center justify-center py-24 gap-3 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#1D9E75" }} />
            <span>Loading SmartNutrix articles...</span>
          </div>
        )}

        {/* ── No results ── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchQuery ? `No articles found for "${searchQuery}"` : "No articles yet"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {searchQuery ? "Try different keywords or browse all articles" : "Check back soon"}
            </p>
            {isFiltered && (
              <button
                onClick={clearAll}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ backgroundColor: "#1D9E75" }}
              >
                Show all articles
              </button>
            )}
          </div>
        )}

        {/* ── Articles grid ── */}
        {!loading && filtered.length > 0 && (
          <>
            {/* Result summary bar */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                {isFiltered
                  ? `Showing ${filtered.length} of ${posts.length} articles`
                  : `${posts.length} article${posts.length !== 1 ? "s" : ""}`}
              </p>
              {isFiltered && (
                <button
                  onClick={clearAll}
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Clear filters
                </button>
              )}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  {/* Cover image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg, #E1F5EE, #B8E8D4)" }}
                      >
                        <BookOpen className="w-10 h-10" style={{ color: "#1D9E75" }} />
                      </div>
                    )}
                    {/* Category badge */}
                    {post.blog_categories && (
                      <span
                        className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full text-white shadow-sm"
                        style={{ backgroundColor: post.blog_categories.color || "#1D9E75" }}
                      >
                        {post.blog_categories.name}
                      </span>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="p-5">
                    <h2 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {post.published_at && (
                        <span>{formatDate(post.published_at)}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.read_time} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views?.toLocaleString() ?? 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
