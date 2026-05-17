"use client";
// src/app/shop/page.tsx
// Public Shopping Page

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Star, ExternalLink, Loader2, Filter } from "lucide-react";

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
}

interface ShopCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [country, setCountry] = useState<"usa" | "india">("usa");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    fetchShop();
  }, []);

  async function fetchShop() {
    try {
      const res = await fetch("/api/shop");
      const data = await res.json();
      if (data.success) {
        setEnabled(data.enabled);
        setProducts(data.products || []);
        setCategories(data.categories || []);
        if (data.settings?.shop_default_country) {
          setCountry(data.settings.shop_default_country as "usa" | "india");
        }
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function filterByCategory(categoryName: string) {
    setActiveCategory(categoryName);
    setLoading(true);
    try {
      const url = categoryName === "all" ? "/api/shop" : `/api/shop?category=${encodeURIComponent(categoryName)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setProducts(data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  function getPrice(product: Product) {
    if (country === "usa") return product.price_usd ? `$${product.price_usd}` : null;
    return product.price_inr ? `₹${product.price_inr}` : null;
  }

  function getAmazonLink(product: Product) {
    if (country === "usa") return product.amazon_url_usa;
    return product.amazon_url_india;
  }

  function renderStars(rating: number) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
        />
      );
    }
    return stars;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading SmartNutrix Shop...
      </div>
    );
  }

  // Shop Coming Soon
  if (!enabled) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#E1F5EE'}}>
          <ShoppingBag className="w-10 h-10" style={{color: '#1D9E75'}} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop Coming Soon!</h1>
        <p className="text-gray-500 text-lg mb-8">
          We're curating the best nutrition supplements, kitchen tools, and health products for you. Stay tuned!
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="btn-primary">Search Foods</Link>
          <Link href="/blog" className="btn-outline">Read Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#E1F5EE'}}>
          <ShoppingBag className="w-7 h-7" style={{color: '#1D9E75'}} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">SmartNutrix Shop</h1>
        <p className="text-gray-500">Recommended nutrition supplements, kitchen tools, and health essentials</p>
      </div>

      {/* Country Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          <button
            onClick={() => setCountry("usa")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${country === "usa" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
          >
            🇺🇸 USA
          </button>
          <button
            onClick={() => setCountry("india")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${country === "india" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
          >
            🇮🇳 India
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => filterByCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === "all" ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          style={activeCategory === "all" ? {backgroundColor: '#1D9E75'} : {}}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => filterByCategory(cat.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat.name ? "text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            style={activeCategory === cat.name ? {backgroundColor: '#1D9E75'} : {}}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {products.filter((product) => {
        if (country === "usa") return product.amazon_url_usa || product.price_usd;
        return product.amazon_url_india || product.price_inr;
      }).length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No products in this category</h3>
          <p className="text-gray-400">Check back soon or browse other categories!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.filter((product) => {
            if (country === "usa") return product.amazon_url_usa || product.price_usd;
            return product.amazon_url_india || product.price_inr;
          }).map((product) => {
            const price = getPrice(product);
            const link = getAmazonLink(product);

            return (
              <div key={product.id} className="card overflow-hidden p-0 hover:shadow-card transition-all group">
                {/* Image */}
                {product.image_url ? (
                  <div className="h-48 overflow-hidden bg-gray-50">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-50">
                    <ShoppingBag className="w-12 h-12 text-gray-200" />
                  </div>
                )}

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded-full text-white" style={{backgroundColor: '#1D9E75'}}>
                    ⭐ Featured
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  {/* Category & Type */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-400">{product.category}</span>
                    {product.product_type === "digital" && (
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full">Digital</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-snug line-clamp-2">
                    {product.title}
                  </h3>

                  {/* Description */}
                  {product.description && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                  )}

                  {/* Rating */}
                  {product.rating > 0 && (
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex">{renderStars(product.rating)}</div>
                      <span className="text-xs text-gray-500">
                        {product.rating} ({product.review_count?.toLocaleString()})
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  {price && (
                    <div className="text-xl font-bold text-gray-900 mb-3">{price}</div>
                  )}

                  {/* Buy Button */}
                  {link ? (
                    <a href={link} target="_blank" rel="noopener noreferrer nofollow" className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90" style={{backgroundColor: '#FF9900'}}>
                      Buy on Amazon <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl text-sm font-medium text-center bg-gray-100 text-gray-400">
                      {country === "usa" ? "Not available in USA" : "Not available in India"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-10 max-w-2xl mx-auto">
        SmartNutrix is a participant in the Amazon Associates Program. As an Amazon Associate, we earn from qualifying purchases. Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon at the time of purchase will apply.
      </p>
    </div>
  );
}