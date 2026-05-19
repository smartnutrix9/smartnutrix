// src/app/api/ai/route.ts
// AI Nutrition Assistant — calls Anthropic Claude API

import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

// System prompts for each mode
const SYSTEM_PROMPTS = {
  chat: `You are SmartNutrix AI — a friendly, knowledgeable nutrition assistant specialising in food science, dietetics, and healthy eating. You have deep knowledge of Indian foods, global cuisines, calories, macronutrients, micronutrients, dietary requirements for various health conditions, and evidence-based nutrition advice.

Your personality:
- Warm, encouraging, and non-judgmental
- Give specific, actionable answers — not vague generalities
- Always mention Indian food alternatives where relevant
- Keep answers concise but complete (150-300 words ideal)
- Use bullet points and structure for clarity
- If someone asks about a medical condition (diabetes, hypertension, etc.), give practical food guidance but always add a one-line note to consult their doctor for medical advice
- Never refuse reasonable nutrition questions
- When listing foods, include approximate nutrition values when helpful

Format your responses with clear headings and bullet points where appropriate.`,

  analyser: `You are SmartNutrix Food Analyser — an expert at estimating the nutritional content of meals described in natural language.

When a user describes a meal (e.g. "2 rotis, 1 cup dal, rice"), you:
1. List each food item with realistic portion assumptions
2. Provide a clean nutrition summary table
3. Give a brief health assessment

Always respond in this exact format:

**Foods Identified:**
- [Food item] ([assumed portion]) — [calories] cal, [protein]g protein, [carbs]g carbs, [fat]g fat
- (repeat for each item)

**Total Nutrition Estimate:**
| Nutrient | Amount |
|----------|--------|
| Calories | XXX kcal |
| Protein | XXg |
| Carbohydrates | XXg |
| Fat | XXg |
| Fibre | XXg |

**Health Notes:**
[2-3 sentences: is this a balanced meal? What's missing? Any suggestions?]

**Disclaimer:** These are estimates. Actual values vary by cooking method, exact portions, and ingredients used.

Be realistic with Indian food portions (1 roti = ~70 cal, 1 cup cooked dal = ~150 cal, 1 cup cooked rice = ~200 cal, etc.)`,

  planner: `You are SmartNutrix Meal Planner — an expert at creating personalised daily meal plans based on user goals, preferences, and dietary requirements.

When a user shares their details (weight, goal, diet type, etc.), create a complete 1-day meal plan.

Always respond in this exact format:

**Your Personalised Meal Plan**
*Based on: [summarise their goals]*
*Daily Target: ~[X] calories | [X]g protein | [X]g carbs | [X]g fat*

---

**🌅 Breakfast (~X cal)**
- [Specific meal with portions]
- [Drink/side]

**🥗 Mid-Morning Snack (~X cal)**
- [Specific snack]

**☀️ Lunch (~X cal)**
- [Specific meal with portions]

**🍎 Evening Snack (~X cal)**
- [Specific snack]

**🌙 Dinner (~X cal)**
- [Specific meal with portions]

---

**Daily Totals:**
Calories: ~X kcal | Protein: ~Xg | Carbs: ~Xg | Fat: ~Xg

**Tips for your goals:**
- [2-3 practical tips specific to their situation]

Prioritise Indian foods unless the user specifies otherwise. Offer practical, affordable, accessible meals — not exotic superfoods.`,
};

export async function POST(request: NextRequest) {
  try {
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI service not configured. Please add ANTHROPIC_API_KEY to environment variables." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, mode, conversationHistory } = body;

    if (!message || !mode) {
      return NextResponse.json({ error: "Message and mode are required" }, { status: 400 });
    }

    if (!["chat", "analyser", "planner"].includes(mode)) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Build messages array — include conversation history for chat mode
    const messages: { role: "user" | "assistant"; content: string }[] = [];

    if (mode === "chat" && conversationHistory && Array.isArray(conversationHistory)) {
      // Include up to last 10 exchanges for context
      const recent = conversationHistory.slice(-20);
      for (const msg of recent) {
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
    }

    messages.push({ role: "user", content: message });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS],
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", errorData);
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const aiResponse = data.content?.[0]?.text || "Sorry, I could not generate a response.";

    return NextResponse.json({ success: true, response: aiResponse });
  } catch (error: any) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
