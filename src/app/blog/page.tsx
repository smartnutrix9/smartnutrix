"use client";
// src/app/blog/page.tsx
// Public blog listing page

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, BookOpen } from "lucide-react";

interface BlogPost {
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPosts(data.posts);
      })
      .catch((err) => console.error("Fetch blog error:", err))
      .finally(() => setLoading(false));
  }, []);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading articles...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#E1F5EE'}}>
          <BookOpen className="w-7 h-7" style={{color: '#1D9E75'}} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Nutrition Blog</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Expert articles on food, nutrition, healthy eating, and Indian cuisine.
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No articles yet</h3>
          <p className="text-gray-400 mb-6">We're working on amazing nutrition content. Check back soon!</p>
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card hover:shadow-card transition-all group overflow-hidden p-0"
            >
              {/* Cover Image */}
              {post.cover_image ? (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center" style={{background: 'linear-gradient(135deg, #E1F5EE, #C3EBD9)'}}>
                  <BookOpen className="w-12 h-12" style={{color: '#1D9E75', opacity: 0.5}} />
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                {post.blog_categories && (
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: post.blog_categories.color + '15',
                      color: post.blog_categories.color,
                    }}
                  >
                    {post.blog_categories.name}
                  </span>
                )}

                <h2 className="font-semibold text-gray-900 text-lg mt-3 mb-2 group-hover:text-brand-600 transition-colors leading-snug">
                  {post.title}
                </h2>

                {post.excerpt && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(post.published_at)}</span>
                  <span>{post.read_time} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}