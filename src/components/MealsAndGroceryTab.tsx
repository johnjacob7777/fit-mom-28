"use client";
// =============================================================
// MEALS & GROCERY TAB — Practical cooking hacks, family/kid notes,
// and an interactive weekly grocery checklist you can copy/share.
// =============================================================
import { useState, useMemo } from "react";
import {
  MealDay,
  getMealGuidance,
  getWeeklyGroceryList,
} from "@/lib/planGenerator";
import {
  Utensils,
  Sun,
  Moon,
  Heart,
  Clock,
  Users,
  Sparkles,
  ShoppingBasket,
  CheckSquare,
  Square,
  Copy,
  Check,
  Lightbulb,
} from "lucide-react";

interface MealsAndGroceryTabProps {
  meals: MealDay[];
  currentDayIndex: number; // 0-27
  foodPreference: string;
  groceryChecked: Record<string, boolean>;
  onToggleGroceryItem: (slug: string, checked: boolean) => void;
}

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

export default function MealsAndGroceryTab({
  meals,
  currentDayIndex,
  foodPreference,
  groceryChecked,
  onToggleGroceryItem,
}: MealsAndGroceryTabProps) {
  const initialWeek = Math.floor(currentDayIndex / 7);
  const [selectedWeek, setSelectedWeek] = useState<number>(initialWeek);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(
    currentDayIndex % 7
  );
  const [copiedList, setCopiedList] = useState<boolean>(false);

  const dayIndex = (selectedWeek * 7 + selectedDayOffset) % Math.max(1, meals.length);
  const activeMeal = meals[dayIndex] || meals[0];

  const weekMeals = useMemo(() => {
    const start = selectedWeek * 7;
    return meals.slice(start, start + 7);
  }, [meals, selectedWeek]);

  const groceryCategories = useMemo(() => {
    return getWeeklyGroceryList(
      weekMeals.length ? weekMeals : meals.slice(0, 7),
      foodPreference
    );
  }, [weekMeals, meals, foodPreference]);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const totalItems = groceryCategories.reduce((sum, c) => sum + c.items.length, 0);
  const checkedCount = groceryCategories.reduce(
    (sum, c) =>
      sum +
      c.items.filter((item) => !!groceryChecked[toSlug(`w${selectedWeek + 1}_${item}`)]).length,
    0
  );

  const handleCopyGroceryList = async () => {
    const lines = [
      `Fit Mom 20 — Week ${selectedWeek + 1} Grocery List:`,
      "",
      ...groceryCategories.flatMap((cat) => [
        `${cat.category}:`,
        ...cat.items.map((item) => {
          const isDone = !!groceryChecked[toSlug(`w${selectedWeek + 1}_${item}`)];
          return `${isDone ? "[x]" : "[ ]"} ${item}`;
        }),
        "",
      ]),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(lines);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2500);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  if (!activeMeal) return null;

  const mealSlots: {
    slot: "breakfast" | "lunch" | "dinner" | "snack";
    label: string;
    value: string;
    icon: typeof Sun;
  }[] = [
    { slot: "breakfast", label: "Breakfast", value: activeMeal.breakfast, icon: Sun },
    { slot: "lunch", label: "Lunch", value: activeMeal.lunch, icon: Utensils },
    { slot: "dinner", label: "Dinner", value: activeMeal.dinner, icon: Moon },
    { slot: "snack", label: "Afternoon / Quick Snack", value: activeMeal.snack, icon: Heart },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ───────── WEEK & DAY SELECTOR ───────── */}
      <div className="card-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-xl text-plum flex items-center gap-2">
              <Utensils className="w-5 h-5 text-plum" /> Simple Daily Meals &amp; Family Hacks
            </h2>
            <p className="text-xs text-plum/65 mt-0.5">
              Realistic home-cooked food you can prepare without separate meals for the kids.
            </p>
          </div>

          <div className="flex gap-1.5 bg-cream-50 p-1 rounded-xl border border-peach-200">
            {[0, 1, 2, 3].map((wk) => (
              <button
                key={wk}
                type="button"
                onClick={() => setSelectedWeek(wk)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedWeek === wk
                    ? "bg-plum text-white shadow-xs"
                    : "text-plum/70 hover:text-plum"
                }`}
              >
                Wk {wk + 1}
              </button>
            ))}
          </div>
        </div>

        {/* 7 Day Pills */}
        <div className="grid grid-cols-7 gap-1.5">
          {dayNames.map((name, idx) => {
            const isActive = idx === selectedDayOffset;
            const isToday = selectedWeek * 7 + idx === currentDayIndex;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedDayOffset(idx)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  isActive
                    ? "bg-plum text-white border-plum shadow-xs"
                    : isToday
                    ? "bg-peach-100 text-plum border-peach-300"
                    : "bg-cream-50 text-plum/70 border-peach-100 hover:border-peach-300"
                }`}
              >
                {name}
                {isToday && !isActive && <span className="block text-[9px] font-medium">Today</span>}
              </button>
            );
          })}
        </div>

        {/* Meal Cards with Prep Hack & Kid Tip */}
        <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
          {mealSlots.map((item) => {
            const Icon = item.icon;
            const guide = getMealGuidance(item.value, item.slot);
            return (
              <div
                key={item.label}
                className="bg-cream-50 p-4 rounded-2xl border border-peach-200/80 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-plum/65 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-plum" /> {item.label}
                    </span>
                    <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-full border border-peach-200 text-plum/75 inline-flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {guide.prepTime}
                    </span>
                  </div>

                  <p className="font-heading font-bold text-base text-plum leading-snug">
                    {item.value}
                  </p>
                  <span className="inline-block text-[10px] font-semibold text-sage-700 bg-sage-100 px-2 py-0.5 rounded-md mt-1.5">
                    {guide.highlight}
                  </span>
                </div>

                <div className="pt-2 border-t border-peach-200/60 space-y-1.5 text-[11px] text-plum/80">
                  <p className="flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-peach-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Mom Hack:</strong> {guide.prepTip}
                    </span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <Users className="w-3.5 h-3.5 text-sage-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Family Friendly:</strong> {guide.familyNote}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────── WEEKLY GROCERY CHECKLIST ───────── */}
      <div className="card-soft space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-peach-200">
          <div>
            <h3 className="font-heading font-bold text-xl text-plum flex items-center gap-2">
              <ShoppingBasket className="w-5 h-5 text-sage-600" />
              Week {selectedWeek + 1} Smart Grocery List
            </h3>
            <p className="text-xs text-plum/65 mt-0.5">
              Tap items as you pack your pantry • {checkedCount} of {totalItems} checked
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyGroceryList}
            className="btn-secondary py-2 px-3.5 text-xs"
          >
            {copiedList ? (
              <>
                <Check className="w-3.5 h-3.5 text-sage-600" /> Copied List!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy for WhatsApp / Notes
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {groceryCategories.map((cat) => (
            <div
              key={cat.category}
              className="bg-cream-50 rounded-2xl p-4 border border-peach-100 space-y-2.5"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-plum/70 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-peach-400" /> {cat.category}
              </h4>

              <div className="space-y-1.5">
                {cat.items.map((item) => {
                  const key = toSlug(`w${selectedWeek + 1}_${item}`);
                  const isChecked = !!groceryChecked[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onToggleGroceryItem(key, !isChecked)}
                      className={`w-full text-left text-xs p-2 rounded-xl flex items-start gap-2 transition-colors ${
                        isChecked
                          ? "bg-sage-50/70 text-plum/45 line-through"
                          : "bg-white hover:bg-peach-50 text-plum"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-peach-300 shrink-0 mt-0.5" />
                      )}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
