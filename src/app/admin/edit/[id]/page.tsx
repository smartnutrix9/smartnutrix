"use client";
// src/app/admin/edit/[id]/page.tsx
// Edit blog post with rich text editor + HTML toggle

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2, Image as ImageIcon, Trash2, Plus, X, Code, Type } from "lucide-react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [editorMode, setEditorMode] = useState<"visual" | "html">("visual");
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      router.push("/admin/login");
      return;
    }
    setToken(savedToken);
    fetchCategories(savedToken);
    fetchPost(savedToken);
  }, [router, id]);

  async function fetchCategories(authToken: string) {
    try {
      const res = await fetch("/api/admin/categories", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error("Fetch categories error:", err);
    }
  }

  async function fetchPost(authToken: string) {
    try {
      const res = await fetch("/api/admin/posts", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
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
          setMetaDescription(post.meta_description || "");
          setPublished(post.published || false);
        } else {
          setError("Post not found");
        }
      }
    } catch {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  }

  async function addCategory() {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories([...categories, data.category]);
        setCategoryId(data.category.id);
        setNewCategoryName("");
        setShowNewCategory(false);
      }
    } catch (err) {
      console.error("Add category error:", err);
    } finally {
      setAddingCategory(false);
    }
  }

  async function handleSave(publish: boolean) {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim() || content === "<p><br></p>") {
      setError("Content is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          title: title.trim(),
          content: content,
          excerpt: excerpt.trim() || content.replace(/<[^>]*>/g, "").substring(0, 160),
          category_id: categoryId || undefined,
          cover_image: coverImage.trim() || undefined,
          published: publish,
          meta_title: metaTitle.trim() || undefined,
          meta_description: metaDescription.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "Failed to save post");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) router.push("/admin");
    } catch {
      setError("Failed to delete post");
    }
  }

  const slugPreview = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const plainText = content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading post...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={handleDelete} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 px-3 py-2">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline text-sm py-2 px-4 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary text-sm py-2 px-4 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              {published ? "Update & Publish" : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Title */}
            <div className="card">
              <input
                type="text"
                placeholder="Post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl font-bold outline-none text-gray-900 placeholder-gray-300"
              />
              {slugPreview && (
                <div className="text-xs text-gray-400 mt-2">
                  URL: smartnutrix.com/blog/<span className="text-gray-600">{slugPreview}</span>
                </div>
              )}
            </div>

            {/* Excerpt */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                placeholder="A brief summary of your article..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full outline-none text-gray-700 placeholder-gray-300 resize-none text-sm"
              />
            </div>

            {/* Content Editor with Toggle */}
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setEditorMode("visual")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      editorMode === "visual" ? "bg-white shadow text-gray-900" : "text-gray-500"
                    }`}
                  >
                    <Type className="w-3 h-3" /> Visual
                  </button>
                  <button
                    onClick={() => setEditorMode("html")}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      editorMode === "html" ? "bg-white shadow text-gray-900" : "text-gray-500"
                    }`}
                  >
                    <Code className="w-3 h-3" /> HTML
                  </button>
                </div>
              </div>

              {editorMode === "visual" ? (
                <div className="bg-white rounded-lg" style={{ minHeight: "400px" }}>
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={quillModules}
                    placeholder="Write your article here..."
                    style={{ height: "350px", marginBottom: "42px" }}
                  />
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste HTML content here..."
                  className="w-full outline-none resize-none text-sm font-mono leading-relaxed border border-gray-200 rounded-lg p-4"
                  style={{ minHeight: "400px", backgroundColor: '#1f2937', color: '#10b981' }}
                />
              )}

              <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
                <span>{wordCount} words · ~{readTime} min read</span>
                <span>{editorMode === "visual" ? "Visual Editor" : "HTML Editor"} — Switch anytime</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className={`text-center py-3 rounded-lg font-medium text-sm ${published ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {published ? "✅ Published" : "📝 Draft"}
              </div>
            </div>

            {/* Category */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="search-input text-sm py-2"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              {showNewCategory ? (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="search-input text-sm py-2 flex-1"
                    autoFocus
                  />
                  <button onClick={addCategory} disabled={addingCategory} className="btn-primary text-xs py-2 px-3">
                    {addingCategory ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
                  </button>
                  <button onClick={() => { setShowNewCategory(false); setNewCategoryName(""); }} className="p-2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowNewCategory(true)} className="mt-2 flex items-center gap-1 text-xs hover:opacity-80" style={{color: '#1D9E75'}}>
                  <Plus className="w-3 h-3" /> Add new category
                </button>
              )}
            </div>

            {/* Cover Image */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-1" />
                Cover Image URL
              </label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="search-input text-sm py-2"
              />
              {coverImage && (
                <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                  <img src={coverImage} alt="Cover preview" className="w-full h-32 object-cover" />
                </div>
              )}
            </div>

            {/* SEO */}
            <div className="card">
              <h3 className="text-sm font-medium text-gray-700 mb-3">SEO Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Meta Title</label>
                  <input
                    type="text"
                    placeholder="SEO title"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="search-input text-sm py-2"
                  />
                  <div className="text-xs text-gray-400 mt-1">{(metaTitle || title).length}/60</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
                  <textarea
                    placeholder="SEO description"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    className="search-input text-sm py-2 resize-none"
                  />
                  <div className="text-xs text-gray-400 mt-1">{(metaDescription || excerpt).length}/160</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}