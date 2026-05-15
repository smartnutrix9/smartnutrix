"use client";
// src/app/page.tsx
// This is the HOMEPAGE - Google-style search for food nutrition

import { useState } from "react";
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
  { name: "Protein Intake",      desc: "Daily protein requirement",        href: "/calculator/protein",  icon: TrendingUp,color: "bg-brand-50 text-brand-600" },
];

// Sample AI prompts
const aiPrompts = [
  "High protein vegetarian foods",
  "Weight loss foods for Indians",
  "Diabetic friendly breakfast",
  "Foods for muscle gain",
  "Low carb Indian foods",
  "Iron rich foods for women",
];

// Sample blog posts
const recentPosts = [
  {
    title: "Top 10 High Protein Indian Foods",
    slug: "high-protein-indian-foods",
    excerpt: "Discover the best protein-rich foods in Indian cuisine for muscle building and weight management.",
    category: "Protein",
    readTime: 5,
  },
  {
    title: "Complete Guide to South Indian Nutrition",
    slug: "south-indian-nutrition-guide",
    excerpt: "Everything you need to know about the nutritional value of popular South Indian dishes.",
    category: "Indian Food",
    readTime: 8,
  },
  {
    title: "BMR vs BMI: What's the Difference?",
    slug: "bmr-vs-bmi-difference",
    excerpt: "Understanding the key differences between BMR and BMI and why both matter for your health.",
    category: "Health",
    readTime: 4,
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <div className="min-h-screen">

      {/* HERO SECTION - Main search area */}
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

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-card border border-gray-200">
              <div className="flex-1 flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search any food... (e.g. paneer, idli, avocado)"
                  className="flex-1 text-base outline-none text-gray-700 placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Star className="w-6 h-6 text-brand-500" />
                Popular Foods
              </h2>
              <p className="section-subtitle">Most searched foods today</p>
            </div>
            <Link href="/foods" className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularFoods.map((food) => (
              <Link
                key={food.slug}
                href={`/food/${food.slug}`}
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
                  <div className="mt-4 text-brand-600 text-sm font-medium flex items-center gap-1">
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
              <p className="text-brand-100 text-lg mb-8">
                Tell our AI your health goals and get customized food suggestions instantly.
              </p>

              {/* AI prompt suggestions */}
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

      {/* BLOG SECTION */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Nutrition Blog</h2>
              <p className="section-subtitle">Expert articles on food & health</p>
            </div>
            <Link href="/blog" className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              All articles <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="card hover:shadow-card transition-all group"
              >
                <div className="badge-green mb-3">{post.category}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors text-lg mb-2 leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="text-xs text-gray-400">{post.readTime} min read</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}