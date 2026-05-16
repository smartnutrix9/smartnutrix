"use client";
// src/app/blog/[slug]/page.tsx
// Individual blog post page

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, Loader2, BookOpen } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  read_time: number;
  views: number;
  published_at: string;
  meta_title: string;
  meta_description: string;
  blog_categories: { name: string; slug: string; color: string } | null;
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
        } else {
          setError("Article not found");
        }
      })
      .catch(() => setError("Failed to load article"))
      .finally(() => setLoading(false));
  }, [slug]);

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
        Loading article...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{error || "Article not found"}</h2>
        <p className="text-gray-400 mb-6">This article may have been removed or the link is incorrect.</p>
        <Link href="/blog" className="btn-primary">
          View All Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-600">Home</Link>
        <span>›</span>
        <Link href="/blog" className="hover:text-gray-600">Blog</Link>
        <span>›</span>
        <span className="text-gray-600 truncate">{post.title}</span>
      </div>

      {/* Category Badge */}
      {post.blog_categories && (
        <span
          className="text-xs font-medium px-3 py-1 rounded-full"
          style={{
            backgroundColor: post.blog_categories.color + '15',
            color: post.blog_categories.color,
          }}
        >
          {post.blog_categories.name}
        </span>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatDate(post.published_at)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {post.read_time} min read
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {post.views} views
        </span>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="rounded-2xl overflow-hidden mb-10 border border-gray-100">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <article
        className="blog-content mb-12"
        style={{ maxWidth: '100%', width: '100%' }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Bottom navigation */}
      <div className="border-t border-gray-100 pt-8 mt-12">
        <div className="flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          <div className="flex gap-2">
            <Link href="/" className="btn-outline text-sm py-2 px-4">
              Search Foods
            </Link>
            <Link href="/calculator/calories" className="btn-primary text-sm py-2 px-4">
              Calorie Calculator
            </Link>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-8">
        This article is for informational purposes only and is not a substitute for professional medical advice.
      </p>
    </div>
  );
}