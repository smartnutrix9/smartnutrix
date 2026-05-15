// src/app/ai/page.tsx
// AI Nutrition - Coming Soon page

import Link from "next/link";
import { Brain, ArrowLeft, Bell } from "lucide-react";

export default function AIPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      
      {/* Icon */}
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{background: 'linear-gradient(to right, #0F6E56, #2DB887)'}}>
        <Brain className="w-10 h-10 text-white" />
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        AI Nutrition Assistant
      </h1>
      <p className="text-lg text-gray-500 mb-3">
        Coming Soon!
      </p>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Our AI-powered nutrition assistant will give you personalized food recommendations based on your health goals, dietary preferences, and lifestyle.
      </p>

      {/* What's coming */}
      <div className="card text-left mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">What to expect:</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-3">
            <span className="text-brand-500 flex-shrink-0 mt-0.5">✓</span>
            <span>Personalized food suggestions based on your health goals</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 flex-shrink-0 mt-0.5">✓</span>
            <span>Custom meal plans for weight loss, muscle gain, or diabetes management</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 flex-shrink-0 mt-0.5">✓</span>
            <span>Indian food focused recommendations</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 flex-shrink-0 mt-0.5">✓</span>
            <span>Instant answers to any nutrition question</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand-500 flex-shrink-0 mt-0.5">✓</span>
            <span>Recipe suggestions based on available ingredients</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary justify-center">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link href="/contact" className="btn-outline justify-center">
          <Bell className="w-4 h-4" />
          Notify Me When Ready
        </Link>
      </div>

      {/* Explore other tools */}
      <div className="mt-12">
        <p className="text-sm text-gray-400 mb-4">In the meantime, try our free tools:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/calculator/bmi" className="badge-green px-4 py-2 rounded-full text-sm">BMI Calculator</Link>
          <Link href="/calculator/bmr" className="badge-green px-4 py-2 rounded-full text-sm">BMR Calculator</Link>
          <Link href="/calculator/calories" className="badge-green px-4 py-2 rounded-full text-sm">Calorie Calculator</Link>
          <Link href="/calculator/protein" className="badge-green px-4 py-2 rounded-full text-sm">Protein Calculator</Link>
        </div>
      </div>
    </div>
  );
}