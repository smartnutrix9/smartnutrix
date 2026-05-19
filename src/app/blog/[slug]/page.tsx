"use client";
// src/app/blog/[slug]/page.tsx

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Eye, Loader2, BookOpen, Search, BookOpenCheck } from "lucide-react";

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

/**
 * Splits HTML content into N roughly equal parts by block elements.
 */
function splitContentByParagraphs(html: string, parts: number): string[] {
  const blockRegex = /(<(?:p|h2|h3|h4|ul|ol|blockquote|pre|div)[^>]*>[\s\S]*?<\/(?:p|h2|h3|h4|ul|ol|blockquote|pre|div)>)/gi;
  const blocks = html.match(blockRegex) || [html];
  const total = blocks.length;
  const result: string[] = [];
  const splitPoints: number[] = [];
  for (let i = 1; i < parts; i++) {
    splitPoints.push(Math.round((total * i) / parts));
  }
  splitPoints.push(total);
  let prev = 0;
  for (const point of splitPoints) {
    result.push(blocks.slice(prev, point).join(""));
    prev = point;
  }
  return result;
}

/**
 * Checks if the HTML content has manual image placeholders like:
 *   [POST_IMAGE_1] or [POST_IMAGE_2]
 * If yes, replaces them with the actual affiliate image HTML.
 * If no placeholders, falls back to automatic 1/4 and 3/4 splitting.
 */
function hasManualPlaceholder(html: string, which: 1 | 2): boolean {
  return html.includes(`[POST_IMAGE_${which}]`);
}

function replaceManualPlaceholders(
  html: string,
  post: BlogPost
): string {
  let result = html;

  if (post.post_image1) {
    const img1Html = buildAffiliateImageHtml(
      post.post_image1,
      post.post_image1_usa_url,
      post.post_image1_india_url
    );
    result = result.replace(/\[POST_IMAGE_1\]/g, img1Html);
  } else {
    result = result.replace(/\[POST_IMAGE_1\]/g, "");
  }

  if (post.post_image2) {
    const img2Html = buildAffiliateImageHtml(
      post.post_image2,
      post.post_image2_usa_url,
      post.post_image2_india_url
    );
    result = result.replace(/\[POST_IMAGE_2\]/g, img2Html);
  } else {
    result = result.replace(/\[POST_IMAGE_2\]/g, "");
  }

  return result;
}

function buildAffiliateImageHtml(
  src: string,
  usaUrl: string | null,
  indiaUrl: string | null
): string {
  const hasLink = usaUrl || indiaUrl;
  const redirectUrl = hasLink
    ? `/api/redirect?usa=${encodeURIComponent(usaUrl || "")}&india=${encodeURIComponent(indiaUrl || "")}`
    : null;

  const imgTag = `<img src="${src}" alt="Recommended product" style="width:100%;max-height:320px;object-fit:cover;border-radius:16px;box-shadow:0 4px 16px rgba(0,0,0,0.10);margin:0;" />`;

  if (!redirectUrl) {
    return `<div style="margin:2rem 0;">${imgTag}</div>`;
  }

  return `
    <div style="margin:2rem 0;position:relative;display:block;">
      <a href="${redirectUrl}" target="_blank" rel="noopener noreferrer nofollow"
         style="display:block;text-decoration:none;">
        ${imgTag}
        <div style="position:absolute;bottom:12px;right:12px;background:#FF9900;color:white;
                    font-size:12px;font-weight:600;padding:6px 14px;border-radius:999px;
                    box-shadow:0 2px 8px rgba(0,0,0,0.15);">
          🛒 View on Amazon
        </div>
      </a>
    </div>`;
}

// React component for affiliate image (used in auto-split mode)
function AffiliateImage({
  src, usaUrl, indiaUrl, alt,
}: {
  src: string; usaUrl: string | null; indiaUrl: string | null; alt: string;
}) {
  const hasLink = usaUrl || indiaUrl;
  const redirectUrl = hasLink
    ? `/api/redirect?usa=${encodeURIComponent(usaUrl || "")}&india=${encodeURIComponent(indiaUrl || "")}`
    : null;

  const imgEl = (
    <img src={src} alt={alt} className="w-full rounded-2xl object-cover shadow-md" style={{ maxHeight: "320px" }} />
  );

  if (!redirectUrl) return <div className="my-8">{imgEl}</div>;

  return (
    <a href={redirectUrl} target="_blank" rel="noopener noreferrer nofollow" className="block my-8 group relative" title="Click to view product">
      {imgEl}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg" style={{ backgroundColor: "#FF9900" }}>
        🛒 View on Amazon
      </div>
    </a>
  );
}

