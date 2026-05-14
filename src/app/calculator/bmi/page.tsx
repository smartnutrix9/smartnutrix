"use client";
// src/app/calculator/bmi/page.tsx
// BMI Calculator page

import { useState } from "react";
import { Scale } from "lucide-react";

type Unit = "metric" | "imperial";

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  advice: string;
}

function getBMICategory(bmi: number): BMIResult {
  if (bmi < 18.5) return { bmi, category: "Underweight", color: "text-blue-600 bg-blue-50", advice: "Consider increasing calorie intake with nutrient-rich foods." };
  if (bmi < 25)   return { bmi, category: "Normal weight", color: "text-green-600 bg-green-50", advice: "Great! Maintain your current healthy lifestyle." };
  if (bmi < 30)   return { bmi, category: "Overweight", color: "text-amber-600 bg-amber-50", advice: "Consider a balanced diet and regular exercise." };
  return { bmi, category: "Obese", color: "text-red-600 bg-red-50", advice: "Consult a healthcare provider for a personalized plan." };
}

export default function BMICalculator() {
  const [unit,   setUnit]   = useState<Unit>("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [feet,   setFeet]   = useState("");
  const [inches, setInches] = useState("");
  const [result, setResult] = useState<BMIResult | null>(null);

  function calculate() {
    let weightKg = parseFloat(weight);
    let heightM  = parseFloat(height) / 100;

    if (unit === "imperial") {
      weightKg = parseFloat(weight) * 0.453592;
      const totalInches = (parseFloat(feet) * 12) + parseFloat(inches || "0");
      heightM  = totalInches * 0.0254;
    }

    if (!weightKg || !heightM || weightKg <= 0 || heightM <= 0) return;

    const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
    setResult(getBMICategory(bmi));
  }

  // Position of BMI arrow on scale
  const arrowPct = result
    ? Math.min(100, Math.max(0, ((result.bmi - 10) / 30) * 100))
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Scale className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BMI Calculator</h1>
        <p className="text-gray-500">Calculate your Body Mass Index to understand your healthy weight range.</p>
      </div>

      {/* Unit toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6 w-fit mx-auto">
        <button
          onClick={() => setUnit("metric")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${unit === "metric" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
        >
          Metric (kg, cm)
        </button>
        <button
          onClick={() => setUnit("imperial")}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${unit === "imperial" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
        >
          Imperial (lb, ft)
        </button>
      </div>

      {/* Inputs */}
      <div className="card mb-4">
        <div className="grid grid-cols-1 gap-4">

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
              className="search-input text-base py-3"
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
                className="search-input text-base py-3"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Feet (e.g. 5)" value={feet} onChange={(e) => setFeet(e.target.value)} className="search-input text-base py-3" />
                <input type="number" placeholder="Inches (e.g. 9)" value={inches} onChange={(e) => setInches(e.target.value)} className="search-input text-base py-3" />
              </div>
            </div>
          )}
        </div>

        <button onClick={calculate} className="btn-primary w-full justify-center mt-5">
          Calculate BMI
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className={`card text-center mb-4 ${result.color}`}>
          <div className="text-6xl font-bold mb-2">{result.bmi}</div>
          <div className="text-xl font-semibold mb-1">{result.category}</div>
          <p className="text-sm opacity-80 mb-4">{result.advice}</p>

          {/* BMI Scale visual */}
          <div className="relative mt-4">
            <div className="h-4 rounded-full overflow-hidden flex">
              <div className="flex-1 bg-blue-400"   title="Underweight" />
              <div className="flex-1 bg-green-400"  title="Normal" />
              <div className="flex-1 bg-amber-400"  title="Overweight" />
              <div className="flex-1 bg-red-400"    title="Obese" />
            </div>
            {/* Arrow */}
            <div
              className="absolute top-0 w-1 h-4 bg-gray-900 rounded-full"
              style={{ left: `${arrowPct}%`, transform: "translateX(-50%)" }}
            />
            <div className="flex justify-between text-xs mt-1 opacity-70">
              <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>
        </div>
      )}

      {/* BMI Reference table */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-3">BMI Reference Guide</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-gray-500 font-medium py-2">BMI Range</th>
              <th className="text-left text-gray-500 font-medium py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {[
              { range: "Below 18.5", label: "Underweight",   color: "badge bg-blue-50 text-blue-700" },
              { range: "18.5 – 24.9",label: "Normal weight", color: "badge bg-green-50 text-green-700" },
              { range: "25.0 – 29.9",label: "Overweight",    color: "badge bg-amber-50 text-amber-700" },
              { range: "30.0 and above",label: "Obese",      color: "badge bg-red-50 text-red-700" },
            ].map((row) => (
              <tr key={row.range} className="border-b border-gray-50">
                <td className="py-2 text-gray-600">{row.range}</td>
                <td className="py-2"><span className={row.color}>{row.label}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for personalized advice.
      </p>
    </div>
  );
}