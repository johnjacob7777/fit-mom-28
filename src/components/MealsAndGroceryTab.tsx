"use client";
// =============================================================
// MEALS & GROCERY TAB — 3-step quick recipes, 1-tap meal swaps,
// custom grocery additions, nursing tips, and fridge print view.
// =============================================================
import { useState, useMemo } from "react";
import {
  MealDay,
  getMealGuidance,
  getAlternativeMeal,
  getQuickBusyNightMeal,
  getWeeklyGroceryList,
  scaleQuantityText,
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
  RefreshCw,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Printer,
  Droplets,
} from "lucide-react";

interface MealsAndGroceryTabProps {
  meals: MealDay[];
  currentDayIndex: number; // 0-27
  foodPreference: string;
  isBreastfeeding?: boolean;
  portionMultiplier?: 1 | 2 | 4;
  swappedMeals?: Record<string, Record<string, string>>;
  customGroceries?: string[];
  groceryChecked: Record<string, boolean>;
  onToggleGroceryItem: (slug: string, checked: boolean) => void;
  onSwapMeal: (
    dayIndex: number,
    slot: "breakfast" | "lunch" | "dinner" | "snack",
    nextMeal: string
  ) => void;
  onUpdateCustomGroceries: (items: string[]) => void;
  onChangePortionMultiplier?: (multiplier: 1 | 2 | 4) => void;
}

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

