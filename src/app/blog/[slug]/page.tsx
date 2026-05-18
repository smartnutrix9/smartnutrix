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
  post_image1: string | null;
  post_image1_usa_url: string | null;
  post_image1_india_url: string | null;
  post_image2: string | null;
  post_image2_usa_url: string | null;
  post_image2_india_url: string | null;
}

// Clickable affiliate image that uses smart redirect
function AffiliateImage({ src, usaUrl, indiaUrl, alt }: { src: string; usaUrl: string | null; indiaUrl: string | null; alt: string }) {
  const hasLink = usaUrl || indiaUrl;
  const redirectUrl = hasLink
    ? `/api/redirect?usa=${encodeURIComponent(usaUrl || "")}&india=${encodeURIComponent(indiaUrl || "")}`
    : null;

  const imgEl = (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-2xl object-cover shadow-md"
      style={{ maxHeight: "320px" }}
    />
  );

  if (!redirectUrl) return <div className="my-8">{imgEl}</div>;

  return (
    <a
      href={redirectUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="block my-8 group relative"
      title="Click to view product"
    >
      {imgEl}
      {/* Hover badge */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg" style={{ backgroundColor: "#FF9900" }}>
        🛒 View on Amazon
      </div>
    </a>
  );
}

// AdSense placeholder — replace data-ad-slot with your real slot IDs after approval
function AdUnit({ slot }: { slot: string }) {
  return (
    <div className="my-8 flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-xl" style={{ minHeight: "100px" }}>
      {/* Uncomment and replace with real AdSense code after approval:
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      */}
      {/* Remove this placeholder div after adding real AdSense code */}
      <span className="text-xs text-gray-300">Ad • {slot}</span>
    </div>
  );
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Content protection
  useEffect(() => {
    const noContext = (e: MouseEvent) => e.preventDefault();
    const noKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "s")) e.preventDefault();
    };
    document.addEventListener("contextmenu", noContext);
    document.addEventListener("keydown", noKeys);
    return () => {
      document.removeEventListener("contextmenu", noContext);
      document.removeEventListener("keydown", noKeys);
    };
  }, []);

  // Fetch post
  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setPost(data.post);
        else setError("Article not found");
      })
      .catch(() => setError("Failed to load article"))
      .finally(() => setLoading(false));
  }, [slug]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin" /> Loading article...
    </div>
  );

  if (error || !post) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h1>
      <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
      <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {/* Category */}
      {post.blog_categories && (
        <div className="mb-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: post.blog_categories.color || "#1D9E75" }}>
            {post.blog_categories.name}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
        {post.published_at && (
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{formatDate(post.published_at)}</span>
        )}
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.read_time} min read</span>
        <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{post.views.toLocaleString()} views</span>
      </div>

      {/* Cover Image */}
      {post.cover_image && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img src={post.cover_image} alt={post.title} className="w-full h-64 object-cover" />
        </div>
      )}

      {/* ── Ad Unit 1 (after cover / before content) ── */}
      <AdUnit slot="1111111111" />

      {/* Article content — first half */}
      <article
        className="blog-content mb-4"
        style={{ userSelect: "none" }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* ── Post Image 1 (mid-article affiliate) ── */}
      {post.post_image1 && (
        <AffiliateImage
          src={post.post_image1}
          usaUrl={post.post_image1_usa_url}
          indiaUrl={post.post_image1_india_url}
          alt="Recommended product"
        />
      )}

      {/* ── Ad Unit 2 (mid-article) ── */}
      <AdUnit slot="2222222222" />

      {/* ── Post Image 2 (near end affiliate) ── */}
      {post.post_image2 && (
        <AffiliateImage
          src={post.post_image2}
          usaUrl={post.post_image2_usa_url}
          indiaUrl={post.post_image2_india_url}
          alt="Recommended product"
        />
      )}

      {/* ── Ad Unit 3 (after article) ── */}
      <AdUnit slot="3333333333" />

      {/* Footer */}
      <div className="border-t border-gray-100 pt-8 mt-4">
        {/* Affiliate disclosure */}
        <p className="text-xs text-gray-400 mb-6">
          This article may contain affiliate links. If you purchase through these links, SmartNutrix may earn a small commission at no extra cost to you.
        </p>
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>
      </div>
    </div>
  );
}
