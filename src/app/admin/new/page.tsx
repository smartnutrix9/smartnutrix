"use client";
// src/app/admin/new/page.tsx
// Create new blog post with rich text editor

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Loader2, Image as ImageIcon, Plus, X } from "lucide-react";
import dynamic from "next/dynamic";

// Load rich text editor dynamically (only in browser)
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

// Rich text editor toolbar options
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

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) {
      router.push("/admin/login");
      return;
    }
    setToken(savedToken);
    fetchCategories(savedToken);
  }, [router]);

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

    // Strip HTML tags for word count
    const plainText = content.replace(/<[^>]*>/g, "");

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content,
          excerpt: excerpt.trim() || plainText.substring(0, 160),
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

  // Generate slug preview
  const slugPreview = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Word count from content
  const plainText = content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="btn-outline text-sm py-2 px-4 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
              Publish
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt (short summary for blog listing)
              </label>
              <textarea
                placeholder="A brief summary of your article (1-2 sentences)..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full outline-none text-gray-700 placeholder-gray-300 resize-none text-sm"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
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
              <div className="text-xs text-gray-400 mt-2">
                {wordCount} words · ~{readTime} min read
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
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

              {/* Add new category */}
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
                  <button
                    onClick={addCategory}
                    disabled={addingCategory}
                    className="btn-primary text-xs py-2 px-3"
                  >
                    {addingCategory ? <Loader2 className="w-3 h-3 animate-spin" /> : "Add"}
                  </button>
                  <button
                    onClick={() => { setShowNewCategory(false); setNewCategoryName(""); }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowNewCategory(true)}
                  className="mt-2 flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700"
                  style={{color: '#1D9E75'}}
                >
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
              <p className="text-xs text-gray-400 mt-2">
                Paste a Cloudinary or any image URL
              </p>
            </div>

            {/* SEO */}
            <div className="card">
              <h3 className="text-sm font-medium text-gray-700 mb-3">SEO Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Meta Title</label>
                  <input
                    type="text"
                    placeholder="SEO title (defaults to post title)"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="search-input text-sm py-2"
                  />
                  <div className="text-xs text-gray-400 mt-1">{(metaTitle || title).length}/60</div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Meta Description</label>
                  <textarea
                    placeholder="SEO description (defaults to excerpt)"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    className="search-input text-sm py-2 resize-none"
                  />
                  <div className="text-xs text-gray-400 mt-1">{(metaDescription || excerpt).length}/160</div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="card bg-blue-50">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Writing Tips</h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Use H2 for main sections, H3 for subsections</li>
                <li>• Keep paragraphs short (2-3 sentences)</li>
                <li>• Add images to break up text</li>
                <li>• Include an excerpt for better SEO</li>
                <li>• Meta description under 160 characters</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}