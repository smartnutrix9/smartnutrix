"use client";
// src/app/admin/page.tsx
// Admin Dashboard - Manage blog posts

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Leaf, Plus, Edit, Trash2, Eye, EyeOff,
  FileText, LogOut, Loader2, LayoutDashboard
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
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      router.push("/admin/login");
      return;
    }
    setToken(savedToken);
    fetchPosts(savedToken);
  }, [router]);

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
        setPosts(posts.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
      }
    } catch (err) {
      console.error("Toggle publish error:", err);
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Are you sure you want to delete this post?")) return;
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
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading SmartNutrix Dashboard...
      </div>
    );
  }

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#1D9E75'}}>
              <Leaf className="w-5 h-5" style={{color: 'white'}} />
            </div>
            <div>
              <span className="font-bold text-gray-900">Smart<span style={{color: '#0F6E56'}}>Nutrix</span></span>
              <span className="text-xs text-gray-400 ml-2">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              View Site →
            </Link>
            <button onClick={logout} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-gray-900">{posts.length}</div>
            <div className="text-sm text-gray-500 mt-1">Total Posts</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold" style={{color: '#1D9E75'}}>{publishedCount}</div>
            <div className="text-sm text-gray-500 mt-1">Published</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-amber-600">{draftCount}</div>
            <div className="text-sm text-gray-500 mt-1">Drafts</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-600">{totalViews}</div>
            <div className="text-sm text-gray-500 mt-1">Total Views</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            Blog Posts
          </h1>
          <div className="flex items-center gap-3">
              <Link href="/admin/categories" className="btn-outline text-sm py-2 px-4">
                Manage Categories
              </Link>
              <Link href="/admin/new" className="btn-primary">
              <Plus className="w-4 h-4" /> New Post
              </Link>
          </div>
        </div>

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="card text-center py-16">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No blog posts yet</h3>
            <p className="text-gray-400 mb-6">Create your first blog post to get started!</p>
            <Link href="/admin/new" className="btn-primary">
              <Plus className="w-4 h-4" /> Create First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="card flex items-center justify-between p-4 hover:shadow-md transition-shadow">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                    {post.published ? (
                      <span className="badge-green text-xs">Published</span>
                    ) : (
                      <span className="badge-yellow text-xs">Draft</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {post.blog_categories && (
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{
                        backgroundColor: post.blog_categories.color + '20',
                        color: post.blog_categories.color
                      }}>
                        {post.blog_categories.name}
                      </span>
                    )}
                    <span>{formatDate(post.created_at)}</span>
                    <span>{post.read_time} min read</span>
                    <span>{post.views || 0} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  {/* Toggle Publish */}
                  <button
                    onClick={() => togglePublish(post)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? (
                      <EyeOff className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-green-500" />
                    )}
                  </button>

                  {/* Edit */}
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Link>

                  {/* Preview */}
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Preview"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                    disabled={deleting === post.id}
                  >
                    {deleting === post.id ? (
                      <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-400" />
                    )}
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