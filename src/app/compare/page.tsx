"use client";
// src/app/compare/page.tsx
// Food Comparison Page - Compare two foods side by side

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scale, Search, Loader2, ArrowRight } from "lucide-react";

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
}

interface SearchResult {
  fdcId: number;
  description: string;
  category?: string;
}

// Nutrient comparison bar
function CompareBar({ label, valA, valB, unit, max }: {
  label: string; valA: number; valB: number; unit: string; max: number;
}) {
  const pctA = Math.min(100, (valA / max) * 100);
  const pctB = Math.min(100, (valB / max) * 100);
  const winner = valA > valB ? "a" : valB > valA ? "b" : "tie";

  return (
    <div className="py-3 border-b border-gray-50">
      <div className="text-xs text-gray-500 text-center mb-2 font-medium">{label}</div>
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium w-20 text-right ${winner === "a" ? "text-green-600" : "text-gray-600"}`}>
          {valA}{unit}
        </span>
        <div className="flex-1 flex gap-1">
          <div className="flex-1 flex justify-end">
            <div className="h-3 rounded-l-full" style={{
              width: `${pctA}%`,
              backgroundColor: winner === "a" ? "#1D9E75" : "#d1d5db",
              minWidth: valA > 0 ? "4px" : "0"
            }} />
          </div>
          <div className="flex-1">
            <div className="h-3 rounded-r-full" style={{
              width: `${pctB}%`,
              backgroundColor: winner === "b" ? "#2563EB" : "#d1d5db",
              minWidth: valB > 0 ? "4px" : "0"
            }} />
          </div>
        </div>
        <span className={`text-sm font-medium w-20 ${winner === "b" ? "text-blue-600" : "text-gray-600"}`}>
          {valB}{unit}
        </span>
      </div>
    </div>
  );
}

// Search dropdown component
function FoodSearchInput({ label, color, onSelect }: {
  label: string; color: string; onSelect: (fdcId: number, name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState("");

  async function handleSearch(q: string) {
    setQuery(q);
    setSelected("");
    if (q.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=8`);
      const data = await res.json();
      if (data.success) {
        setResults(data.results);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function selectFood(food: SearchResult) {
    setSelected(food.description);
    setQuery(food.description);
    setShowDropdown(false);
    onSelect(food.fdcId, food.description);
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center gap-2 px-4 py-3 border-2 rounded-xl transition-all" style={{borderColor: selected ? color : '#e5e7eb'}}>
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search food..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          className="flex-1 outline-none text-gray-700 text-sm"
        />
        {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
      </div>
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
          {results.map((food) => (
            <button
              key={food.fdcId}
              onClick={() => selectFood(food)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors text-gray-700"
            >
              {food.description}
              {food.category && (
                <span className="text-xs text-gray-400 ml-2">({food.category})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Popular comparisons
const popularComparisons = [
  { a: "Paneer", b: "Tofu" },
  { a: "Idli", b: "Dosa" },
  { a: "Brown Rice", b: "White Rice" },
  { a: "Roti", b: "Naan" },
  { a: "Chicken Breast", b: "Paneer" },
  { a: "Ghee", b: "Butter" },
  { a: "Apple", b: "Banana" },
  { a: "Oats", b: "Cornflakes" },
];

export default function ComparePage() {
  const [foodA, setFoodA] = useState<NutritionData | null>(null);
  const [foodB, setFoodB] = useState<NutritionData | null>(null);
  const [nameA, setNameA] = useState("");
  const [nameB, setNameB] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchNutrition(fdcId: number): Promise<NutritionData | null> {
    try {
      const res = await fetch(`/api/food?fdcId=${fdcId}`);
      const data = await res.json();
      if (data.success) return data.nutrition;
      return null;
    } catch {
      return null;
    }
  }

  async function selectFoodA(fdcId: number, name: string) {
    setNameA(name);
    setLoading(true);
    const data = await fetchNutrition(fdcId);
    setFoodA(data);
    setLoading(false);
  }

  async function selectFoodB(fdcId: number, name: string) {
    setNameB(name);
    setLoading(true);
    const data = await fetchNutrition(fdcId);
    setFoodB(data);
    setLoading(false);
  }

  async function quickCompare(a: string, b: string) {
    setLoading(true);
    setNameA(a);
    setNameB(b);

    try {
      // Search for both foods
      const [resA, resB] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(a)}&limit=1`).then(r => r.json()),
        fetch(`/api/search?q=${encodeURIComponent(b)}&limit=1`).then(r => r.json()),
      ]);

      if (resA.success && resA.results.length > 0) {
        const dataA = await fetchNutrition(resA.results[0].fdcId);
        setFoodA(dataA);
        setNameA(resA.results[0].description);
      }
      if (resB.success && resB.results.length > 0) {
        const dataB = await fetchNutrition(resB.results[0].fdcId);
        setFoodB(dataB);
        setNameB(resB.results[0].description);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate winner summary
  function getWinnerSummary() {
    if (!foodA || !foodB) return null;
    let winsA = 0, winsB = 0;

    if (foodA.calories < foodB.calories) winsA++; else if (foodB.calories < foodA.calories) winsB++;
    if (foodA.protein > foodB.protein) winsA++; else if (foodB.protein > foodA.protein) winsB++;
    if (foodA.fiber > foodB.fiber) winsA++; else if (foodB.fiber > foodA.fiber) winsB++;
    if (foodA.sugar < foodB.sugar) winsA++; else if (foodB.sugar < foodA.sugar) winsB++;
    if (foodA.sodium < foodB.sodium) winsA++; else if (foodB.sodium < foodA.sodium) winsB++;

    return { winsA, winsB };
  }

  const winner = getWinnerSummary();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{backgroundColor: '#E1F5EE'}}>
          <Scale className="w-7 h-7" style={{color: '#1D9E75'}} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Food Comparison</h1>
        <p className="text-gray-500">Compare two foods side by side to see which is healthier</p>
      </div>

      {/* Search inputs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="card p-4" style={{borderTop: '3px solid #1D9E75'}}>
          <FoodSearchInput
            label="Food A"
            color="#1D9E75"
            onSelect={selectFoodA}
          />
        </div>
        <div className="card p-4" style={{borderTop: '3px solid #2563EB'}}>
          <FoodSearchInput
            label="Food B"
            color="#2563EB"
            onSelect={selectFoodB}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-10 gap-3 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading nutrition data...
        </div>
      )}

      {/* Comparison Results */}
      {foodA && foodB && !loading && (
        <div className="card mb-6">
          {/* Food names header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="text-center flex-1">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{backgroundColor: '#1D9E75'}} />
              <div className="font-semibold text-gray-900 text-sm">{nameA}</div>
              <div className="text-xs text-gray-400">per 100g</div>
            </div>
            <div className="text-gray-300 font-bold text-lg px-4">vs</div>
            <div className="text-center flex-1">
              <div className="w-3 h-3 rounded-full mx-auto mb-2" style={{backgroundColor: '#2563EB'}} />
              <div className="font-semibold text-gray-900 text-sm">{nameB}</div>
              <div className="text-xs text-gray-400">per 100g</div>
            </div>
          </div>

          {/* Macro cards */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Calories", a: foodA.calories, b: foodB.calories, unit: "kcal", lower: true },
              { label: "Protein", a: foodA.protein, b: foodB.protein, unit: "g", lower: false },
              { label: "Carbs", a: foodA.carbohydrates, b: foodB.carbohydrates, unit: "g", lower: true },
              { label: "Fat", a: foodA.fat, b: foodB.fat, unit: "g", lower: true },
            ].map((m) => {
              const aWins = m.lower ? m.a < m.b : m.a > m.b;
              const bWins = m.lower ? m.b < m.a : m.b > m.a;
              return (
                <div key={m.label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500 mb-2">{m.label}</div>
                  <div className={`text-lg font-bold ${aWins ? "text-green-600" : "text-gray-700"}`}>
                    {m.a}
                  </div>
                  <div className="text-xs text-gray-300 my-1">vs</div>
                  <div className={`text-lg font-bold ${bWins ? "text-blue-600" : "text-gray-700"}`}>
                    {m.b}
                  </div>
                  <div className="text-xs text-gray-400">{m.unit}</div>
                </div>
              );
            })}
          </div>

          {/* Detailed comparison bars */}
          <CompareBar label="Calories" valA={foodA.calories} valB={foodB.calories} unit="kcal" max={600} />
          <CompareBar label="Protein" valA={foodA.protein} valB={foodB.protein} unit="g" max={40} />
          <CompareBar label="Carbohydrates" valA={foodA.carbohydrates} valB={foodB.carbohydrates} unit="g" max={80} />
          <CompareBar label="Fat" valA={foodA.fat} valB={foodB.fat} unit="g" max={40} />
          <CompareBar label="Fiber" valA={foodA.fiber} valB={foodB.fiber} unit="g" max={15} />
          <CompareBar label="Sugar" valA={foodA.sugar} valB={foodB.sugar} unit="g" max={30} />
          <CompareBar label="Sodium" valA={foodA.sodium} valB={foodB.sodium} unit="mg" max={1000} />
          <CompareBar label="Potassium" valA={foodA.potassium} valB={foodB.potassium} unit="mg" max={1000} />
          <CompareBar label="Calcium" valA={foodA.calcium} valB={foodB.calcium} unit="mg" max={500} />
          <CompareBar label="Iron" valA={foodA.iron} valB={foodB.iron} unit="mg" max={10} />
          <CompareBar label="Vitamin C" valA={foodA.vitaminC} valB={foodB.vitaminC} unit="mg" max={100} />
          <CompareBar label="Cholesterol" valA={foodA.cholesterol} valB={foodB.cholesterol} unit="mg" max={200} />

          {/* Winner Summary */}
          {winner && (
            <div className="mt-6 p-4 rounded-xl" style={{backgroundColor: '#F0FDF9'}}>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900 mb-1">Healthier Choice</div>
                <div className="text-lg font-bold" style={{color: '#1D9E75'}}>
                  {winner.winsA > winner.winsB
                    ? `${nameA} wins ${winner.winsA}-${winner.winsB}`
                    : winner.winsB > winner.winsA
                    ? `${nameB} wins ${winner.winsB}-${winner.winsA}`
                    : "It's a tie!"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Based on lower calories, higher protein, more fiber, less sugar, less sodium
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Popular Comparisons */}
      {!foodA && !foodB && !loading && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Popular Comparisons</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {popularComparisons.map((comp) => (
              <button
                key={`${comp.a}-${comp.b}`}
                onClick={() => quickCompare(comp.a, comp.b)}
                className="p-3 rounded-xl border-2 border-gray-100 hover:border-green-200 transition-all text-center group"
              >
                <div className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                  {comp.a}
                </div>
                <div className="text-xs text-gray-400 my-1">vs</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-blue-700">
                  {comp.b}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-8">
        Nutrition data sourced from USDA FoodData Central. Values are per 100g serving. Results are for informational purposes only.
      </p>
    </div>
  );
}