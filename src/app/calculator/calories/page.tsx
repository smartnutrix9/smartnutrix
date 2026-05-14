"use client";
// src/app/calculator/calories/page.tsx
// Daily Calorie Calculator

import { useState } from "react";
import { Zap } from "lucide-react";

type Unit = "metric" | "imperial";
type Gender = "male" | "female";
type Goal = "maintain" | "loss" | "gain";

interface CalorieResult {
  bmr: number;
  maintenance: number;
  goal: number;
  goalLabel: string;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function CalorieCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [activityLevel, setActivityLevel] = useState("1.55");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [result, setResult] = useState<CalorieResult | null>(null);

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

    // Calculate BMR (Harris-Benedict)
    let bmr: number;
    if (gender === "male") {
      bmr = 88.362 + (13.397 * weightKg) + (4.799 * heightCm) - (5.677 * ageNum);
    } else {
      bmr = 447.593 + (9.247 * weightKg) + (3.098 * heightCm) - (4.330 * ageNum);
    }

    const maintenance = bmr * parseFloat(activityLevel);
    
    let goalCalories: number;
    let goalLabel: string;
    
    if (goal === "loss") {
      goalCalories = maintenance - 500; // 0.5kg/week loss
      goalLabel = "Weight Loss (0.5 kg/week)";
    } else if (goal === "gain") {
      goalCalories = maintenance + 500; // 0.5kg/week gain
      goalLabel = "Weight Gain (0.5 kg/week)";
    } else {
      goalCalories = maintenance;
      goalLabel = "Maintain Weight";
    }

    // Calculate macros (40% carbs, 30% protein, 30% fat)
    const protein = Math.round((goalCalories * 0.3) / 4); // 4 cal per gram
    const carbs = Math.round((goalCalories * 0.4) / 4);
    const fat = Math.round((goalCalories * 0.3) / 9); // 9 cal per gram

    setResult({
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenance),
      goal: Math.round(goalCalories),
      goalLabel,
      macros: { protein, carbs, fat }
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Zap className="w-7 h-7 text-orange-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calorie Calculator</h1>
        <p className="text-gray-500">Calculate your daily calorie needs based on your goals.</p>
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

        {/* Goal */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Goal</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setGoal("loss")}
              className={`py-3 rounded-lg text-sm font-medium transition-all ${goal === "loss" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              Lose Weight
            </button>
            <button
              onClick={() => setGoal("maintain")}
              className={`py-3 rounded-lg text-sm font-medium transition-all ${goal === "maintain" ? "bg-brand-500 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              Maintain
            </button>
            <button
              onClick={() => setGoal("gain")}
              className={`py-3 rounded-lg text-sm font-medium transition-all ${goal === "gain" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              Gain Weight
            </button>
          </div>
        </div>

        <button onClick={calculate} className="btn-primary w-full justify-center mt-5">
          Calculate Calories
        </button>
      </div>

      {/* Results */}
      {result && (
        <>
          {/* Main Result */}
          <div className="card bg-gradient-to-r from-orange-50 to-yellow-50 mb-4 text-center">
            <div className="text-sm text-orange-600 font-medium mb-1">{result.goalLabel}</div>
            <div className="text-6xl font-bold text-orange-900 mb-2">{result.goal}</div>
            <div className="text-sm text-orange-700">calories per day</div>
          </div>

          {/* Macros */}
          <div className="card mb-4">
            <h3 className="font-semibold text-gray-900 mb-4">Recommended Macros</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-blue-600">{result.macros.protein}g</span>
                </div>
                <div className="text-sm font-medium text-gray-700">Protein</div>
                <div className="text-xs text-gray-400">30%</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-yellow-600">{result.macros.carbs}g</span>
                </div>
                <div className="text-sm font-medium text-gray-700">Carbs</div>
                <div className="text-xs text-gray-400">40%</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-red-600">{result.macros.fat}g</span>
                </div>
                <div className="text-sm font-medium text-gray-700">Fat</div>
                <div className="text-xs text-gray-400">30%</div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-3">Your Metrics</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Basal Metabolic Rate (BMR)</span>
                <span className="font-bold text-gray-900">{result.bmr} cal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Maintenance Calories</span>
                <span className="font-bold text-gray-900">{result.maintenance} cal</span>
              </div>
            </div>
          </div>
        </>
      )}

      <p className="text-xs text-gray-400 text-center mt-6">
        Calorie calculations are estimates based on the Harris-Benedict equation. Individual needs may vary. Consult a healthcare provider for personalized advice.
      </p>
    </div>
  );
}