// src/app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, Search, Scale, Activity, Droplets, Zap, TrendingUp, Brain, ShoppingBag, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "SmartNutrix is your smart companion for food nutrition, calorie tracking, health calculators, and expert wellness content. Learn about our mission and tools.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Hero */}
      <div className="text-center mb-16">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{backgroundColor: '#1D9E75'}}>
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          About <span style={{color: '#0F6E56'}}>SmartNutrix</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Your smart companion for food nutrition, calorie tracking, and healthy living — built for everyone, everywhere.
        </p>
      </div>

      {/* Mission */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          We believe that understanding what you eat is the foundation of a healthy life. Yet for billions of people worldwide, reliable nutrition information is either inaccessible, confusing, or buried behind paywalls and complicated apps.
        </p>
        <p className="text-gray-600 leading-relaxed mb-4">
          SmartNutrix was built to change that. Our mission is to make nutrition knowledge free, simple, and accessible to everyone — regardless of where you live, what you eat, or how much you know about nutrition.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Whether you're a college student trying to eat better on a budget, a parent planning healthy meals for your family, a fitness enthusiast tracking macros, or someone managing a health condition through diet — SmartNutrix gives you the tools and knowledge you need, completely free.
        </p>
      </div>

      {/* What We Offer */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">

          <div className="card hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: '#E1F5EE'}}>
              <Search className="w-6 h-6" style={{color: '#1D9E75'}} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Food Nutrition Search</h3>
            <p className="text-sm text-gray-500">Search nutrition facts for over 900,000 foods from cuisines around the world — including detailed Indian food data. Powered by the USDA FoodData Central database.</p>
          </div>

          <div className="card hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-blue-50">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Food Comparison</h3>
            <p className="text-sm text-gray-500">Compare any two foods side by side — calories, protein, carbs, fat, vitamins, and minerals. Make informed choices about what goes on your plate.</p>
          </div>

          <div className="card hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-purple-50">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Health Calculators</h3>
            <p className="text-sm text-gray-500">Five free calculators — BMI, BMR, Calorie, Water Intake, and Protein — to help you understand your body and set personalized health targets.</p>
          </div>

          <div className="card hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-orange-50">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Health Blog</h3>
            <p className="text-sm text-gray-500">30+ in-depth articles on nutrition, fitness, healthy eating, weight management, longevity, and lifestyle — written for a global audience with content relevant to every culture.</p>
          </div>

          <div className="card hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-cyan-50">
              <Brain className="w-6 h-6 text-cyan-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Nutrition (Coming Soon)</h3>
            <p className="text-sm text-gray-500">AI-powered personalized food recommendations based on your health goals, dietary preferences, and nutritional needs.</p>
          </div>

          <div className="card hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-amber-50">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Health Shop</h3>
            <p className="text-sm text-gray-500">Curated recommendations for nutrition supplements, kitchen tools, fitness equipment, and health books — products we trust and recommend.</p>
          </div>

        </div>
      </div>

      {/* Our Data */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Data Sources</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          SmartNutrix uses the USDA FoodData Central database — the most comprehensive, peer-reviewed food nutrition database in the world. Maintained by the United States Department of Agriculture, it contains nutrition data for over 900,000 foods including branded products, restaurant items, and raw ingredients from cuisines worldwide.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Our blog content is researched from peer-reviewed scientific journals, WHO guidelines, and established health organizations. We cite studies, explain methodology, and present balanced perspectives — because you deserve accurate information, not clickbait.
        </p>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Values</h2>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg" style={{backgroundColor: '#E1F5EE'}}>🌍</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Global Perspective</h3>
              <p className="text-sm text-gray-500">Nutrition isn't one-size-fits-all. We cover foods and dietary patterns from every continent — Indian, Mediterranean, Japanese, Latin American, African, and more — because healthy eating looks different everywhere.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg" style={{backgroundColor: '#E1F5EE'}}>🔬</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Science-Based</h3>
              <p className="text-sm text-gray-500">Every article and recommendation is backed by peer-reviewed research. We don't promote fads, sell miracle cures, or make claims we can't support with evidence.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg" style={{backgroundColor: '#E1F5EE'}}>💚</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Free and Accessible</h3>
              <p className="text-sm text-gray-500">All our tools, calculators, and articles are completely free. We believe nutrition knowledge should be accessible to everyone, not locked behind subscriptions.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg" style={{backgroundColor: '#E1F5EE'}}>🤝</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">No Judgment</h3>
              <p className="text-sm text-gray-500">We don't shame anyone for what they eat. We provide information and tools so you can make your own informed decisions. Health is a journey, not a competition.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-16 p-6 rounded-2xl" style={{backgroundColor: '#F0FDF4'}}>
        <h2 className="text-xl font-bold text-gray-900 mb-3">Important Disclaimer</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          SmartNutrix provides nutrition information for educational purposes only. Our content is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider before making significant changes to your diet, especially if you have medical conditions, are pregnant, or are taking medication. Nutrition data is sourced from USDA FoodData Central and may contain approximations.
        </p>
      </div>

      {/* Contact CTA */}
      <div className="text-center p-8 rounded-2xl" style={{backgroundColor: '#E1F5EE'}}>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Get in Touch</h2>
        <p className="text-gray-600 mb-6">Have questions, suggestions, or feedback? We'd love to hear from you.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
          <Link href="/blog" className="btn-outline">
            Read Our Blog
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Email: <a href="mailto:smartnutrix9@gmail.com" className="underline" style={{color: '#1D9E75'}}>smartnutrix9@gmail.com</a>
        </p>
      </div>

    </div>
  );
}