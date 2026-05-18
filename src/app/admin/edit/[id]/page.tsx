"use client";
// src/app/admin/edit/[id]/page.tsx

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Trash2, Plus, X, Code, Type } from "lucide-react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface Category { id: string; name: string; slug: string; color: string; }

const quillModules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [title, setTitle]                           = useState("");
  const [content, setContent]                       = useState("");
  const [excerpt, setExcerpt]                       = useState("");
  const [categoryId, setCategoryId]                 = useState("");
  const [coverImage, setCoverImage]                 = useState("");
  const [metaTitle, setMetaTitle]                   = useState("");
  const [metaDesc, setMetaDesc]                     = useState("");
  const [published, setPublished]                   = useState(false);
  const [editorMode, setEditorMode]                 = useState<"visual"|"html">("visual");
  const [categories, setCategories]                 = useState<Category[]>([]);
  const [saving, setSaving]                         = useState(false);
  const [loading, setLoading]                       = useState(true);
  const [error, setError]                           = useState("");
  const [token, setToken]                           = useState("");
  const [showNewCat, setShowNewCat]                 = useState(false);
  const [newCatName, setNewCatName]                 = useState("");
  const [addingCat, setAddingCat]                   = useState(false);
  const [postImage1, setPostImage1]                 = useState("");
  const [postImage1UsaUrl, setPostImage1UsaUrl]     = useState("");
  const [postImage1IndiaUrl, setPostImage1IndiaUrl] = useState("");
  const [postImage2, setPostImage2]                 = useState("");
  const [postImage2UsaUrl, setPostImage2UsaUrl]     = useState("");
  const [postImage2IndiaUrl, setPostImage2IndiaUrl] = useState("");

  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (!t) { router.push("/admin/login"); return; }
    setToken(t);
    Promise.all([fetchCategories(t), fetchPost(t)]);
  }, [id]);

  async function fetchCategories(t: string) {
    try {
      const res = await fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch {}
  }

  // ✅ Fix: fetch all posts and find by id — no separate endpoint needed
  async function fetchPost(t: string) {
    try {
      const res = await fetch("/api/admin/posts", { headers: { Authorization: `Bearer ${t}` } });
      const data = await res.json();
      if (data.success) {
        const post = data.posts.find((p: any) => p.id === id);
        if (post) {
          setTitle(post.title || "");
          setContent(post.content || "");
          setExcerpt(post.excerpt || "");
          setCategoryId(post.category_id || "");
          setCoverImage(post.cover_image || "");
          setMetaTitle(post.meta_title || "");
          setMetaDesc(post.meta_description || "");
          setPublished(post.published || false);
          setPostImage1(post.post_image1 || "");
          setPostImage1UsaUrl(post.post_image1_usa_url || "");
          setPostImage1IndiaUrl(post.post_image1_india_url || "");
          setPostImage2(post.post_image2 || "");
          setPostImage2UsaUrl(post.post_image2_usa_url || "");
          setPostImage2IndiaUrl(post.post_image2_india_url || "");
        } else {
          setError("Post not found");
        }
      } else {
        setError("Failed to load post");
      }
    } catch {
      setError("Failed to load post");
    }
    setLoading(false);
  }

  async function addCategory() {
    if (!newCatName.trim()) return;
    setAddingCat(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newCatName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => [...prev, data.category]);
        setCategoryId(data.category.id);
        setNewCatName(""); setShowNewCat(false);
      }
    } catch {}
    setAddingCat(false);
  }

  async function handleSave(publish: boolean) {
    if (!title.trim()) { setError("Title is required"); return; }
    if (!content.trim()) { setError("Content is required"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id,
          title: title.trim(), content: content.trim(),
          excerpt: excerpt.trim(),
          category_id: categoryId || null,
          cover_image: coverImage.trim(),
          published: publish,
          meta_title: metaTitle.trim(),
          meta_description: metaDesc.trim(),
          post_image1: postImage1.trim(),
          post_image1_usa_url: postImage1UsaUrl.trim(),
          post_image1_india_url: postImage1IndiaUrl.trim(),
          post_image2: postImage2.trim(),
          post_image2_usa_url: postImage2UsaUrl.trim(),
          post_image2_india_url: postImage2IndiaUrl.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) router.push("/admin");
      else setError(data.error || "Failed to save");
    } catch { setError("Something went wrong"); }
    setSaving(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      router.push("/admin");
    } catch { setError("Failed to delete"); }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin" /> Loading post...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"><ArrowLeft className="w-5 h-5" /></Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {published ? "✅ Published" : "📝 Draft"}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="px-4 py-2 border border-red-200 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="px-4 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-50 flex items-center gap-2" style={{ backgroundColor: "#1D9E75" }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {published ? "Update & Publish" : "Publish"}
            </button>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Main content ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Title */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Title</label>
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full text-xl font-bold text-gray-900 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-300"
              />
            </div>

            {/* Excerpt — right after title */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">Excerpt</label>
              <textarea
                value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short description shown on blog listing page..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-3">Content</label>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setEditorMode("visual")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={editorMode === "visual" ? { backgroundColor: "#1D9E75", color: "white" } : { backgroundColor: "#f3f4f6", color: "#374151" }}>
                  <Type className="w-3.5 h-3.5" /> Visual
                </button>
                <button onClick={() => setEditorMode("html")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={editorMode === "html" ? { backgroundColor: "#1D9E75", color: "white" } : { backgroundColor: "#f3f4f6", color: "#374151" }}>
                  <Code className="w-3.5 h-3.5" /> HTML
                </button>
              </div>
              {editorMode === "visual" ? (
                <div style={{ minHeight: "520px" }}>
                  <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} style={{ height: "480px" }} />
                </div>
              ) : (
                <textarea
                  value={content} onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste HTML content here..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono resize-y outline-none focus:ring-2 focus:ring-green-500"
                  style={{ minHeight: "520px" }}
                />
              )}
            </div>
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="space-y-4">

            {/* Category */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {!showNewCat ? (
                <button onClick={() => setShowNewCat(true)} className="flex items-center gap-1 text-xs font-medium" style={{ color: "#1D9E75" }}>
                  <Plus className="w-3.5 h-3.5" /> Add new category
                </button>
              ) : (
                <div className="flex gap-2">
                  <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="Category name" className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none" />
                  <button onClick={addCategory} disabled={addingCat} className="px-2 py-1.5 rounded-lg text-xs text-white" style={{ backgroundColor: "#1D9E75" }}>{addingCat ? "..." : "Add"}</button>
                  <button onClick={() => setShowNewCat(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-3.5 h-3.5 text-gray-400" /></button>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Cover Image URL</label>
              <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              {coverImage && <img src={coverImage} alt="Cover preview" className="w-full h-32 object-cover rounded-lg" />}
            </div>

            {/* SEO — right after Cover Image */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">SEO</label>
              <div>
                <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Meta Title (shown in Google)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
                <p className="text-xs text-gray-400 mt-1">{metaTitle.length}/60 characters</p>
              </div>
              <div>
                <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} placeholder="Meta Description (shown in Google results)" rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none outline-none focus:ring-2 focus:ring-green-500" />
                <p className="text-xs text-gray-400 mt-1">{metaDesc.length}/160 characters</p>
              </div>
            </div>

            {/* Post Image 1 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Post Image 1 <span className="text-gray-300 font-normal normal-case">(mid-article)</span></label>
              <input type="url" value={postImage1} onChange={(e) => setPostImage1(e.target.value)} placeholder="Image URL..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              {postImage1 && <img src={postImage1} alt="Post image 1" className="w-full h-28 object-cover rounded-lg" />}
              <input type="url" value={postImage1UsaUrl} onChange={(e) => setPostImage1UsaUrl(e.target.value)} placeholder="🇺🇸 Amazon USA link..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              <input type="url" value={postImage1IndiaUrl} onChange={(e) => setPostImage1IndiaUrl(e.target.value)} placeholder="🇮🇳 Amazon India link (optional)..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Post Image 2 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide block">Post Image 2 <span className="text-gray-300 font-normal normal-case">(near end)</span></label>
              <input type="url" value={postImage2} onChange={(e) => setPostImage2(e.target.value)} placeholder="Image URL..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              {postImage2 && <img src={postImage2} alt="Post image 2" className="w-full h-28 object-cover rounded-lg" />}
              <input type="url" value={postImage2UsaUrl} onChange={(e) => setPostImage2UsaUrl(e.target.value)} placeholder="🇺🇸 Amazon USA link..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
              <input type="url" value={postImage2IndiaUrl} onChange={(e) => setPostImage2IndiaUrl(e.target.value)} placeholder="🇮🇳 Amazon India link (optional)..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
