"use client";
// src/app/calculator/water/page.tsx
// Daily Water Intake Calculator

import { useState } from "react";
import { Droplets } from "lucide-react";

type Unit = "metric" | "imperial";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
type Climate = "normal" | "hot" | "very_hot";

interface WaterResult {
  baseWater: number;
  totalWater: number;
  glasses: number; // 250ml glasses
  bottles: number; // 1L bottles
}

export default function WaterCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [climate, setClimate] = useState<Climate>("normal");
  const [result, setResult] = useState<WaterResult | null>(null);

  function calculate() {
    let weightKg = parseFloat(weight);

    if (unit === "imperial") {
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (!weightKg || weightKg <= 0) return;

    // Base water: 30-35ml per kg body weight
    let baseWater = weightKg * 33; // ml

    // Activity level adjustments
    const activityMultiplier = {
      sedentary: 1.0,
      light: 1.1,
      moderate: 1.2,
      active: 1.35,
      very_active: 1.5
    }[activityLevel];

    // Climate adjustments
    const climateAdd = {
      normal: 0,
      hot: 500,
      very_hot: 1000
    }[climate];

    const totalWater = Math.round((baseWater * activityMultiplier) + climateAdd);
    const glasses = Math.round(totalWater / 250); // 250ml glass
    const bottles = Math.round((totalWater / 1000) * 10) / 10; // 1L bottle

    setResult({
      baseWater: Math.round(baseWater),
      totalWater,
      glasses,
      bottles
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Droplets className="w-7 h-7 text-cyan-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Water Intake Calculator</h1>
        <p className="text-gray-500">Calculate your daily water requirement based on body weight and activity.</p>
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

        {/* Activity Level */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "sedentary", label: "Sedentary" },
              { value: "light", label: "Light" },
              { value: "moderate", label: "Moderate" },
              { value: "active", label: "Active" },
              { value: "very_active", label: "Very Active" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setActivityLevel(option.value as ActivityLevel)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activityLevel === option.value
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Climate */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Climate / Temperature</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "normal", label: "Normal" },
              { value: "hot", label: "Hot" },
              { value: "very_hot", label: "Very Hot" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setClimate(option.value as Climate)}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  climate === option.value
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={calculate} className="btn-primary w-full justify-center">
          Calculate Water Intake
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Main Result */}
          <div className="card bg-gradient-to-r from-cyan-50 to-blue-50 mb-4 text-center">
            <div className="text-sm text-cyan-600 font-medium mb-1">Your Daily Water Target</div>
            <div className="text-6xl font-bold text-cyan-900 mb-2">{result.totalWater}</div>
            <div className="text-sm text-cyan-700">milliliters per day</div>
          </div>

          {/* Visual breakdown */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Glasses */}
            <div className="card bg-blue-50 text-center">
              <div className="text-5xl mb-2">🥤</div>
              <div className="text-3xl font-bold text-blue-900 mb-1">{result.glasses}</div>
              <div className="text-sm text-blue-700">glasses (250ml each)</div>
            </div>

            {/* Bottles */}
            <div className="card bg-cyan-50 text-center">
              <div className="text-5xl mb-2">🧴</div>
              <div className="text-3xl font-bold text-cyan-900 mb-1">{result.bottles}</div>
              <div className="text-sm text-cyan-700">bottles (1 liter each)</div>
            </div>
          </div>

          {/* Tips */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">💧 Hydration Tips</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 flex-shrink-0">•</span>
                <span>Drink a glass of water first thing in the morning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 flex-shrink-0">•</span>
                <span>Carry a reusable water bottle with you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 flex-shrink-0">•</span>
                <span>Drink more during and after exercise</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 flex-shrink-0">•</span>
                <span>Set reminders on your phone to drink water</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 flex-shrink-0">•</span>
                <span>Increase intake in hot weather or at high altitudes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-500 flex-shrink-0">•</span>
                <span>Eat water-rich fruits and vegetables</span>
              </li>
            </ul>
          </div>

          {/* Breakdown */}
          <div className="card mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Calculation Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base water (weight × 33ml)</span>
                <span className="font-medium text-gray-900">{result.baseWater} ml</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Activity adjustment</span>
                <span className="font-medium text-cyan-600">
                  {activityLevel === "sedentary" ? "None" : 
                   activityLevel === "light" ? "+10%" :
                   activityLevel === "moderate" ? "+20%" :
                   activityLevel === "active" ? "+35%" : "+50%"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Climate adjustment</span>
                <span className="font-medium text-orange-600">
                  {climate === "normal" ? "None" : 
                   climate === "hot" ? "+500ml" : "+1000ml"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        Water intake recommendations are general guidelines. Individual needs vary based on health conditions, medications, and other factors. Consult a healthcare provider for personalized advice.
      </p>
    </div>
  );
}