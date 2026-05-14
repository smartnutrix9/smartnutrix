"use client";
// src/app/calculator/bmr/page.tsx
// BMR (Basal Metabolic Rate) Calculator

import { useState } from "react";
import { Activity } from "lucide-react";

type Unit = "metric" | "imperial";
type Gender = "male" | "female";

interface BMRResult {
  bmr: number;
  maintenance: number;
  mildLoss: number;
  weightLoss: number;
  extremeLoss: number;
  mildGain: number;
  weightGain: number;
  fastGain: number;
}

export default function BMRCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [activityLevel, setActivityLevel] = useState("1.2");
  const [result, setResult] = useState<BMRResult | null>(null);

  function calculate() {
    let weightKg = parseFloat(weight);
    let heightCm = parseFloat(height);
    const ageNum = parseFloat(age);

    if (unit === "imperial") {
      weightKg = parseFloat(weight) * 0.453592;
      const totalInches = (parseFloat(feet) * 12) + parseFloat(inches || "0");
      heightCm = totalInches * 2.54;
    }

    if (!weightKg || !heightCm || !ageNum || weightKg <= 0 || heightCm <= 0 || ageNum <= 0) return;

    // Harris-Benedict Equation
    let bmr: number;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageNum);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageNum);
    }

    const activityMultiplier = parseFloat(activityLevel);
    const maintenance = bmr * activityMultiplier;

    setResult({
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      mildLoss: Math.round(maintenance - 250),
      weightLoss: Math.round(maintenance - 500),
      extremeLoss: Math.round(maintenance - 1000),
      mildGain: Math.round(maintenance + 250),
      weightGain: Math.round(maintenance + 500),
      fastGain: Math.round(maintenance + 1000),
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity className="w-7 h-7 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BMR Calculator</h1>
        <p className="text-gray-500">Calculate your Basal Metabolic Rate and daily calorie needs.</p>
      </div>

      {/* Unit toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6 w-fit mx-auto">
        <button
          onClick={() => setUnit("metric")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${unit === "metric" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
        >
          Metric
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${unit === "imperial" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
        >
          Imperial
        </button>
      </div>

      {/* Inputs */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Gender */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
  <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
    <button
      onClick={() => setGender("male")}
      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${gender === "male" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
    >
      Male
    </button>
    <button
      onClick={() => setGender("female")}
      className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${gender === "female" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
    >
      Female
    </button>
  </div>
</div>

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age (years)</label>
            <input
              type="number"
              placeholder="e.g. 30"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="search-input text-base py-2"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <input
              type="number"
              placeholder={unit === "metric" ? "e.g. 70" : "e.g. 154"}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="search-input text-base py-2"
            />
          </div>

          {/* Height */}
          {unit === "metric" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
              <input
                type="number"
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="search-input text-base py-2"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Feet" value={feet} onChange={(e) => setFeet(e.target.value)} className="search-input text-base py-2" />
                <input type="number" placeholder="Inches" value={inches} onChange={(e) => setInches(e.target.value)} className="search-input text-base py-2" />
              </div>
            </div>
          )}
        </div>

        {/* Activity Level */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
            className="search-input text-base py-2"
          >
            <option value="1.2">Sedentary (little or no exercise)</option>
            <option value="1.375">Lightly active (1-3 days/week)</option>
            <option value="1.55">Moderately active (3-5 days/week)</option>
            <option value="1.725">Very active (6-7 days/week)</option>
            <option value="1.9">Super active (intense exercise daily)</option>
          </select>
        </div>

        <button onClick={calculate} className="btn-primary w-full justify-center mt-5">
          Calculate BMR
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* BMR Card */}
          <div className="card bg-gradient-to-r from-purple-50 to-blue-50 mb-4">
            <div className="text-center">
              <div className="text-sm text-purple-600 font-medium mb-1">Your Basal Metabolic Rate</div>
              <div className="text-5xl font-bold text-purple-900 mb-2">{result.bmr}</div>
              <div className="text-sm text-purple-700">calories/day at rest</div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="card bg-brand-50 mb-4 text-center">
            <div className="text-sm text-brand-700 font-medium mb-1">Maintenance Calories</div>
            <div className="text-4xl font-bold text-brand-900 mb-1">{result.maintenance}</div>
            <div className="text-sm text-brand-700">calories/day to maintain current weight</div>
          </div>

          {/* Weight Goals */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Weight Loss */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-red-500">↓</span> Weight Loss Goals
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mild loss (0.25 kg/week)</span>
                  <span className="font-bold text-gray-900">{result.mildLoss} cal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Weight loss (0.5 kg/week)</span>
                  <span className="font-bold text-gray-900">{result.weightLoss} cal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Extreme loss (1 kg/week)</span>
                  <span className="font-bold text-gray-900">{result.extremeLoss} cal</span>
                </div>
              </div>
            </div>

            {/* Weight Gain */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-green-500">↑</span> Weight Gain Goals
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mild gain (0.25 kg/week)</span>
                  <span className="font-bold text-gray-900">{result.mildGain} cal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Weight gain (0.5 kg/week)</span>
                  <span className="font-bold text-gray-900">{result.weightGain} cal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fast gain (1 kg/week)</span>
                  <span className="font-bold text-gray-900">{result.fastGain} cal</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        BMR calculations use the Harris-Benedict equation. Results are estimates. Consult a healthcare provider for personalized advice.
      </p>
    </div>
  );
}