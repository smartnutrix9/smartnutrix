"use client";
// src/app/page.tsx
// Homepage of SmartNutrix

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Zap, Activity, Droplets, Scale,
  ChevronRight, Star, TrendingUp, Leaf, Brain
} from "lucide-react";

// Popular foods for quick access
const popularFoods = [
  { name: "Chicken Breast",  slug: "chicken-breast",  cal: 165, emoji: "🍗" },
  { name: "Brown Rice",      slug: "brown-rice",       cal: 216, emoji: "🍚" },
  { name: "Avocado",         slug: "avocado",          cal: 160, emoji: "🥑" },
  { name: "Banana",          slug: "banana",           cal: 89,  emoji: "🍌" },
  { name: "Egg",             slug: "egg",              cal: 155, emoji: "🥚" },
  { name: "Almonds",         slug: "almonds",          cal: 579, emoji: "🌰" },
  { name: "Idli",            slug: "idli",             cal: 39,  emoji: "🫓" },
  { name: "Dal Tadka",       slug: "dal-tadka",        cal: 120, emoji: "🫕" },
  { name: "Paneer",          slug: "paneer",           cal: 265, emoji: "🧀" },
  { name: "Roti",            slug: "roti",             cal: 106, emoji: "🫓" },
  { name: "Oatmeal",         slug: "oatmeal",          cal: 389, emoji: "🥣" },
  { name: "Greek Yogurt",    slug: "greek-yogurt",     cal: 59,  emoji: "🍶" },
];

// Calculator tools
const calculators = [
  { name: "BMI Calculator",      desc: "Check your Body Mass Index",       href: "/calculator/bmi",      icon: Scale,    color: "bg-blue-50 text-blue-600" },
  { name: "BMR Calculator",      desc: "Find your base metabolic rate",    href: "/calculator/bmr",      icon: Activity, color: "bg-purple-50 text-purple-600" },
  { name: "Calorie Calculator",  desc: "Daily calorie needs",              href: "/calculator/calories", icon: Zap,      color: "bg-orange-50 text-orange-600" },
  { name: "Water Intake",        desc: "Daily water requirement",          href: "/calculator/water",    icon: Droplets, color: "bg-cyan-50 text-cyan-600" },
  { name: "Protein Intake",      desc: "Daily protein requirement",        href: "/calculator/protein",  icon: TrendingUp, color: "bg-brand-50 text-brand-600" },
];

// AI prompts
const aiPrompts = [
  "High protein vegetarian foods",
  "Weight loss foods for Indians",
  "Diabetic friendly breakfast",
  "Foods for muscle gain",
  "Low carb Indian foods",
  "Iron rich foods for women",
];

