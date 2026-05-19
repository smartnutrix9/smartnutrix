"use client";
// src/app/ai/page.tsx
// SmartNutrix AI Nutrition Assistant — 3 features: Chat, Food Analyser, Meal Planner

import { useState, useRef, useEffect } from "react";
import {
  Brain, Send, Loader2, MessageSquare, Search,
  CalendarDays, RotateCcw, ChevronDown, Leaf,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────
type Mode = "chat" | "analyser" | "planner";
interface Message { role: "user" | "assistant"; content: string; }

// ── Daily limit (tracked in localStorage) ──────────────────────────────
const DAILY_LIMIT = 10;
function getTodayKey() { return `ai_count_${new Date().toISOString().slice(0, 10)}`; }
function getUsageCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(getTodayKey()) || "0", 10);
}
function incrementUsage(): number {
  const count = getUsageCount() + 1;
  localStorage.setItem(getTodayKey(), count.toString());
  return count;
}

// ── Render markdown-ish text to JSX ───────────────────────────────────
function renderResponse(text: string) {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Table rows
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        if (!lines[i].match(/^\|[-\s|]+\|$/)) tableLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={`tbl-${i}`} className="overflow-x-auto my-3">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {tableLines.map((row, ri) => (
                <tr key={ri} className={ri === 0 ? "bg-brand-50 font-semibold" : ri % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  {row.split("|").filter((_, ci) => ci > 0 && ci < row.split("|").length - 1).map((cell, ci) => (
                    <td key={ci} className="border border-gray-200 px-3 py-1.5">{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // H1/H2 bold headings
    if (line.startsWith("## ") || line.startsWith("**") && line.endsWith("**")) {
      const txt = line.replace(/^##\s*/, "").replace(/^\*\*/, "").replace(/\*\*$/, "");
      elements.push(<h3 key={`h-${i}`} className="font-bold text-gray-900 text-base mt-4 mb-1">{txt}</h3>);
      i++; continue;
    }

    // Horizontal rule
    if (line.startsWith("---")) {
      elements.push(<hr key={`hr-${i}`} className="my-3 border-gray-200" />);
      i++; continue;
    }

    // Bullet points
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const bullets: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        bullets.push(lines[i].replace(/^[-*]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2 text-gray-700">
          {bullets.map((b, bi) => (
            <li key={bi} dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>") }} />
          ))}
        </ul>
      );
      continue;
    }

    // Italic headings like *Based on: ...*
    if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      elements.push(
        <p key={`it-${i}`} className="text-sm text-gray-500 italic my-1">{line.slice(1, -1)}</p>
      );
      i++; continue;
    }

    // Emoji section headers like **🌅 Breakfast**
    if (line.match(/^\*\*.+\*\*$/)) {
      const txt = line.replace(/^\*\*/, "").replace(/\*\*$/, "");
      elements.push(
        <h4 key={`eh-${i}`} className="font-semibold text-gray-800 mt-3 mb-1">{txt}</h4>
      );
      i++; continue;
    }

    // Normal paragraph (with inline bold/italic)
    if (line.trim()) {
      const html = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");
      elements.push(
        <p key={`p-${i}`} className="text-gray-700 my-1 leading-relaxed"
           dangerouslySetInnerHTML={{ __html: html }} />
      );
    } else {
      elements.push(<div key={`sp-${i}`} className="h-1" />);
    }
    i++;
  }
  return <div className="text-sm space-y-0.5">{elements}</div>;
}

// ── Suggestion chips per mode ──────────────────────────────────────────
const SUGGESTIONS = {
  chat: [
    "High protein Indian breakfast ideas",
    "Foods to avoid with diabetes",
    "How much protein do I need daily?",
    "Best vegetarian iron sources",
    "Is ghee healthy or unhealthy?",
    "Foods that boost metabolism",
  ],
  analyser: [
    "2 rotis, 1 cup dal, small bowl of rice",
    "Masala dosa with coconut chutney and sambar",
    "3 idlis, filter coffee with milk and sugar",
    "Chicken biryani (1 plate) with raita",
    "Poha with chai and 2 boiled eggs",
    "Rajma chawal with salad",
  ],
  planner: [
    "70kg male, want to lose weight, vegetarian",
    "55kg female, build muscle, non-vegetarian",
    "Diabetic, 65kg, need low-sugar Indian meals",
    "60kg, very active, need high energy meals",
    "Vegan, 58kg, want to gain weight",
    "80kg male, sedentary job, want to get fit",
  ],
};

// ── Mode config ────────────────────────────────────────────────────────
const MODES: { id: Mode; label: string; icon: any; color: string; placeholder: string; description: string }[] = [
  {
    id: "chat",
    label: "Nutrition Chat",
    icon: MessageSquare,
    color: "#1D9E75",
    placeholder: "Ask any nutrition question... e.g. 'What are high protein Indian foods?'",
    description: "Ask any question about food, nutrition, diet, or health",
  },
  {
    id: "analyser",
    label: "Food Analyser",
    icon: Search,
    color: "#3B82F6",
    placeholder: "Describe your meal... e.g. '2 rotis, 1 cup dal, bowl of rice'",
    description: "Describe any meal and get an instant nutrition breakdown",
  },
  {
    id: "planner",
    label: "Meal Planner",
    icon: CalendarDays,
    color: "#8B5CF6",
    placeholder: "Share your goals... e.g. '70kg male, want to lose weight, vegetarian, Indian food'",
    description: "Get a personalised full-day meal plan based on your goals",
  },
];

// ── Main Component ─────────────────────────────────────────────────────
export default function AIPage() {
  const [mode, setMode] = useState<Mode>("chat");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [analyserResult, setAnalyserResult] = useState<Message | null>(null);
  const [plannerResult, setPlannerResult] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setUsage(getUsageCount());
  }, []);

  useEffect(() => {
    if (mode === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, mode]);

  const currentMode = MODES.find((m) => m.id === mode)!;
  const remaining = DAILY_LIMIT - usage;

  async function handleSubmit(messageOverride?: string) {
    const message = (messageOverride || input).trim();
    if (!message) return;
    if (remaining <= 0) {
      setError("You've used your 10 free questions for today. Come back tomorrow for more!");
      return;
    }

    setLoading(true);
    setError("");
    setShowSuggestions(false);
    setInput("");

    // Add user message to chat history immediately
    if (mode === "chat") {
      setChatHistory((prev) => [...prev, { role: "user", content: message }]);
    }

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          mode,
          conversationHistory: mode === "chat" ? chatHistory : [],
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong");
      }

      const newCount = incrementUsage();
      setUsage(newCount);

      if (mode === "chat") {
        setChatHistory((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else if (mode === "analyser") {
        setAnalyserResult({ role: "assistant", content: data.response });
      } else {
        setPlannerResult({ role: "assistant", content: data.response });
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      if (mode === "chat") {
        setChatHistory((prev) => prev.slice(0, -1)); // remove optimistic user message
      }
    }
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function resetMode() {
    if (mode === "chat") setChatHistory([]);
    if (mode === "analyser") setAnalyserResult(null);
    if (mode === "planner") setPlannerResult(null);
    setInput("");
    setError("");
    setShowSuggestions(true);
  }

  const hasResult =
    (mode === "chat" && chatHistory.length > 0) ||
    (mode === "analyser" && analyserResult) ||
    (mode === "planner" && plannerResult);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
               style={{ background: "linear-gradient(135deg, #1D9E75, #0F6E56)" }}>
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Nutrition Assistant</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Powered by Claude AI — ask anything about food, nutrition, and healthy eating
          </p>
          {/* Usage indicator */}
          <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full text-xs font-medium"
               style={{ backgroundColor: remaining > 3 ? "#E1F5EE" : "#FEF3C7",
                        color: remaining > 3 ? "#0F6E56" : "#92400E" }}>
            <Leaf className="w-3 h-3" />
            {remaining > 0
              ? `${remaining} free question${remaining !== 1 ? "s" : ""} remaining today`
              : "Daily limit reached — come back tomorrow"}
          </div>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setShowSuggestions(true); setError(""); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all"
              style={mode === m.id
                ? { backgroundColor: m.color, color: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }
                : { color: "#6B7280" }}
            >
              <m.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Mode description */}
        <p className="text-center text-sm text-gray-500 mb-5">{currentMode.description}</p>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* ── CHAT MODE ── */}
          {mode === "chat" && (
            <>
              {/* Messages */}
              {chatHistory.length > 0 && (
                <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                             style={{ backgroundColor: "#1D9E75" }}>
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "text-white rounded-tr-sm"
                          : "bg-gray-50 text-gray-800 rounded-tl-sm border border-gray-100"
                      }`}
                           style={msg.role === "user" ? { backgroundColor: "#1D9E75" } : {}}>
                        {msg.role === "user"
                          ? <p className="text-sm">{msg.content}</p>
                          : renderResponse(msg.content)}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                           style={{ backgroundColor: "#1D9E75" }}>
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100">
                        <div className="flex gap-1 items-center">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Suggestions */}
              {showSuggestions && chatHistory.length === 0 && (
                <div className="p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Try asking:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTIONS.chat.map((s) => (
                      <button key={s} onClick={() => handleSubmit(s)}
                              className="text-left text-sm px-4 py-2.5 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 text-gray-600 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── ANALYSER MODE ── */}
          {mode === "analyser" && (
            <div className="p-5">
              {analyserResult ? (
                <div>
                  <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-700">
                    <strong>Your meal:</strong> {input || "Described meal"}
                  </div>
                  {renderResponse(analyserResult.content)}
                </div>
              ) : !loading && (
                <>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Example meals to analyse:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTIONS.analyser.map((s) => (
                      <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                              className="text-left text-sm px-4 py-2.5 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 text-gray-600 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {loading && (
                <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#3B82F6" }} />
                  <span className="text-sm">Analysing your meal...</span>
                </div>
              )}
            </div>
          )}

          {/* ── PLANNER MODE ── */}
          {mode === "planner" && (
            <div className="p-5">
              {plannerResult ? (
                <div>{renderResponse(plannerResult.content)}</div>
              ) : !loading && (
                <>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Example goals:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SUGGESTIONS.planner.map((s) => (
                      <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                              className="text-left text-sm px-4 py-2.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50 text-gray-600 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {loading && (
                <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#8B5CF6" }} />
                  <span className="text-sm">Creating your personalised meal plan...</span>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mx-4 mb-3 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentMode.placeholder}
                rows={2}
                disabled={loading || remaining <= 0}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent placeholder-gray-300 disabled:opacity-50"
                style={{ "--tw-ring-color": currentMode.color } as any}
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleSubmit()}
                  disabled={loading || !input.trim() || remaining <= 0}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: currentMode.color }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
                {hasResult && (
                  <button onClick={resetMode} title="Start over"
                          className="w-11 h-11 rounded-xl flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line • {remaining} question{remaining !== 1 ? "s" : ""} left today
            </p>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { icon: "🧠", title: "Powered by Claude AI", desc: "Advanced AI trained on nutritional science and dietetics" },
            { icon: "🇮🇳", title: "Indian Food Expert", desc: "Deep knowledge of Indian cuisines, spices, and nutrition" },
            { icon: "🔒", title: "Private & Free", desc: "No account needed. 10 free questions per day." },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
              <div className="text-2xl mb-2">{card.icon}</div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{card.title}</h3>
              <p className="text-xs text-gray-500">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 text-center mt-6 max-w-lg mx-auto">
          SmartNutrix AI provides general nutrition information for educational purposes only.
          Always consult a qualified dietitian or doctor for personalised medical advice.
        </p>
      </div>
    </div>
  );
}
