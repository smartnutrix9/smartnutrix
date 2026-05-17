"use client";
// src/app/admin/shop/page.tsx
// Admin Shop Management

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, Edit, Trash2, Loader2, ShoppingBag,
  Settings, Star, X, Save, Eye, EyeOff, Image as ImageIcon
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  product_type: string;
  price_usd: number;
  price_inr: number;
  amazon_url_usa: string;
  amazon_url_india: string;
  rating: number;
  review_count: number;
  featured: boolean;
  active: boolean;
  sort_order: number;
}

interface ShopSettings {
  shop_enabled: string;
  shop_default_country: string;
  shop_amazon_tag_usa: string;
  shop_amazon_tag_india: string;
}

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopSettings>({
    shop_enabled: "true",
    shop_default_country: "usa",
    shop_amazon_tag_usa: "",
    shop_amazon_tag_india: "",
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "settings">("products");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  // Product form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formCategory, setFormCategory] = useState("Protein Supplements");
  const [formType, setFormType] = useState("physical");
  const [formPriceUsd, setFormPriceUsd] = useState("");
  const [formPriceInr, setFormPriceInr] = useState("");
  const [formAmazonUsa, setFormAmazonUsa] = useState("");
  const [formAmazonIndia, setFormAmazonIndia] = useState("");
  const [formRating, setFormRating] = useState("4.0");
  const [formReviews, setFormReviews] = useState("0");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formCountry, setFormCountry] = useState<"usa" | "india">("usa");

  const categories = [
    "Protein Supplements", "Vitamins & Minerals", "Kitchen Tools",
    "Fitness Equipment", "Health Books", "Meal Plans (Digital)",
    "Healthy Snacks", "Cooking Essentials"
  ];

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (!savedToken) { router.push("/admin/login"); return; }
    setToken(savedToken);
    fetchProducts(savedToken);
    fetchSettings(savedToken);
  }, [router]);

  async function fetchProducts(authToken: string) {
    try {
      const res = await fetch("/api/admin/shop/products", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function fetchSettings(authToken: string) {
    try {
      const res = await fetch("/api/admin/shop/settings", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.success) setSettings({ ...settings, ...data.settings });
    } catch (err) { console.error(err); }
  }

  async function updateSetting(key: string, value: string) {
    try {
      await fetch("/api/admin/shop/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ key, value }),
      });
      setSettings({ ...settings, [key]: value });
    } catch (err) { console.error(err); }
  }

  function resetForm() {
    setFormTitle(""); setFormDescription(""); setFormImage("");
    setFormCategory("Protein Supplements"); setFormType("physical");
    setFormPriceUsd(""); setFormPriceInr("");
    setFormAmazonUsa(""); setFormAmazonIndia("");
    setFormRating("4.0"); setFormReviews("0"); setFormFeatured(false);
    setFormCountry("usa");
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormTitle(product.title);
    setFormDescription(product.description || "");
    setFormImage(product.image_url || "");
    setFormCategory(product.category);
    setFormType(product.product_type);
    setFormPriceUsd(product.price_usd?.toString() || "");
    setFormPriceInr(product.price_inr?.toString() || "");
    setFormAmazonUsa(product.amazon_url_usa || "");
    setFormAmazonIndia(product.amazon_url_india || "");
    setFormRating(product.rating?.toString() || "4.0");
    setFormReviews(product.review_count?.toString() || "0");
    setFormFeatured(product.featured);
    setShowAddProduct(true);
  }

  async function saveProduct() {
    if (!formTitle.trim()) return;
    setSaving(true);

    const productData = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      image_url: formImage.trim(),
      category: formCategory,
      product_type: formType,
      price_usd: formPriceUsd ? parseFloat(formPriceUsd) : null,
      price_inr: formPriceInr ? parseFloat(formPriceInr) : null,
      amazon_url_usa: formAmazonUsa.trim(),
      amazon_url_india: formAmazonIndia.trim(),
      rating: parseFloat(formRating) || 0,
      review_count: parseInt(formReviews) || 0,
      featured: formFeatured,
    };

    try {
      if (editingProduct) {
        const res = await fetch("/api/admin/shop/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: editingProduct.id, ...productData }),
        });
        const data = await res.json();
        if (data.success) {
          setProducts(products.map(p => p.id === editingProduct.id ? data.product : p));
        }
      } else {
        const res = await fetch("/api/admin/shop/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(productData),
        });
        const data = await res.json();
        if (data.success) {
          setProducts([...products, data.product]);
        }
      }
      setShowAddProduct(false);
      setEditingProduct(null);
      resetForm();
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/shop/products?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProducts(products.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
    finally { setDeleting(null); }
  }

  async function toggleActive(product: Product) {
    try {
      const res = await fetch("/api/admin/shop/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: product.id, active: !product.active }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p.id === product.id ? { ...p, active: !p.active } : p));
      }
    } catch (err) { console.error(err); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading SmartNutrix Shop...
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
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "products" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <ShoppingBag className="w-4 h-4 inline mr-1" /> Products
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "settings" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              <Settings className="w-4 h-4 inline mr-1" /> Settings
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop Settings</h2>

            {/* Shop Toggle */}
            <div className="card flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Shop Enabled</div>
                <div className="text-sm text-gray-500">Turn the entire shop on or off</div>
              </div>
              <button
                onClick={() => updateSetting("shop_enabled", settings.shop_enabled === "true" ? "false" : "true")}
                className={`w-14 h-7 rounded-full transition-all relative ${settings.shop_enabled === "true" ? "bg-green-500" : "bg-gray-300"}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow ${settings.shop_enabled === "true" ? "right-1" : "left-1"}`} />
              </button>
            </div>

            {/* Default Country */}
            <div className="card flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Default Country</div>
                <div className="text-sm text-gray-500">Which shop page shows first</div>
              </div>
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => updateSetting("shop_default_country", "usa")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${settings.shop_default_country === "usa" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                >
                  🇺🇸 USA
                </button>
                <button
                  onClick={() => updateSetting("shop_default_country", "india")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${settings.shop_default_country === "india" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                >
                  🇮🇳 India
                </button>
              </div>
            </div>

            {/* Amazon Tags */}
            <div className="card space-y-4">
              <div className="font-medium text-gray-900">Amazon Affiliate Tags</div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">USA Affiliate Tag</label>
                <input
                  type="text"
                  placeholder="e.g. smartnutrix-20"
                  value={settings.shop_amazon_tag_usa}
                  onChange={(e) => setSettings({ ...settings, shop_amazon_tag_usa: e.target.value })}
                  onBlur={() => updateSetting("shop_amazon_tag_usa", settings.shop_amazon_tag_usa)}
                  className="search-input text-sm py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">India Affiliate Tag</label>
                <input
                  type="text"
                  placeholder="e.g. smartnutrix-21"
                  value={settings.shop_amazon_tag_india}
                  onChange={(e) => setSettings({ ...settings, shop_amazon_tag_india: e.target.value })}
                  onBlur={() => updateSetting("shop_amazon_tag_india", settings.shop_amazon_tag_india)}
                  className="search-input text-sm py-2"
                />
              </div>
              <p className="text-xs text-gray-400">
                Get your affiliate tags from Amazon Associates (USA: affiliate-program.amazon.com, India: affiliate-program.amazon.in)
              </p>
            </div>

            {/* Preview Link */}
            <div className="card bg-blue-50">
              <div className="text-sm text-blue-800">
                <strong>Preview your shop:</strong>{" "}
                <Link href="/shop" target="_blank" className="underline" style={{color: '#1D9E75'}}>
                  smartnutrix.com/shop
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Products ({products.length})
              </h2>
              <button
                onClick={() => { resetForm(); setEditingProduct(null); setShowAddProduct(true); }}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            {/* Add/Edit Product Form */}
            {showAddProduct && (
              <div className="card mb-6 border-2 border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Country Toggle for Form */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-4">
                  <button
                    onClick={() => setFormCountry("usa")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${formCountry === "usa" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                  >
                    🇺🇸 USA
                  </button>
                  <button
                    onClick={() => setFormCountry("india")}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${formCountry === "india" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
                  >
                    🇮🇳 India
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Title *</label>
                    <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g. Optimum Nutrition Whey Protein" className="search-input text-sm py-2" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Short product description..." rows={2} className="search-input text-sm py-2 resize-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)} className="search-input text-sm py-2">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                    <select value={formType} onChange={(e) => setFormType(e.target.value)} className="search-input text-sm py-2">
                      <option value="physical">Physical Product</option>
                      <option value="digital">Digital Product</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <ImageIcon className="w-3 h-3 inline mr-1" /> Image URL
                    </label>
                    <input type="text" value={formImage} onChange={(e) => setFormImage(e.target.value)} placeholder="https://..." className="search-input text-sm py-2" />
                  </div>

                  {formImage && (
                    <div className="flex items-center">
                      <img src={formImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border" />
                    </div>
                  )}

                  {/* Country-specific fields */}
                  {formCountry === "usa" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🇺🇸 Price USD ($)</label>
                        <input type="number" step="0.01" value={formPriceUsd} onChange={(e) => setFormPriceUsd(e.target.value)} placeholder="29.99" className="search-input text-sm py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🇺🇸 Amazon USA Link</label>
                        <input type="text" value={formAmazonUsa} onChange={(e) => setFormAmazonUsa(e.target.value)} placeholder="https://amazon.com/dp/..." className="search-input text-sm py-2" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🇮🇳 Price INR (₹)</label>
                        <input type="number" step="0.01" value={formPriceInr} onChange={(e) => setFormPriceInr(e.target.value)} placeholder="2499" className="search-input text-sm py-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">🇮🇳 Amazon India Link</label>
                        <input type="text" value={formAmazonIndia} onChange={(e) => setFormAmazonIndia(e.target.value)} placeholder="https://amazon.in/dp/..." className="search-input text-sm py-2" />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
                    <input type="number" step="0.1" min="0" max="5" value={formRating} onChange={(e) => setFormRating(e.target.value)} className="search-input text-sm py-2" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Review Count</label>
                    <input type="number" value={formReviews} onChange={(e) => setFormReviews(e.target.value)} placeholder="1250" className="search-input text-sm py-2" />
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={formFeatured} onChange={(e) => setFormFeatured(e.target.checked)} id="featured" className="w-4 h-4" />
                    <label htmlFor="featured" className="text-sm text-gray-700">
                      <Star className="w-4 h-4 inline mr-1 text-amber-500" /> Featured Product
                    </label>
                  </div>
                </div>

                {/* Info about other country */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                  💡 Switch to {formCountry === "usa" ? "🇮🇳 India" : "🇺🇸 USA"} tab to add {formCountry === "usa" ? "INR price and Amazon India" : "USD price and Amazon USA"} link for this product. You can add both country details by switching tabs before saving.
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t">
                  <button onClick={saveProduct} disabled={saving} className="btn-primary">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingProduct ? "Update Product" : "Add Product"}
                  </button>
                  <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); resetForm(); }} className="btn-outline">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            {products.length === 0 ? (
              <div className="card text-center py-16">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No products yet</h3>
                <p className="text-gray-400 mb-6">Add your first product to get started!</p>
                <button onClick={() => { resetForm(); setShowAddProduct(true); }} className="btn-primary">
                  <Plus className="w-4 h-4" /> Add First Product
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="card flex items-center gap-4 p-4 hover:shadow-md transition-shadow">
                    {/* Image */}
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{product.title}</h3>
                        {product.featured && <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                        {product.active ? (
                          <span className="badge-green text-xs">Active</span>
                        ) : (
                          <span className="badge-yellow text-xs">Hidden</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">{product.category}</span>
                        <span>{product.product_type === "digital" ? "📱 Digital" : "📦 Physical"}</span>
                        {product.price_usd && <span>${product.price_usd}</span>}
                        {product.price_inr && <span>₹{product.price_inr}</span>}
                        {product.rating > 0 && <span>⭐ {product.rating} ({product.review_count})</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleActive(product)} className="p-2 rounded-lg hover:bg-gray-100" title={product.active ? "Hide" : "Show"}>
                        {product.active ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-green-500" />}
                      </button>
                      <button onClick={() => openEditForm(product)} className="p-2 rounded-lg hover:bg-gray-100" title="Edit">
                        <Edit className="w-4 h-4 text-blue-500" />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} disabled={deleting === product.id} className="p-2 rounded-lg hover:bg-red-50" title="Delete">
                        {deleting === product.id ? <Loader2 className="w-4 h-4 text-red-400 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-400" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}