// BlogSection component - fetches latest posts from database
function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog/latest")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPosts(data.posts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || posts.length === 0) {
    return (
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Nutrition Blog</h2>
              <p className="section-subtitle">Expert articles on food & health</p>
            </div>
            <Link href="/blog" className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all" style={{color: '#1D9E75'}}>
              All articles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-full mb-2" />
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Nutrition Blog</h2>
            <p className="section-subtitle">Expert articles on food & health</p>
          </div>
          <Link href="/blog" className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all" style={{color: '#1D9E75'}}>
            All articles <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card hover:shadow-card transition-all group overflow-hidden p-0"
            >
              {post.cover_image ? (
                <div className="h-40 overflow-hidden">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center" style={{background: 'linear-gradient(135deg, #E1F5EE, #C3EBD9)'}}>
                  <span className="text-4xl opacity-50">📝</span>
                </div>
              )}
              <div className="p-5">
                {post.blog_categories && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{backgroundColor: post.blog_categories.color + '15', color: post.blog_categories.color}}>
                    {post.blog_categories.name}
                  </span>
                )}
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors text-lg mt-2 mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="text-xs text-gray-400">{post.read_time} min read</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestTimer, setSuggestTimer] = useState<any>(null);
  const router = useRouter();

  // Auto-suggest function with debounce
  function handleAutoSuggest(query: string) {
    if (suggestTimer) clearTimeout(suggestTimer);

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=6`);
        const data = await res.json();
        if (data.success && data.results.length > 0) {
          setSuggestions(data.results);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    setSuggestTimer(timer);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside() {
      setShowSuggestions(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-brand-50 to-white pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <Leaf className="w-4 h-4" />
            900,000+ Foods including Indian recipes
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
            What&apos;s the nutrition in
            <span className="text-brand-500"> your food?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Search nutrition facts, track calories, compare foods, and get AI-powered diet recommendations — all in one place.
          </p>

          {/* Search bar with auto-suggest */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-card border border-gray-200">
              <div className="flex-1 flex items-center gap-3 px-3 relative">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search any food... (e.g. paneer, idli, avocado)"
                  className="flex-1 text-base outline-none text-gray-700 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleAutoSuggest(e.target.value);
                  }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="btn-primary rounded-xl px-6 py-3 text-sm"
              >
                Search
              </button>
            </div>

            {/* Auto-suggest dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                {suggestions.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSearchQuery(item.description);
                      setShowSuggestions(false);
                      router.push(`/search?q=${encodeURIComponent(item.description)}`);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-gray-700 border-b border-gray-50 last:border-0 flex items-center gap-3"
                  >
                    <Search className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    <span>{item.description}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Quick search tags */}
          <div className="flex flex-wrap gap-2 justify-center mt-5">
            {["Idli", "Dosa", "Dal", "Paneer", "Roti", "Chicken", "Avocado", "Oats"].map((food) => (
              <button
                key={food}
                onClick={() => router.push(`/search?q=${food}`)}
                className="px-4 py-1.5 bg-white border border-gray-200 text-sm text-gray-600 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors shadow-sm"
              >
                {food}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR FOODS SECTION */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Star className="w-6 h-6 text-brand-500" />
                Popular Foods
              </h2>
              <p className="section-subtitle">Most searched foods today</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularFoods.map((food) => (
              <Link
                key={food.slug}
                href={`/search?q=${encodeURIComponent(food.name)}`}
                className="card hover:shadow-card hover:border-brand-200 transition-all text-center p-4 cursor-pointer group"
              >
                <div className="text-3xl mb-2">{food.emoji}</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-brand-600 transition-colors">
                  {food.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">{food.cal} kcal</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATORS SECTION */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-title">Health Calculators</h2>
            <p className="section-subtitle">Free tools to understand your body better</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {calculators.map((calc) => {
              const Icon = calc.icon;
              return (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="card hover:shadow-card transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${calc.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors mb-1">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-gray-500">{calc.desc}</p>
                  <div className="mt-4 text-sm font-medium flex items-center gap-1" style={{color: '#1D9E75'}}>
                    Calculate <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI RECOMMENDATIONS SECTION */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl p-8 md:p-12 text-white" style={{background: 'linear-gradient(to right, #0F6E56, #2DB887)'}}>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
                <Brain className="w-4 h-4" />
                AI-Powered Nutrition Assistant
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get personalized food recommendations
              </h2>
              <p className="text-lg mb-8" style={{color: '#C3EBD9'}}>
                Tell our AI your health goals and get customized food suggestions instantly.
              </p>

              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {aiPrompts.map((prompt) => (
                  <Link
                    key={prompt}
                    href={`/ai?q=${encodeURIComponent(prompt)}`}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/30 transition-colors"
                  >
                    {prompt}
                  </Link>
                ))}
              </div>

              <Link href="/ai" className="inline-flex items-center gap-2 bg-white font-semibold px-8 py-4 rounded-2xl hover:shadow-lg transition-all" style={{color: '#0F6E56'}}>
                <Brain className="w-5 h-5" />
                Try AI Recommendations Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOD COMPARISON SECTION */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="section-title mb-4">Compare Foods Side by Side</h2>
              <p className="text-gray-500 text-lg mb-6">
                See exactly how two foods stack up nutritionally. Compare calories, protein, carbs, vitamins and more.
              </p>
              <div className="space-y-2 mb-6">
                {["Apple vs Banana", "Rice vs Quinoa", "Paneer vs Tofu", "Idli vs Dosa"].map((pair) => (
                  <Link
                    key={pair}
                    href={`/compare?foods=${encodeURIComponent(pair)}`}
                    className="flex items-center gap-2 font-medium" style={{color: '#1D9E75'}}
                  >
                    <ChevronRight className="w-4 h-4" />
                    {pair}
                  </Link>
                ))}
              </div>
              <Link href="/compare" className="btn-primary">
                Compare Any Two Foods
              </Link>
            </div>
            <div className="card p-6">
              <div className="text-center text-gray-400 text-sm mb-4">Sample comparison</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">🍎</div>
                  <div className="font-semibold text-gray-700">Apple</div>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-gray-300 text-lg font-bold">vs</span>
                </div>
                <div>
                  <div className="text-2xl mb-1">🍌</div>
                  <div className="font-semibold text-gray-700">Banana</div>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Calories", a: 52,  b: 89  },
                  { label: "Protein",  a: 0.3, b: 1.1 },
                  { label: "Carbs",    a: 14,  b: 23  },
                  { label: "Fiber",    a: 2.4, b: 2.6 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-16 text-right">{row.a}g</span>
                    <div className="flex-1">
                      <div className="text-xs text-center text-gray-500 mb-1">{row.label}</div>
                      <div className="flex gap-1">
                        <div className="h-2 bg-red-300 rounded-l-full flex-1" style={{ maxWidth: `${(row.a / (row.a + row.b)) * 100}%` }} />
                        <div className="h-2 bg-yellow-300 rounded-r-full flex-1" />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 w-16">{row.b}g</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG SECTION - Auto-loads from database */}
      <BlogSection />

    </div>
  );
}