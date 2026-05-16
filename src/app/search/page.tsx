"use client";
// src/app/search/page.tsx
// Search results page

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Loader2, AlertCircle } from "lucide-react";

interface SearchResult {
  fdcId: number;
  description: string;
  category?: string;
  brandOwner?: string;
}

function SearchContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const query         = searchParams.get("q") || "";

  const [results,   setResults]   = useState<SearchResult[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [searchBox, setSearchBox] = useState(query);

  // Fetch results when query changes
  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError("");

    fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setResults(data.results);
        else setError(data.error || "No results found");
      })
      .catch(() => setError("Something went wrong. Please try again."))
      .finally(() => setLoading(false));
  }, [query]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchBox.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchBox.trim())}`);
    }
  }

  // Convert food name to URL slug
  function toSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-brand-400 focus-within:border-transparent transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search food..."
            className="flex-1 outline-none text-gray-700"
            value={searchBox}
            onChange={(e) => setSearchBox(e.target.value)}
            autoFocus
          />
        </div>
        <button type="submit" className="btn-primary px-6">Search</button>
      </form>

      {/* Results header */}
      {query && !loading && (
        <p className="text-gray-500 text-sm mb-6">
          {results.length > 0
            ? `${results.length} results for "${query}"`
            : `No results for "${query}"`}
        </p>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Searching nutrition database...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-3 text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Results grid */}
      {!loading && !error && results.length > 0 && (
        <div className="grid gap-3">
          {results.map((food) => (
            <Link
              key={food.fdcId}
              href={`/food/${toSlug(food.description)}?fdcId=${food.fdcId}`}
              className="card flex items-center justify-between hover:shadow-card hover:border-brand-200 transition-all group p-4"
            >
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors">
                  {food.description}
                </h3>
                {food.category && (
                  <span className="text-xs text-gray-400 mt-1 block">{food.category}</span>
                )}
                {food.brandOwner && (
                  <span className="text-xs text-gray-500 mt-1 block">by {food.brandOwner}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="badge-green text-xs">View nutrition</span>
                <span className="text-gray-300">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && results.length === 0 && query && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🥗</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No foods found</h3>
          <p className="text-gray-400 mb-4">Try a different search term or check the spelling</p>
          <p className="text-sm text-amber-600 bg-amber-50 inline-block px-4 py-2 rounded-lg mb-6">
            💡 If searches aren't working, the nutrition database may be temporarily busy. Please try again in a few minutes.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["Chicken", "Rice", "Dal", "Paneer", "Banana"].map((s) => (
              <Link key={s} href={`/search?q=${s}`} className="badge-green px-4 py-2 rounded-full text-sm">
                Try &ldquo;{s}&rdquo;
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Loading search...</span>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}