// AdSense placeholder
function AdUnit({ slot }: { slot: string }) {
  return (
    <div className="my-6 flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-xl" style={{ minHeight: "90px" }}>
      {/*
      <ins className="adsbygoogle" style={{ display: "block" }}
        data-ad-client="ca-pub-XXXXXXXXXX" data-ad-slot={slot}
        data-ad-format="auto" data-full-width-responsive="true" />
      */}
      <span className="text-xs text-gray-300">Ad</span>
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
      <Loader2 className="w-6 h-6 animate-spin" /> Loading SmartNutrix article...
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

  const hasImage1 = !!post.post_image1;
  const hasImage2 = !!post.post_image2;

  // Decide rendering mode:
  // MANUAL: user typed [POST_IMAGE_1] or [POST_IMAGE_2] in HTML editor → inject there
  // AUTO: no placeholders → split content at 1/4 and 3/4 automatically
  const manual1 = hasManualPlaceholder(post.content, 1);
  const manual2 = hasManualPlaceholder(post.content, 2);
  const useManualMode = manual1 || manual2;

  let renderedContent = post.content;
  let contentParts: string[] = [];

  if (useManualMode) {
    // Replace [POST_IMAGE_1] and [POST_IMAGE_2] with actual image HTML
    renderedContent = replaceManualPlaceholders(post.content, post);
  } else {
    // Auto-split mode
    if (hasImage1 && hasImage2) {
      contentParts = splitContentByParagraphs(post.content, 4);
    } else if (hasImage1 || hasImage2) {
      contentParts = splitContentByParagraphs(post.content, 2);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {/* Category badge */}
      {post.blog_categories && (
        <div className="mb-4">
          <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ backgroundColor: post.blog_categories.color || "#1D9E75" }}>
            {post.blog_categories.name}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h1>

      {/* Meta bar */}
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

      {/* Ad Unit 1 */}
      <AdUnit slot="1111111111" />

      {/* ── Content rendering ── */}
      {useManualMode ? (
        // MANUAL MODE: [POST_IMAGE_1] / [POST_IMAGE_2] replaced inline
        <article
          className="blog-content"
          style={{ userSelect: "none" }}
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      ) : hasImage1 && hasImage2 ? (
        // AUTO: both images — split into 4 quarters
        <>
          <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
          <AffiliateImage src={post.post_image1!} usaUrl={post.post_image1_usa_url} indiaUrl={post.post_image1_india_url} alt="Recommended product" />
          <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
          <AdUnit slot="2222222222" />
          <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: contentParts[2] }} />
          <AffiliateImage src={post.post_image2!} usaUrl={post.post_image2_usa_url} indiaUrl={post.post_image2_india_url} alt="Recommended product" />
          <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: contentParts[3] }} />
        </>
      ) : hasImage1 ? (
        // AUTO: only image 1 — split in half
        <>
          <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
          <AffiliateImage src={post.post_image1!} usaUrl={post.post_image1_usa_url} indiaUrl={post.post_image1_india_url} alt="Recommended product" />
          <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
        </>
      ) : hasImage2 ? (
        // AUTO: only image 2 — split in half
        <>
          <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: contentParts[0] }} />
          <AffiliateImage src={post.post_image2!} usaUrl={post.post_image2_usa_url} indiaUrl={post.post_image2_india_url} alt="Recommended product" />
          <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: contentParts[1] }} />
        </>
      ) : (
        // No images
        <article className="blog-content" style={{ userSelect: "none" }} dangerouslySetInnerHTML={{ __html: post.content }} />
      )}

      {/* Ad Unit 3 */}
      <AdUnit slot="3333333333" />

      {/* Affiliate disclosure */}
      <p className="text-xs text-gray-400 mt-6 mb-8">
        This article may contain affiliate links. If you purchase through these links, SmartNutrix may earn a small commission at no extra cost to you.
      </p>

      {/* ── Bottom navigation buttons (restored) ── */}
      <div className="border-t border-gray-100 pt-8 mt-4">
        <p className="text-sm text-gray-500 text-center mb-6">Explore more on SmartNutrix</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#1D9E75" }}
          >
            <Search className="w-4 h-4" />
            Nutrition Search
          </Link>
          <Link
            href="/blog"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <BookOpenCheck className="w-4 h-4" />
            All Blogs
          </Link>
        </div>
      </div>

    </div>
  );
}
