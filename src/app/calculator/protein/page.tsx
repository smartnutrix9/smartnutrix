"use client";
// src/app/calculator/protein/page.tsx
// Daily Protein Intake Calculator

import { useState } from "react";
import { TrendingUp } from "lucide-react";

type Unit = "metric" | "imperial";
type Goal = "sedentary" | "maintain" | "lose" | "gain" | "athlete";

interface ProteinResult {
  minProtein: number;
  maxProtein: number;
  recommended: number;
  goalLabel: string;
  perMeal: number; // if eating 3 meals
}

export default function ProteinCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [result, setResult] = useState<ProteinResult | null>(null);

  function calculate() {
    let weightKg = parseFloat(weight);

    if (unit === "imperial") {
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (!weightKg || weightKg <= 0) return;

    // Protein requirements based on goal (grams per kg body weight)
    const proteinRanges = {
      sedentary: { min: 0.8, max: 1.0, label: "Sedentary / Minimal Activity" },
      maintain: { min: 1.2, max: 1.6, label: "Maintain Weight & Health" },
      lose: { min: 1.6, max: 2.2, label: "Weight Loss (preserve muscle)" },
      gain: { min: 1.6, max: 2.4, label: "Muscle Gain / Bulking" },
      athlete: { min: 2.0, max: 2.6, label: "Athlete / Intense Training" }
    }[goal];

    const minProtein = Math.round(weightKg * proteinRanges.min);
    const maxProtein = Math.round(weightKg * proteinRanges.max);
    const recommended = Math.round((minProtein + maxProtein) / 2);
    const perMeal = Math.round(recommended / 3);

    setResult({
      minProtein,
      maxProtein,
      recommended,
      goalLabel: proteinRanges.label,
      perMeal
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-7 h-7 text-brand-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Protein Intake Calculator</h1>
        <p className="text-gray-500">Calculate your daily protein needs based on your fitness goals.</p>
      </div>

      {/* Unit toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6 w-fit mx-auto">
        <button
          onClick={() => setUnit("metric")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${unit === "metric" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
        >
          Metric (kg)
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${unit === "imperial" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
        >
          Imperial (lbs)
        </button>
      </div>

      {/* Inputs */}
      <div className="card mb-4">
        {/* Weight */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Body Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="search-input text-base py-3"
          />
        </div>

{/* Goal */}
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">Your Fitness Goal</label>
  <div className="space-y-2">
    {[
      { value: "sedentary", label: "Sedentary", desc: "Minimal physical activity" },
      { value: "maintain", label: "Maintain Health", desc: "General fitness & wellness" },
      { value: "lose", label: "Lose Weight", desc: "Fat loss while preserving muscle" },
      { value: "gain", label: "Build Muscle", desc: "Muscle gain & strength training" },
      { value: "athlete", label: "Athlete", desc: "Intense training or competition" }
    ].map((option) => (
      <button
        key={option.value}
        onClick={() => setGoal(option.value as Goal)}
        className={`w-full text-left p-3 rounded-lg transition-all border-2 ${
          goal === option.value
            ? "border-brand-500 bg-brand-50"
            : "border-gray-200 bg-white hover:border-brand-300"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className={`font-medium text-sm ${goal === option.value ? "text-brand-700" : "text-gray-900"}`}>
              {option.label}
            </div>
            <div className="text-xs mt-0.5 text-gray-500">
              {option.desc}
            </div>
          </div>
          {goal === option.value && (
            <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✓</span>
            </div>
          )}
        </div>
      </button>
    ))}
  </div>
</div>

        <button onClick={calculate} className="btn-primary w-full justify-center">
          Calculate Protein Needs
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Main Result */}
          <div className="card bg-gradient-to-r from-brand-50 to-green-50 mb-4 text-center">
            <div className="text-sm text-brand-600 font-medium mb-1">{result.goalLabel}</div>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-3xl font-bold text-brand-900">{result.minProtein}</div>
              <div className="text-2xl text-brand-600">–</div>
              <div className="text-3xl font-bold text-brand-900">{result.maxProtein}</div>
              <div className="text-lg text-brand-700">g</div>
            </div>
            <div className="text-sm text-brand-700 mb-3">protein per day</div>
            <div className="inline-block bg-white px-4 py-2 rounded-full">
              <span className="text-xs text-brand-600 font-medium">Recommended: </span>
              <span className="text-lg font-bold text-brand-900">{result.recommended}g</span>
              <span className="text-xs text-brand-600"> /day</span>
            </div>
          </div>

          {/* Per Meal Breakdown */}
          <div className="card bg-blue-50 mb-4">
            <h3 className="font-semibold text-blue-900 mb-3 text-center">Split Across 3 Meals</h3>
            <div className="flex items-center justify-center gap-4">
              {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                <div key={meal} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 shadow-sm">
                    <span className="text-xl font-bold text-blue-600">{result.perMeal}g</span>
                  </div>
                  <div className="text-xs font-medium text-blue-700">{meal}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Protein Sources */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">🥩 High Protein Foods</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Chicken Breast", protein: "31g", per: "100g" },
                { name: "Greek Yogurt", protein: "10g", per: "100g" },
                { name: "Eggs", protein: "13g", per: "2 eggs" },
                { name: "Lentils (Dal)", protein: "9g", per: "100g" },
                { name: "Paneer", protein: "18g", per: "100g" },
                { name: "Tofu", protein: "8g", per: "100g" },
                { name: "Almonds", protein: "21g", per: "100g" },
                { name: "Chickpeas", protein: "9g", per: "100g" }
              ].map((food) => (
                <div key={food.name} className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{food.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    <span className="font-semibold text-brand-600">{food.protein}</span> per {food.per}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="card mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Protein Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-500 flex-shrink-0">•</span>
                <span>Spread protein intake evenly throughout the day</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 flex-shrink-0">•</span>
                <span>Eat protein within 2 hours after strength training</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 flex-shrink-0">•</span>
                <span>Combine plant proteins (rice + dal) for complete amino acids</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 flex-shrink-0">•</span>
                <span>Choose lean protein sources to control fat intake</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-500 flex-shrink-0">•</span>
                <span>Include protein in breakfast to reduce hunger all day</span>
              </li>
            </ul>
          </div>

          {/* Calculation info */}
          <div className="card mt-4 bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-2 text-sm">How we calculated this:</h3>
            <p className="text-xs text-gray-600">
              Based on your goal (<strong>{result.goalLabel}</strong>), we recommend{" "}
              <strong>{Math.round((result.minProtein / parseFloat(weight)) * 10) / 10}–
              {Math.round((result.maxProtein / parseFloat(weight)) * 10) / 10}g per kg</strong> of body weight.
              Research shows this range optimally supports your fitness objectives.
            </p>
          </div>
        </>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        Protein recommendations are based on current sports nutrition research. Individual needs may vary. Consult a healthcare provider or dietitian for personalized advice.
      </p>
    </div>
  );
}