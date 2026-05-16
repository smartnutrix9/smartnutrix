// lib/usda.ts
// USDA FoodData Central API with retry logic

import axios from "axios";

const USDA_BASE_URL = "https://api.nal.usda.gov/fdc/v1";
const API_KEY = process.env.USDA_API_KEY;

// Simple in-memory cache
const cache = new Map<string, { data: unknown; expires: number }>();

function getCached(key: string) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key: string, data: unknown, ttlSeconds = 3600) {
  cache.set(key, { data, expires: Date.now() + ttlSeconds * 1000 });
}

// Retry helper - tries up to 3 times
async function fetchWithRetry(url: string, options: any, retries = 3): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios({
        ...options,
        url,
        timeout: 15000, // 10 second timeout
      });
      return response;
    } catch (error: any) {
      console.error(`USDA API attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt === retries) throw error;
      // Wait before retrying (500ms, 1000ms, 1500ms)
      await new Promise(resolve => setTimeout(resolve, attempt * 1000));
    }
  }
}

// ─── TYPES ───────────────────────────────────────────────
export interface FoodSearchResult {
  fdcId: number;
  description: string;
  brandOwner?: string;
  category?: string;
  score?: number;
}

export interface NutritionData {
  fdcId: number;
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

// ─── SEARCH FOODS ─────────────────────────────────────────
export async function searchFoods(
  query: string,
  pageSize = 10
): Promise<FoodSearchResult[]> {
  const cacheKey = `search:${query}:${pageSize}`;
  const cached = getCached(cacheKey);
  if (cached) return cached as FoodSearchResult[];

  try {
    const response = await fetchWithRetry(
      `${USDA_BASE_URL}/foods/search?api_key=${API_KEY}`,
      {
        method: "POST",
        data: {
          query,
          pageSize,
          dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)"],
        },
      }
    );

    const results: FoodSearchResult[] = response.data.foods.map(
      (food: any) => ({
        fdcId: food.fdcId,
        description: food.description,
        brandOwner: food.brandOwner || null,
        category: food.foodCategory || null,
        score: food.score || 0,
      })
    );

    // Cache for 1 hour
    setCache(cacheKey, results, 3600);
    return results;
  } catch (error) {
    console.error("USDA search error:", error);
    return [];
  }
}

// ─── GET FOOD NUTRITION ───────────────────────────────────
export async function getFoodNutrition(fdcId: number): Promise<NutritionData | null> {
  const cacheKey = `food:${fdcId}`;
  const cached = getCached(cacheKey);
  if (cached) return cached as NutritionData;

  try {
    const response = await fetchWithRetry(
      `${USDA_BASE_URL}/food/${fdcId}?api_key=${API_KEY}`,
      {
        method: "GET",
      }
    );

    const food = response.data;
    const nutrients = food.foodNutrients || [];

    function getNutrient(nutrientId: number): number {
      const n = nutrients.find(
        (n: any) =>
          n.nutrient?.id === nutrientId || n.nutrientId === nutrientId
      );
      return n?.amount || n?.value || 0;
    }

    const data: NutritionData = {
      fdcId: food.fdcId,
      name: food.description,
      calories:       Math.round(getNutrient(1008)),
      protein:        Math.round(getNutrient(1003) * 10) / 10,
      carbohydrates:  Math.round(getNutrient(1005) * 10) / 10,
      fat:            Math.round(getNutrient(1004) * 10) / 10,
      fiber:          Math.round(getNutrient(1079) * 10) / 10,
      sugar:          Math.round(getNutrient(2000) * 10) / 10,
      sodium:         Math.round(getNutrient(1093)),
      potassium:      Math.round(getNutrient(1092)),
      calcium:        Math.round(getNutrient(1087)),
      iron:           Math.round(getNutrient(1089) * 10) / 10,
      vitaminC:       Math.round(getNutrient(1162) * 10) / 10,
      vitaminA:       Math.round(getNutrient(1106)),
      vitaminD:       Math.round(getNutrient(1114) * 10) / 10,
      cholesterol:    Math.round(getNutrient(1253)),
      saturatedFat:   Math.round(getNutrient(1258) * 10) / 10,
      servingSize:    food.servingSize || 100,
      servingUnit:    food.servingSizeUnit || "g",
    };

    // Cache for 24 hours (food nutrition doesn't change)
    setCache(cacheKey, data, 86400);
    return data;
  } catch (error) {
    console.error("USDA food detail error:", error);
    return null;
  }
}

// ─── HEALTH SCORE CALCULATOR ──────────────────────────────
export function calculateHealthScore(nutrition: NutritionData): {
  score: number;
  label: string;
  color: string;
  tips: string[];
} {
  let score = 5;
  const tips: string[] = [];

  if (nutrition.fiber > 5)     { score += 1; }
  if (nutrition.protein > 10)  { score += 1; }
  if (nutrition.vitaminC > 20) { score += 0.5; }
  if (nutrition.calcium > 100) { score += 0.5; }
  if (nutrition.iron > 2)      { score += 0.5; }

  if (nutrition.sugar > 20)      { score -= 1.5; tips.push("High in sugar"); }
  if (nutrition.sodium > 600)    { score -= 1.5; tips.push("High in sodium"); }
  if (nutrition.saturatedFat > 5){ score -= 1;   tips.push("High saturated fat"); }
  if (nutrition.cholesterol > 100){ score -= 0.5; }
  if (nutrition.calories > 500)  { score -= 0.5; tips.push("High calorie food"); }

  score = Math.min(10, Math.max(1, Math.round(score)));

  let label = "Moderate";
  let color = "yellow";

  if (score >= 7) { label = "Healthy";          color = "green"; }
  if (score <= 4) { label = "Avoid Frequently"; color = "red"; }

  if (tips.length === 0) tips.push("Good nutritional profile");

  return { score, label, color, tips };
}