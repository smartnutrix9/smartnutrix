"use client";
// src/app/food/[slug]/page.tsx
// Individual food nutrition details page

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, Share2, BookmarkPlus, Scale, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface NutritionData {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminC: number;
  vitaminA: number;
  vitaminD: number;
  cholesterol: number;
  saturatedFat: number;
  servingSize: number;
  servingUnit: string;
}

interface HealthScore {
  score: number;
  label: string;
  color: string;
  tips: string[];
}

// Progress bar for each nutrient
function NutrientBar({ label, value, unit, max, color = "bg-brand-400" }: {
  label: string; value: number; unit: string; max: number; color?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-3 py-2 border-b border-gray-50">
      <span className="text-sm text-gray-500 w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium text-gray-700 w-20 text-right">
        {value}{unit}
      </span>
    </div>
  );
}

function FoodContent() {
  const searchParams = useSearchParams();
  const fdcId        = searchParams.get("fdcId");

  const [nutrition,    setNutrition]    = useState<NutritionData | null>(null);
  const [healthScore,  setHealthScore]  = useState<HealthScore | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [servingGrams, setServingGrams] = useState(100);

  useEffect(() => {
    if (!fdcId) {
      setError("Food not found");
      setLoading(false);
      return;
    }

    fetch(`/api/food?fdcId=${fdcId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setNutrition(data.nutrition);
          setHealthScore(data.healthScore);
        } else {
          setError(data.error || "Failed to load nutrition data");
        }
      })
      .catch(() => setError("Something went wrong"))
      .finally(() => setLoading(false));
  }, [fdcId]);

  // Scale nutrition by serving size
  function scale(val: number) {
    return Math.round(((val * servingGrams) / 100) * 10) / 10;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
    SmartNutrix is fetching nutrition facts...
      </div>
    );
  }

  if (error || !nutrition) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{error}</h2>
        <Link href="/" className="btn-primary mt-4">Back to Search</Link>
      </div>
    );
  }

  const scoreColor = healthScore?.color === "green"
    ? "text-green-600 bg-green-50"
    : healthScore?.color === "red"
    ? "text-red-600 bg-red-50"
    : "text-amber-600 bg-amber-50";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>›</span>
        <span className="text-gray-600">{nutrition.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {nutrition.name}
          </h1>
          <p className="text-gray-400 text-sm">Nutrition facts per {servingGrams}g serving</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button className="p-2 rounded-xl border border-gray-200 hover:border-brand-300 hover:bg-brand-50 transition-colors" title="Save food">
            <BookmarkPlus className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors" title="Like">
            <Heart className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors" title="Share">
            <Share2 className="w-5 h-5 text-gray-500" />
          </button>
          <Link href={`/compare?a=${encodeURIComponent(nutrition.name)}`} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-colors">
            <Scale className="w-4 h-4" />
            Compare
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Left column — macros + serving selector */}
        <div className="md:col-span-1 space-y-4">

          {/* Health Score */}
          {healthScore && (
            <div className={`card text-center p-5 ${scoreColor}`}>
              <div className="text-5xl font-bold mb-1">{healthScore.score}</div>
              <div className="text-sm font-medium mb-1">/10 Health Score</div>
              <div className="font-semibold text-lg">{healthScore.label}</div>
              <div className="mt-3 text-xs opacity-75 space-y-1">
                {healthScore.tips.map((tip, i) => <div key={i}>• {tip}</div>)}
              </div>
            </div>
          )}

          {/* Serving size adjuster */}
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">Adjust Serving Size</h3>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={servingGrams}
                onChange={(e) => setServingGrams(Number(e.target.value))}
                className="flex-1"
                style={{accentColor: 'rgb(29 158 117)'}}
              />
              <span className="text-brand-600 font-bold w-16 text-right">{servingGrams}g</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[50, 100, 200].map((g) => (
                <button
                  key={g}
                  onClick={() => setServingGrams(g)}
                  className={`text-xs py-1.5 rounded-lg transition-colors ${
                    servingGrams === g
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-brand-50"
                  }`}
                >
                  {g}g
                </button>
              ))}
            </div>
          </div>

          {/* Macros cards */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Calories", value: scale(nutrition.calories), unit: "kcal", color: "text-orange-600 bg-orange-50" },
              { label: "Protein",  value: scale(nutrition.protein),  unit: "g",    color: "text-blue-600 bg-blue-50" },
              { label: "Carbs",    value: scale(nutrition.carbohydrates), unit: "g", color: "text-yellow-600 bg-yellow-50" },
              { label: "Fat",      value: scale(nutrition.fat),      unit: "g",    color: "text-red-600 bg-red-50" },
            ].map((m) => (
              <div key={m.label} className={`rounded-xl p-3 text-center ${m.color}`}>
                <div className="text-xl font-bold">{m.value}</div>
                <div className="text-xs font-medium opacity-75">{m.unit}</div>
                <div className="text-xs mt-0.5 font-medium">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — full nutrition table */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Nutrition Facts</h2>
            <p className="text-xs text-gray-400 mb-4">Per {servingGrams}g serving</p>

            <div className="space-y-0">
              <NutrientBar label="Fiber"        value={scale(nutrition.fiber)}        unit="g"  max={30}   color="bg-brand-400" />
              <NutrientBar label="Sugar"        value={scale(nutrition.sugar)}        unit="g"  max={50}   color="bg-amber-400" />
              <NutrientBar label="Sodium"       value={scale(nutrition.sodium)}       unit="mg" max={2300} color="bg-red-400" />
              <NutrientBar label="Potassium"    value={scale(nutrition.potassium)}    unit="mg" max={4700} color="bg-purple-400" />
              <NutrientBar label="Calcium"      value={scale(nutrition.calcium)}      unit="mg" max={1300} color="bg-blue-400" />
              <NutrientBar label="Iron"         value={scale(nutrition.iron)}         unit="mg" max={18}   color="bg-orange-400" />
              <NutrientBar label="Vitamin C"    value={scale(nutrition.vitaminC)}     unit="mg" max={90}   color="bg-yellow-400" />
              <NutrientBar label="Vitamin A"    value={scale(nutrition.vitaminA)}     unit="mcg" max={900} color="bg-green-400" />
              <NutrientBar label="Vitamin D"    value={scale(nutrition.vitaminD)}     unit="mcg" max={20}  color="bg-cyan-400" />
              <NutrientBar label="Cholesterol"  value={scale(nutrition.cholesterol)}  unit="mg" max={300}  color="bg-red-300" />
              <NutrientBar label="Saturated Fat" value={scale(nutrition.saturatedFat)} unit="g" max={20}   color="bg-red-400" />
            </div>

            {/* Add to meal log */}
            <div className="mt-6 flex gap-3">
              <button className="btn-primary flex-1 justify-center">
                + Add to Meal Log
              </button>
              <Link
                href={`/compare?a=${encodeURIComponent(nutrition.name)}`}
                className="btn-secondary flex-1 justify-center"
              >
                Compare Food
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center mt-8">
        Nutrition data sourced from USDA FoodData Central. Values are approximate and may vary.
        Not intended as medical advice.
      </p>
    </div>
  );
}

export default function FoodPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        Preparing SmartNutrix Nutrition Data...
      </div>
    }>
      <FoodContent />
    </Suspense>
  );
}