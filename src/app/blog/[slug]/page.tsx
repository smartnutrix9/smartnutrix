"use client";
// src/app/blog/[slug]/page.tsx

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

  // Content protection
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 's')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fetch post
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h1>
        <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back link */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {/* Category */}
      {post.blog_categories && (
        <div className="mb-4">
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: post.blog_categories.color || '#1D9E75' }}
          >
            {post.blog_categories.name}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
        {post.published_at && (
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(post.published_at)}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {post.read_time} min read
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          {post.views.toLocaleString()} views
        </span>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Article content */}
      <article
        className="blog-content mb-12"
        style={{ userSelect: 'none' }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer */}
      <div className="border-t border-gray-100 pt-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>
      </div>
    </div>
  );
}