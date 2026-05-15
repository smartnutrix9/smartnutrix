"use client";
// src/app/admin/categories/page.tsx
// Manage blog categories

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Loader2, Tag, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
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
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addCategory() {
    if (!newName.trim()) return;
    setAdding(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories([...categories, data.category]);
        setNewName("");
        setShowAdd(false);
      }
    } catch (err) {
      console.error("Add error:", err);
    } finally {
      setAdding(false);
    }
  }

  async function deleteCategory(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? Posts using this category will become uncategorized.`)) return;
    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        Loading categories...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-6 h-6" />
            Blog Categories
          </h1>
          <button
            onClick={() => setShowAdd(true)}
            className="btn-primary text-sm"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Add new category */}
        {showAdd && (
          <div className="card mb-4 flex items-center gap-3">
            <input
              type="text"
              placeholder="New category name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="search-input text-sm py-2 flex-1"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
            />
            <button
              onClick={addCategory}
              disabled={adding}
              className="btn-primary text-sm py-2 px-4"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewName(""); }}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Categories list */}
        {categories.length === 0 ? (
          <div className="card text-center py-12">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No categories yet</h3>
            <p className="text-gray-400">Add categories to organize your blog posts.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="card flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">{cat.name}</div>
                    <div className="text-xs text-gray-400">/{cat.slug}</div>
                  </div>
                </div>
                <button
                  onClick={() => deleteCategory(cat.id, cat.name)}
                  disabled={deleting === cat.id}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete category"
                >
                  {deleting === cat.id ? (
                    <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-red-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}