export default function MealsAndGroceryTab({
  meals,
  currentDayIndex,
  foodPreference,
  isBreastfeeding = false,
  portionMultiplier = 1,
  swappedMeals = {},
  customGroceries = [],
  groceryChecked,
  onToggleGroceryItem,
  onSwapMeal,
  onUpdateCustomGroceries,
  onChangePortionMultiplier,
}: MealsAndGroceryTabProps) {
  const initialWeek = Math.floor(currentDayIndex / 7);
  const [selectedWeek, setSelectedWeek] = useState<number>(initialWeek);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(
    currentDayIndex % 7
  );
  const [copiedList, setCopiedList] = useState<boolean>(false);
  const [expandedRecipeSlot, setExpandedRecipeSlot] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState<string>("");
  const [localPortion, setLocalPortion] = useState<1 | 2 | 4>(portionMultiplier);
  const activePortion = onChangePortionMultiplier ? portionMultiplier : localPortion;

  const handleSelectPortion = (next: 1 | 2 | 4) => {
    setLocalPortion(next);
    onChangePortionMultiplier?.(next);
  };

  const dayIndex = (selectedWeek * 7 + selectedDayOffset) % Math.max(1, meals.length);
  const baseMeal = meals[dayIndex] || meals[0];
  const daySwaps = swappedMeals[`day_${dayIndex + 1}`] || {};

  const activeMeal: MealDay | undefined = baseMeal
    ? {
        breakfast: daySwaps.breakfast || baseMeal.breakfast,
        lunch: daySwaps.lunch || baseMeal.lunch,
        dinner: daySwaps.dinner || baseMeal.dinner,
        snack: daySwaps.snack || baseMeal.snack,
      }
    : undefined;

  // Apply swapped meals across the week so Grocery List reflects swaps cleanly
  const weekMeals = useMemo(() => {
    const start = selectedWeek * 7;
    return meals.slice(start, start + 7).map((m, i) => {
      const idx = start + i;
      const s = swappedMeals[`day_${idx + 1}`] || {};
      return {
        breakfast: s.breakfast || m.breakfast,
        lunch: s.lunch || m.lunch,
        dinner: s.dinner || m.dinner,
        snack: s.snack || m.snack,
      };
    });
  }, [meals, selectedWeek, swappedMeals]);

  const groceryCategories = useMemo(() => {
    const base = getWeeklyGroceryList(
      weekMeals.length ? weekMeals : meals.slice(0, 7),
      foodPreference
    );
    if (customGroceries.length > 0) {
      return [...base, { category: "My Custom Items", items: customGroceries }];
    }
    return base;
  }, [weekMeals, meals, foodPreference, customGroceries]);

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const totalItems = groceryCategories.reduce((sum, c) => sum + c.items.length, 0);
  const checkedCount = groceryCategories.reduce(
    (sum, c) =>
      sum +
      c.items.filter(
        (item) => !!groceryChecked[toSlug(`w${selectedWeek + 1}_${item}`)]
      ).length,
    0
  );

  const portionLabel =
    activePortion === 1
      ? "Just Me (1×)"
      : activePortion === 2
      ? "Partner & Me (2×)"
      : "Full Family (4×)";

  const handleCopyGroceryList = async () => {
    const lines = [
      `Fit Mom 20 — Week ${selectedWeek + 1} Grocery List (${portionLabel}):`,
      "",
      ...groceryCategories.flatMap((cat) => [
        `${cat.category}:`,
        ...cat.items.map((item) => {
          const isDone = !!groceryChecked[toSlug(`w${selectedWeek + 1}_${item}`)];
          const displayItem =
            cat.category === "My Custom Items" ? item : scaleQuantityText(item, activePortion);
          return `${isDone ? "[x]" : "[ ]"} ${displayItem}`;
        }),
        "",
      ]),
      "— Planned with Fit Mom 20 (https://fit-mom-28-aj.vercel.app)",
    ].join("\n");

    try {
      await navigator.clipboard.writeText(lines);
      setCopiedList(true);
      setTimeout(() => setCopiedList(false), 2500);
    } catch {
      // Clipboard blocked; ignore silently
    }
  };

  const handleAddCustomGrocery = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!customGroceries.includes(trimmed)) {
      onUpdateCustomGroceries([...customGroceries, trimmed]);
    }
    setCustomInput("");
  };

  const handleRemoveCustomGrocery = (item: string) => {
    onUpdateCustomGroceries(customGroceries.filter((g) => g !== item));
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
      {/* Nursing Hydration & Nourishment Banner if active */}
      {isBreastfeeding && (
        <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 text-xs text-plum/85 flex items-start gap-3">
          <Droplets className="w-5 h-5 text-sage-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-plum">
              Nursing Nutrition &amp; Extra Hydration Focus Active
            </p>
            <p className="mt-0.5 leading-relaxed">
              Your body uses extra fluids and minerals while nursing. Pair snacks with a glass of water/chaas and enjoy iron &amp; calcium sources (dal, spinach, paneer/eggs, almonds) without restricting calories harshly.
            </p>
          </div>
        </div>
      )}

      {/* ───────── WEEK & DAY SELECTOR + PRINT ───────── */}
      <div className="card-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-xl text-plum flex items-center gap-2">
              <Utensils className="w-5 h-5 text-plum" /> Simple Daily Meals &amp; 3-Step Recipes
            </h2>
            <p className="text-xs text-plum/65 mt-0.5">
              Swap any meal with one tap or expand the 3-step recipe &amp; kid-friendly prep notes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            {/* Family Portion Size Toggle */}
            <div className="flex gap-1 bg-cream-50 p-1 rounded-xl border border-peach-200">
              {[
                { val: 1 as const, label: "1× Me" },
                { val: 2 as const, label: "2× Partner" },
                { val: 4 as const, label: "4× Family" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => handleSelectPortion(opt.val)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    activePortion === opt.val
                      ? "bg-sage-600 text-white shadow-xs"
                      : "text-plum/70 hover:text-plum"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex gap-1 bg-cream-50 p-1 rounded-xl border border-peach-200">
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

            <button
              type="button"
              onClick={() => window.print()}
              className="btn-secondary py-1.5 px-3 text-xs"
              title="Print this week's meals & grocery checklist for your fridge"
            >
              <Printer className="w-3.5 h-3.5" /> Print Sheet
            </button>
          </div>
        </div>

        {/* 7 Day Pills */}
        <div className="grid grid-cols-7 gap-1.5 no-print">
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
                {isToday && !isActive && (
                  <span className="block text-[9px] font-medium">Today</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Meal Cards with Swap + 10-Min Busy Night Rescue + Scaled Quick Recipe */}
        <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
          {mealSlots.map((item) => {
            const Icon = item.icon;
            const guide = getMealGuidance(item.value, item.slot);
            const isRecipeOpen = expandedRecipeSlot === item.slot;
            return (
              <div
                key={item.label}
                className="bg-cream-50 p-4 rounded-2xl border border-peach-200/80 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-plum/65 flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-plum" /> {item.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-full border border-peach-200 text-plum/75 inline-flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {guide.prepTime}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onSwapMeal(
                            dayIndex,
                            item.slot,
                            getQuickBusyNightMeal(item.slot, foodPreference, item.value)
                          )
                        }
                        className="no-print text-[10px] font-bold bg-sage-100 hover:bg-sage-200 text-sage-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1 transition-colors"
                        title="Switch to a 5–10 minute busy-night meal"
                      >
                        ⚡ 10m
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onSwapMeal(
                            dayIndex,
                            item.slot,
                            getAlternativeMeal(item.slot, foodPreference, item.value)
                          )
                        }
                        className="no-print text-[10px] font-bold bg-peach-100 hover:bg-peach-200 text-plum px-2 py-0.5 rounded-full inline-flex items-center gap-1 transition-colors"
                        title="Swap for another healthy option matching your diet"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> Swap
                      </button>
                    </div>
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

                  {/* Quick Recipe Drawer */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRecipeSlot(isRecipeOpen ? null : item.slot)
                      }
                      className="no-print inline-flex items-center gap-1 text-[11px] font-bold text-plum underline"
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      {isRecipeOpen ? "Hide Quick Recipe" : "3-Step Quick Recipe & Ingredients"}
                      {isRecipeOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>

                    {isRecipeOpen && (
                      <div className="mt-2 bg-white p-3 rounded-xl border border-peach-200/80 space-y-2 animate-fade-in">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-plum/60 block">
                            Quick Ingredients ({portionLabel})
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-plum/85 mt-0.5">
                            {guide.ingredients.map((ing, i) => (
                              <li key={i}>{scaleQuantityText(ing, activePortion)}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-plum/60 block">
                            3-Step Home Prep
                          </span>
                          <ol className="list-decimal pl-4 space-y-0.5 text-plum/85 mt-0.5">
                            {guide.steps.map((st, i) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
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
              <span className="text-[11px] font-bold bg-sage-100 text-sage-700 px-2.5 py-0.5 rounded-full">
                {portionLabel}
              </span>
            </h3>
            <p className="text-xs text-plum/65 mt-0.5">
              Tap items as you pack your pantry • {checkedCount} of {totalItems} checked
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyGroceryList}
            className="btn-secondary py-2 px-3.5 text-xs no-print"
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

        {/* Add Custom Pantry / Baby / Family Item */}
        <form onSubmit={handleAddCustomGrocery} className="flex gap-2 no-print">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Add extra item (e.g. Milk, baby puffs, herbal tea)..."
            className="flex-1 bg-cream-50 border-2 border-peach-200 rounded-xl px-4 py-2 text-xs focus:border-plum focus:outline-none"
          />
          <button
            type="submit"
            disabled={!customInput.trim()}
            className="btn-primary py-2 px-4 text-xs disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </form>

        <div className="grid md:grid-cols-3 gap-4">
          {groceryCategories.map((cat) => {
            const isCustomCat = cat.category === "My Custom Items";
            return (
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
                    const scaledItem = isCustomCat ? item : scaleQuantityText(item, activePortion);
                    return (
                      <div
                        key={key}
                        className={`w-full text-xs p-2 rounded-xl flex items-center justify-between gap-2 transition-colors ${
                          isChecked
                            ? "bg-sage-50/70 text-plum/45 line-through"
                            : "bg-white hover:bg-peach-50 text-plum"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onToggleGroceryItem(key, !isChecked)}
                          className="flex-1 text-left flex items-start gap-2"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                          ) : (
                            <Square className="w-4 h-4 text-peach-300 shrink-0 mt-0.5" />
                          )}
                          <span>{scaledItem}</span>
                        </button>
                        {isCustomCat && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomGrocery(item)}
                            className="no-print text-plum/40 hover:text-red-600 p-0.5"
                            title="Remove item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
