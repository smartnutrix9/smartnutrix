"use client";
// src/app/admin/page.tsx
// Admin Dashboard — Manage blog posts + AI toggle

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Leaf, Plus, Edit, Trash2, Eye, EyeOff,
  LogOut, Loader2, Brain,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  read_time: number;
  views: number;
  created_at: string;
  published_at: string | null;
  blog_categories: { name: string; slug: string; color: string } | null;
}

export default function AdminDashboard() {
  const [posts, setPosts]       = useState<BlogPost[]>([]);
  const [loading, setLoading]   = useState(true);
  const [token, setToken]       = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // AI toggle state
  const [aiEnabled, setAiEnabled]   = useState<boolean>(true);
  const [aiToggling, setAiToggling] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) { router.push("/admin/login"); return; }
    setToken(savedToken);
    fetchPosts(savedToken);
    fetchAiSetting();
  }, [router]);

  // ── Fetch all posts ──────────────────────────────────────────
  async function fetchPosts(authToken: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      } else {
        router.push("/admin/login");
      }
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  // ── AI setting ───────────────────────────────────────────────
  async function fetchAiSetting() {
    try {
      const res = await fetch("/api/settings?key=ai_enabled");
      const data = await res.json();
      setAiEnabled(data.value !== "false");
    } catch {}
  }

  async function toggleAi() {
    setAiToggling(true);
    const newVal = !aiEnabled;
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ key: "ai_enabled", value: newVal ? "true" : "false" }),
      });
      setAiEnabled(newVal);
    } catch {}
    setAiToggling(false);
  }

  // ── Publish toggle ───────────────────────────────────────────
  async function togglePublish(post: BlogPost) {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: post.id, published: !post.published }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map((p) => p.id === post.id ? { ...p, published: !p.published } : p));
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  }

  // ── Delete post ──────────────────────────────────────────────
  async function deletePost(id: string) {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(null);
    }
  }

  function logout() {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  // ── Loading screen ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading SmartNutrix Dashboard...
      </div>
    );
  }

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount     = posts.filter((p) => !p.published).length;
  const totalViews     = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Admin Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: "#1D9E75" }}>
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900">
                Smart<span style={{ color: "#0F6E56" }}>Nutrix</span>
              </span>
              <span className="text-xs text-gray-400 ml-2">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              View Site →
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Posts",      value: posts.length,   color: "#1D9E75" },
            { label: "Published",        value: publishedCount, color: "#10B981" },
            { label: "Drafts",           value: draftCount,     color: "#F59E0B" },
            { label: "Total Views",      value: totalViews.toLocaleString(), color: "#3B82F6" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── AI Nutrition Toggle card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: aiEnabled ? "#E1F5EE" : "#F3F4F6" }}
            >
              <Brain className="w-5 h-5" style={{ color: aiEnabled ? "#1D9E75" : "#9CA3AF" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">AI Nutrition Assistant</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {aiEnabled
                  ? "✅ Active — visible to all users at /ai"
                  : "💤 Inactive — showing Coming Soon page to users"}
              </p>
            </div>
          </div>
          <button
            onClick={toggleAi}
            disabled={aiToggling}
            title={aiEnabled ? "Click to deactivate" : "Click to activate"}
            className="relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50"
            style={{ backgroundColor: aiEnabled ? "#1D9E75" : "#D1D5DB" }}
          >
            {aiToggling ? (
              <Loader2 className="w-4 h-4 text-white animate-spin absolute left-1/2 -translate-x-1/2" />
            ) : (
              <span
                className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: aiEnabled ? "translateX(22px)" : "translateX(2px)" }}
              />
            )}
          </button>
        </div>

        {/* ── Actions row ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-lg font-bold text-gray-900">Blog Posts</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/shop"
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              🛒 Shop
            </Link>
            <Link
              href="/admin/categories"
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              🏷️ Categories
            </Link>
            <Link
              href="/admin/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1D9E75" }}
            >
              <Plus className="w-4 h-4" /> New Post
            </Link>
          </div>
        </div>

        {/* ── Posts table ── */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-400 text-sm mb-6">Create your first blog post to get started</p>
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ backgroundColor: "#1D9E75" }}
            >
              <Plus className="w-4 h-4" /> Create First Post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Rows */}
            {posts.map((post) => (
              <div
                key={post.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors items-center last:border-0"
              >
                {/* Title + status */}
                <div className="col-span-5">
                  <div className="flex items-start gap-2">
                    <span
                      className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full"
                      style={{ backgroundColor: post.published ? "#10B981" : "#F59E0B" }}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {post.published ? "Published" : "Draft"} · {post.read_time} min read
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div className="col-span-2">
                  {post.blog_categories ? (
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: post.blog_categories.color || "#1D9E75" }}
                    >
                      {post.blog_categories.name}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-300">—</span>
                  )}
                </div>

                {/* Views */}
                <div className="col-span-1 text-center text-sm text-gray-500">
                  {(post.views || 0).toLocaleString()}
                </div>

                {/* Date */}
                <div className="col-span-2 text-xs text-gray-400">
                  {post.published_at
                    ? formatDate(post.published_at)
                    : formatDate(post.created_at)}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  {/* Publish toggle */}
                  <button
                    onClick={() => togglePublish(post)}
                    title={post.published ? "Unpublish" : "Publish"}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {post.published
                      ? <EyeOff className="w-4 h-4 text-amber-500" />
                      : <Eye className="w-4 h-4 text-green-500" />}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => deletePost(post.id)}
                    disabled={deleting === post.id}
                    title="Delete"
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    {deleting === post.id
                      ? <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                      : <Trash2 className="w-4 h-4 text-red-400" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
