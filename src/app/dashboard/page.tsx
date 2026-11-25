"use client";
// =============================================================
// DASHBOARD — Daily Energy Check-In, Guided Player, 4-Week
// Roadmap, Meals & Grocery, and Non-Scale Progress Wins.
// =============================================================
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, MoodWinEntry } from "@/context/AuthContext";
import {
  Plan,
  WorkoutDay,
  WEEK_THEMES,
  enrichExercise,
  getExpressRoutine,
  getPostureReliefRoutine,
  getGentleSwap,
} from "@/lib/planGenerator";
import GuidedWorkoutPlayer from "@/components/GuidedWorkoutPlayer";
import ExerciseDemoDisplay from "@/components/ExerciseDemoDisplay";
import MealsAndGroceryTab from "@/components/MealsAndGroceryTab";
import ProgressAndWinsTab from "@/components/ProgressAndWinsTab";
import {
  CheckCircle2,
  Droplets,
  Calendar,
  Flame,
  Settings,
  LogOut,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Utensils,
  Heart,
  Sun,
  Zap,
  BatteryLow,
  Accessibility,
  RefreshCw,
  ArrowRight,
  Wind,
  Trophy,
  LayoutList,
  ShoppingBasket,
  Video,
} from "lucide-react";

type DashboardTab = "today" | "roadmap" | "meals" | "progress";
type DailyMode = "standard" | "gentle" | "posture" | "express";

function getLocalYMD(date: Date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, userData, loading, updateUserDocument, logoutUser } = useAuth();

  const today = useMemo(() => getLocalYMD(), []);
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  // Navigation & UI states
  const [activeTab, setActiveTab] = useState<DashboardTab>("today");
  const [waterGlasses, setWaterGlasses] = useState<number>(0);
  const [celebrate, setCelebrate] = useState<boolean>(false);
  const [expandedExerciseKey, setExpandedExerciseKey] = useState<string | null>(null);
  const [previewDayNumber, setPreviewDayNumber] = useState<number | null>(null);
  const [selectedRoadmapWeek, setSelectedRoadmapWeek] = useState<number>(1);
  const [shufflingPlan, setShufflingPlan] = useState<boolean>(false);

  // Auth & Access Gate
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!userData?.isPaid) {
        if (!userData?.quizCompleted) {
          router.push("/onboarding");
        } else {
          router.push("/checkout");
        }
      }
    }
  }, [user, userData, loading, router]);

  // Sync water intake
  useEffect(() => {
    if (userData?.progress?.waterIntake?.[today] !== undefined) {
      setWaterGlasses(userData.progress.waterIntake[today]);
    }
  }, [userData, today]);

  // Auto-generate plan if user is paid or demo without plan yet
  useEffect(() => {
    if (userData?.isPaid && !userData.plan) {
      fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizAnswers: userData.quizAnswers || {
            age: "30",
            currentWeight: "65",
            goalWeight: "58",
            hasBabyUnder1: false,
            exerciseMinutes: 20,
            exerciseLocation: "home_no_equipment",
            healthIssues: ["none"],
            foodPreference: "vegetarian",
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.plan) {
            updateUserDocument({ plan: data.plan });
          }
        })
        .catch(console.error);
    }
  }, [userData, updateUserDocument]);

  // Plan day calculation
  const getPlanDay = useCallback((): number => {
    if (!userData?.plan) return 1;
    const progress = userData.progress?.workoutsCompleted || {};
    const dates = Object.keys(progress).sort();
    if (dates.length === 0) return 1;

    const parts = dates[0].split("-").map(Number);
    const startDate =
      parts.length === 3
        ? new Date(parts[0], parts[1] - 1, parts[2])
        : new Date(dates[0]);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return (Math.max(0, diffDays) % 28) + 1;
  }, [userData]);

  const naturalPlanDay = getPlanDay();
  const activeDayNumber = previewDayNumber ?? naturalPlanDay;
  const plan = userData?.plan as Plan | undefined;
  const quizMinutes = Number((userData?.quizAnswers as any)?.exerciseMinutes) || 20;
  const foodPreference = String((userData?.quizAnswers as any)?.foodPreference || "vegetarian");
  const healthIssues: string[] = Array.isArray((userData?.quizAnswers as any)?.healthIssues)
    ? (userData?.quizAnswers as any).healthIssues
    : ["none"];

  // Stored daily mode (energy check-in)
  const dailyMode: DailyMode =
    userData?.progress?.dailyMode?.[today] ||
    (plan?.isGentle ? "gentle" : "standard");

  const isGentleModeActive = dailyMode !== "standard";

  // Build effective workout for today (adapting to Energy Check-In & per-exercise Gentle Swaps!)
  const baseWorkout: WorkoutDay | undefined = plan?.workouts?.[(activeDayNumber - 1) % 28];

  const effectiveWorkout: WorkoutDay | undefined = useMemo(() => {
    if (!baseWorkout) return undefined;

    if (dailyMode === "express") {
      return getExpressRoutine();
    }
    if (dailyMode === "posture") {
      return getPostureReliefRoutine();
    }

    const dayKey = `day_${activeDayNumber}`;
    const swaps = userData?.progress?.swappedExercises?.[dayKey] || {};

    return {
      ...baseWorkout,
      week: baseWorkout.week || Math.floor((activeDayNumber - 1) / 7) + 1,
      weekTheme:
        baseWorkout.weekTheme ||
        WEEK_THEMES[Math.floor((activeDayNumber - 1) / 7) % 4],
      warmup: (baseWorkout.warmup || []).map(enrichExercise),
      exercises: (baseWorkout.exercises || []).map((ex, i) => {
        const swapped = swaps[String(i)];
        return enrichExercise(swapped || ex);
      }),
      cooldown: (baseWorkout.cooldown || []).map(enrichExercise),
    };
  }, [baseWorkout, dailyMode, activeDayNumber, userData]);

  const effectiveMinutes =
    dailyMode === "express" ? 5 : dailyMode === "posture" ? 12 : quizMinutes;

  const todayMeal = plan?.meals?.[(activeDayNumber - 1) % 28];
  const todayMessage =
    plan?.motivationalMessages?.[(activeDayNumber - 1) % 28] ||
    "You showed up today — that's already a win for you and your family! 🌸";

  const isWorkoutDone = !!userData?.progress?.workoutsCompleted?.[today];

  // Handlers
  const handleDailyModeChange = async (nextMode: DailyMode) => {
    if (!user) return;
    await updateUserDocument({
      [`progress.dailyMode.${today}`]: nextMode,
    });
  };

  const handleSwapExercise = async (exerciseIndex: number, currentName: string) => {
    if (!user) return;
    const avoidList: string[] = [];
    if (healthIssues.includes("knee_pain")) {
      avoidList.push("Supported squats (hold chair)", "Standing hip circles");
    }
    const replacement = getGentleSwap(currentName, avoidList);
    const dayKey = `day_${activeDayNumber}`;
    await updateUserDocument({
      [`progress.swappedExercises.${dayKey}.${exerciseIndex}`]: replacement,
    });
  };

  const handleMarkDone = async (forceTrue = false) => {
    if (!user) return;
    const newVal = forceTrue ? true : !isWorkoutDone;
    if (newVal) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 5500);
    }
    await updateUserDocument({
      [`progress.workoutsCompleted.${today}`]: newVal,
    });
  };

  const handleToggleGlass = async (glassIndex: number) => {
    if (!user) return;
    const newCount = glassIndex < waterGlasses ? glassIndex : glassIndex + 1;
    setWaterGlasses(newCount);
    await updateUserDocument({
      [`progress.waterIntake.${today}`]: newCount,
    });
  };

  const handleAdjustWater = async (delta: number) => {
    if (!user) return;
    const nextVal = Math.max(0, Math.min(8, waterGlasses + delta));
    setWaterGlasses(nextVal);
    await updateUserDocument({
      [`progress.waterIntake.${today}`]: nextVal,
    });
  };

  const handleToggleGroceryItem = async (slug: string, checked: boolean) => {
    if (!user) return;
    await updateUserDocument({
      [`progress.groceryChecked.${slug}`]: checked,
    });
  };

  const handleSaveMoodWin = async (mood: string, note: string) => {
    if (!user) return;
    const entry: MoodWinEntry = { mood, ...(note ? { note } : {}) };
    await updateUserDocument({
      [`progress.moodWins.${today}`]: entry,
    });
  };

  const handleSaveWeight = async (weight: number) => {
    if (!user) return;
    await updateUserDocument({
      [`progress.weightLog.${today}`]: weight,
    });
  };

  const handleShufflePlan = async () => {
    if (!user || !userData?.quizAnswers) return;
    setShufflingPlan(true);
    try {
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAnswers: userData.quizAnswers }),
      });
      const data = await res.json();
      if (data.plan) {
        await updateUserDocument({ plan: data.plan });
      }
    } catch (err) {
      console.error("Failed to shuffle plan:", err);
    } finally {
      setShufflingPlan(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  // Weekly 7-day progress calculation
  const weekProgress = useMemo(() => {
    const progress = userData?.progress?.workoutsCompleted || {};
    const days = [];
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = getLocalYMD(d);
      days.push({
        label: dayLabels[i],
        date: d.getDate(),
        done: !!progress[dateStr],
        isToday: dateStr === today,
      });
    }
    return days;
  }, [userData, today]);

  const weekDoneCount = weekProgress.filter((d) => d.done).length;

  // Loading Skeletons
  if (loading || !plan || !effectiveWorkout) {
    return (
      <main className="min-h-screen bg-cream py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
          <div className="h-10 bg-peach-200/50 rounded-2xl w-2/3" />
          <div className="h-6 bg-peach-200/40 rounded-xl w-1/3" />
          <div className="card-soft h-64 bg-peach-100/50 rounded-3xl" />
          <div className="card-soft h-40 bg-peach-100/50 rounded-3xl" />
        </div>
      </main>
    );
  }

  const displayName = userData?.displayName || user?.displayName || "Mama";
  const roadmapWeekDays = plan.workouts.slice(
    (selectedRoadmapWeek - 1) * 7,
    selectedRoadmapWeek * 7
  );

  return (
    <main className="min-h-screen bg-cream text-plum pb-20 selection:bg-blush-200">
      {/* ───────── STICKY HEADER ───────── */}
      <header className="bg-white/85 backdrop-blur-md sticky top-0 z-30 border-b border-peach-200/70 px-4 sm:px-6 py-3.5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-peach-200 text-plum font-heading font-bold flex items-center justify-center">
              F
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-plum leading-none block">
                Fit Mom 20
              </span>
              <span className="text-[10px] text-plum/60 font-medium">
                Day {naturalPlanDay} of 28
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum/80 hover:text-plum bg-cream-50 hover:bg-peach-100 px-3 py-2 rounded-xl border border-peach-200 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum/70 hover:text-plum hover:bg-peach-100 px-3 py-2 rounded-xl transition-colors"
              title="Log out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>

        {/* ───────── TAB BAR ───────── */}
        <div className="max-w-3xl mx-auto mt-3 grid grid-cols-4 gap-1.5 bg-cream-50 p-1 rounded-2xl border border-peach-200/80">
          {[
            { id: "today", label: "Today", icon: Flame },
            { id: "roadmap", label: "4-Wk Plan", icon: LayoutList },
            { id: "meals", label: "Meals & Shop", icon: ShoppingBasket },
            { id: "progress", label: "My Wins", icon: Trophy },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`py-2 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  active
                    ? "bg-plum text-white shadow-xs"
                    : "text-plum/70 hover:text-plum hover:bg-peach-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ======================================================= */}
        {/* TAB 1: TODAY                                            */}
        {/* ======================================================= */}
        {activeTab === "today" && (
          <div className="space-y-6 animate-fade-in">
            {/* Greeting Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
                  {greeting}, {displayName} 🌸
                </h1>
                <p className="text-xs sm:text-sm text-plum/70 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-plum/60" /> {todayFormatted} •{" "}
                  <span className="font-semibold text-plum">
                    {effectiveWorkout.weekTheme || `Plan Day ${activeDayNumber}`}
                  </span>
                </p>
              </div>

              {previewDayNumber !== null && (
                <button
                  type="button"
                  onClick={() => setPreviewDayNumber(null)}
                  className="text-xs font-bold bg-peach-100 hover:bg-peach-200 text-plum px-3 py-1.5 rounded-xl border border-peach-300 self-start"
                >
                  Viewing Day {previewDayNumber} • Return to Today
                </button>
              )}
            </div>

            {/* Motivational Quote */}
            <div className="bg-peach-100/70 border border-peach-200/80 rounded-2xl p-4 text-center">
              <p className="text-sm sm:text-base font-medium text-plum flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-plum/70 shrink-0" />
                {todayMessage}
              </p>
            </div>

            {/* ─── LIVE ENERGY & BODY CHECK-IN ADAPTOR ─── */}
            <div className="card-soft p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-plum/70 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-blush-400 fill-blush-300" />
                  How is your energy right now?
                </span>
                <span className="text-[11px] text-plum/60">
                  Instantly adapts today&apos;s session
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    id: "standard" as DailyMode,
                    label: "Ready to Move",
                    sub: `${quizMinutes}m Plan`,
                    icon: Flame,
                  },
                  {
                    id: "gentle" as DailyMode,
                    label: "Low Energy",
                    sub: "Gentle Tips On",
                    icon: BatteryLow,
                  },
                  {
                    id: "posture" as DailyMode,
                    label: "Sore Back / Neck",
                    sub: "Carrying Unwind",
                    icon: Accessibility,
                  },
                  {
                    id: "express" as DailyMode,
                    label: "5-Min Rescue",
                    sub: "Short Nap Time",
                    icon: Zap,
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const active = dailyMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleDailyModeChange(opt.id)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${
                        active
                          ? "border-plum bg-peach-100/75 shadow-xs"
                          : "border-peach-100 bg-cream-50 hover:border-peach-300"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 mb-1 ${
                          active ? "text-plum" : "text-plum/55"
                        }`}
                      />
                      <span className="block text-xs font-bold text-plum leading-tight">
                        {opt.label}
                      </span>
                      <span className="block text-[10px] text-plum/65 mt-0.5">
                        {opt.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mode Contextual Banner */}
            {dailyMode === "gentle" && (
              <div className="bg-sage-50 border border-sage-200 rounded-2xl p-3.5 text-xs text-plum/80 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Gentle recovery mode active:</strong> Take your time, use the gentler exercise options shown inside each step, or tap &ldquo;Gentle Swap&rdquo; below any exercise. Consult your doctor if managing postpartum recovery or pain.
                </span>
              </div>
            )}
            {dailyMode === "posture" && (
              <div className="bg-blush-50 border border-blush-200 rounded-2xl p-3.5 text-xs text-plum/80 flex items-start gap-2.5">
                <Heart className="w-4 h-4 text-blush-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Feeding &amp; Carrying Unwind loaded:</strong> Today&apos;s routine opens rounded shoulders, softens neck tension, and gently supports your lower back &amp; pelvic floor.
                </span>
              </div>
            )}
            {dailyMode === "express" && (
              <div className="bg-peach-100/80 border border-peach-300 rounded-2xl p-3.5 text-xs text-plum/85 flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-plum shrink-0 mt-0.5" />
                <span>
                  <strong>5-Minute Nap-Time Rescue loaded:</strong> On exhausted days, 5 gentle minutes keeps your habit alive without draining your battery!
                </span>
              </div>
            )}

            {/* Celebration Banner */}
            {celebrate && (
              <div className="bg-blush-100 border-2 border-blush-300 text-plum p-4 rounded-2xl text-center shadow-soft animate-fade-in">
                <span className="text-2xl block mb-1">🎉</span>
                <p className="font-heading font-bold text-lg">
                  Amazing job taking care of yourself today!
                </p>
                <p className="text-xs text-plum/80">
                  Head over to &ldquo;My Wins&rdquo; whenever you&apos;d like to save how you feel after moving.
                </p>
              </div>
            )}

            {/* ───────── TODAY'S WORKOUT CARD ───────── */}
            <div className="card-soft shadow-soft-md space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-peach-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-peach-100 text-plum flex items-center justify-center">
                      <Flame className="w-4 h-4" />
                    </span>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-plum">
                      {effectiveWorkout.isRestDay
                        ? "Rest & Recovery Day"
                        : effectiveWorkout.focusTitle || `Day ${activeDayNumber} Routine`}
                    </h2>
                  </div>
                  <p className="text-xs text-plum/65 mt-1">
                    {effectiveWorkout.isRestDay
                      ? "Gentle breathing, light walking, or simply resting without guilt."
                      : `Target: ${effectiveMinutes} minutes • Living room safe • Tap any exercise for form tips`}
                  </p>
                </div>

                {/* Mark as Done Button */}
                <button
                  type="button"
                  onClick={() => handleMarkDone(false)}
                  className={`py-2.5 px-5 rounded-2xl font-semibold text-sm inline-flex items-center gap-2 transition-all shadow-xs ${
                    isWorkoutDone
                      ? "bg-sage-100 text-sage-700 border border-sage-300"
                      : "bg-plum text-white hover:bg-plum-500"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${isWorkoutDone ? "text-sage-600" : "text-white"}`}
                  />
                  {isWorkoutDone ? "Completed! ✓" : "Mark as Done"}
                </button>
              </div>

              {effectiveWorkout.isRestDay ? (
                <div className="bg-cream-50 p-6 rounded-2xl border border-peach-200 text-center space-y-4">
                  <Sun className="w-9 h-9 text-peach-400 mx-auto" />
                  <div>
                    <h3 className="font-heading font-bold text-xl text-plum">
                      Today is your scheduled Rest &amp; Breath Day
                    </h3>
                    <p className="text-sm text-plum/75 max-w-md mx-auto mt-1">
                      Muscle repair happens while you rest. If you feel stiff from carrying little ones, try our 2-minute gentle neck &amp; deep breathing reset below — or simply switch to &ldquo;5-Min Rescue&rdquo; above if you want light movement!
                    </p>
                  </div>

                  {effectiveWorkout.cooldown.length > 0 && (
                    <div className="text-left max-w-md mx-auto space-y-2 pt-2">
                      {effectiveWorkout.cooldown.map((c, idx) => {
                        const rich = enrichExercise(c);
                        return (
                          <div
                            key={idx}
                            className="bg-white p-3.5 rounded-xl border border-peach-100 text-xs"
                          >
                            <div className="flex justify-between font-bold text-plum">
                              <span>{rich.name}</span>
                              <span className="text-plum/60">{rich.duration}</span>
                            </div>
                            <p className="text-plum/70 mt-1">{rich.breathingCue}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Guided Step-by-Step Player + Countdown Clock */}
                  <GuidedWorkoutPlayer
                    workout={effectiveWorkout}
                    targetMinutes={effectiveMinutes}
                    isGentleMode={isGentleModeActive}
                    isCompleted={isWorkoutDone}
                    onCompleteWorkout={() => handleMarkDone(true)}
                  />

                  {/* Full Exercise Breakdown with Expandable Cues & Gentle Swaps */}
                  <div className="space-y-4">
                    {/* Warm up */}
                    <div>
                      <h3 className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-peach-400" /> Part 1: Warm-Up
                      </h3>
                      <div className="space-y-2">
                        {effectiveWorkout.warmup.map((ex, i) => {
                          const key = `warm-${i}`;
                          const isOpen = expandedExerciseKey === key;
                          return (
                            <div
                              key={key}
                              className="bg-cream-50 rounded-xl border border-peach-100 overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedExerciseKey(isOpen ? null : key)
                                }
                                className="w-full p-3.5 flex items-center justify-between text-sm text-left"
                              >
                                <span className="font-medium text-plum">• {ex.name}</span>
                                <span className="flex items-center gap-2 text-xs text-plum/60 font-semibold">
                                  {ex.duration}
                                  {isOpen ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </span>
                              </button>
                              {isOpen && (
                                <div className="px-4 pb-3.5 pt-2 text-xs text-plum/80 border-t border-peach-100/80 space-y-2.5 bg-white/50">
                                  <ExerciseDemoDisplay
                                    exerciseName={ex.name}
                                    isPlaying
                                    isGentle={isGentleModeActive}
                                    compact
                                  />
                                  {ex.formCues?.map((c, idx) => (
                                    <p key={idx}>• {c}</p>
                                  ))}
                                  <p className="text-sage-700 font-medium flex items-center gap-1 pt-1">
                                    <Wind className="w-3 h-3" /> {ex.breathingCue}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Main movements */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs uppercase font-bold text-plum/70 tracking-wider flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-sage-400" />
                          Part 2: Focus Movements ({effectiveWorkout.exercises.length})
                        </h3>
                        <span className="text-[11px] text-plum/55">
                          Tap any card for cues or to swap
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {effectiveWorkout.exercises.map((ex, i) => {
                          const key = `main-${i}`;
                          const isOpen = expandedExerciseKey === key;
                          return (
                            <div
                              key={key}
                              className="bg-cream-50 rounded-xl border border-peach-200/70 overflow-hidden"
                            >
                              <div className="p-3.5 flex items-center justify-between gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedExerciseKey(isOpen ? null : key)
                                  }
                                  className="text-left flex-1"
                                >
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-sm text-plum">
                                      {i + 1}. {ex.name}
                                    </span>
                                    {ex.focus && (
                                      <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-full border border-peach-200 text-plum/70">
                                        {ex.focus}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-plum/60 block mt-0.5">
                                    {isGentleModeActive
                                      ? `Gentle option: ${ex.gentleVariation || "Controlled slow tempo"}`
                                      : "Tap to view safe form cues & breathing"}
                                  </span>
                                </button>

                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs text-plum font-bold bg-white px-2.5 py-1 rounded-lg border border-peach-200">
                                    {ex.duration}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedExerciseKey(isOpen ? null : key)
                                    }
                                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-peach-100 hover:bg-peach-200 text-plum transition-colors"
                                    aria-label="Toggle visual exercise demo"
                                  >
                                    <Video className="w-3 h-3" />
                                    <span className="hidden sm:inline">{isOpen ? "Hide" : "Watch Demo"}</span>
                                    {isOpen ? (
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {isOpen && (
                                <div className="px-4 pb-4 pt-3 border-t border-peach-200/60 bg-white/60 space-y-3 text-xs">
                                  <ExerciseDemoDisplay
                                    exerciseName={ex.name}
                                    isPlaying
                                    isGentle={isGentleModeActive}
                                    compact
                                  />

                                  <div className="space-y-1 text-plum/85">
                                    <span className="font-bold text-[10px] uppercase tracking-wider text-plum/60 block">
                                      How to do it safely:
                                    </span>
                                    {ex.formCues?.map((c, idx) => (
                                      <p key={idx}>• {c}</p>
                                    ))}
                                  </div>

                                  <div className="bg-sage-50 p-2.5 rounded-lg border border-sage-200/70 text-sage-800 flex items-start gap-1.5">
                                    <Wind className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    <span>
                                      <strong>Breathing:</strong> {ex.breathingCue}
                                    </span>
                                  </div>

                                  {ex.gentleVariation && (
                                    <div className="bg-blush-50/70 p-2.5 rounded-lg border border-blush-200/60 text-plum/85">
                                      <strong>Easier modification:</strong> {ex.gentleVariation}
                                    </div>
                                  )}

                                  {dailyMode !== "express" && dailyMode !== "posture" && (
                                    <div className="pt-1 flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => handleSwapExercise(i, ex.name)}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-plum bg-peach-100 hover:bg-peach-200 px-3 py-1.5 rounded-lg border border-peach-200 transition-colors"
                                      >
                                        <RefreshCw className="w-3 h-3" /> Swap for Gentler Movement
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cooldown */}
                    <div>
                      <h3 className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blush-400" /> Part 3: Calming Cool-Down
                      </h3>
                      <div className="space-y-2">
                        {effectiveWorkout.cooldown.map((ex, i) => {
                          const key = `cool-${i}`;
                          const isOpen = expandedExerciseKey === key;
                          return (
                            <div
                              key={key}
                              className="bg-cream-50 rounded-xl border border-peach-100 overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedExerciseKey(isOpen ? null : key)
                                }
                                className="w-full p-3.5 flex items-center justify-between text-sm text-left"
                              >
                                <span className="font-medium text-plum">• {ex.name}</span>
                                <span className="flex items-center gap-2 text-xs text-plum/60 font-semibold">
                                  {ex.duration}
                                  {isOpen ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </span>
                              </button>
                              {isOpen && (
                                <div className="px-4 pb-3.5 pt-2 text-xs text-plum/80 border-t border-peach-100/80 space-y-2.5 bg-white/50">
                                  <ExerciseDemoDisplay
                                    exerciseName={ex.name}
                                    isPlaying
                                    isGentle={isGentleModeActive}
                                    compact
                                  />
                                  {ex.formCues?.map((c, idx) => (
                                    <p key={idx}>• {c}</p>
                                  ))}
                                  <p className="text-sage-700 font-medium flex items-center gap-1 pt-1">
                                    <Wind className="w-3 h-3" /> {ex.breathingCue}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ───────── 7-DAY STREAK ROW ───────── */}
            <div className="card-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading font-bold text-lg text-plum flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sage-500" /> This Week&apos;s Rhythm
                  </h2>
                  <p className="text-xs text-plum/60">
                    Showed up {weekDoneCount} of 7 days this week — every day counts!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("progress")}
                  className="text-xs font-semibold bg-peach-100 hover:bg-peach-200 text-plum px-3 py-1 rounded-full border border-peach-200 transition-colors"
                >
                  28-Day Map →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {weekProgress.map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-[11px] font-bold text-plum/60 uppercase mb-1">
                      {day.label}
                    </span>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all ${
                        day.done
                          ? "bg-sage-400 text-white shadow-xs"
                          : day.isToday
                          ? "bg-peach-100 border-2 border-plum text-plum"
                          : "bg-cream-50 border border-peach-200 text-plum/30"
                      }`}
                    >
                      {day.done ? <CheckCircle2 className="w-5 h-5" /> : day.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ───────── WATER INTAKE TRACKER ───────── */}
            <div className="card-soft">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="font-heading font-bold text-lg text-plum flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sage-500" /> Daily Water Intake
                  </h2>
                  <p className="text-xs text-plum/60">
                    Target: 8 glasses (approx. 2 liters) • {waterGlasses} completed
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAdjustWater(-1)}
                    className="w-8 h-8 rounded-xl bg-peach-100 hover:bg-peach-200 text-plum font-bold flex items-center justify-center text-sm transition-colors"
                    title="Remove 1 glass"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustWater(1)}
                    className="w-8 h-8 rounded-xl bg-plum hover:bg-plum-500 text-white font-bold flex items-center justify-center text-sm transition-colors"
                    title="Add 1 glass"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-8 gap-1.5 sm:gap-3 py-2">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const isFilled = idx < waterGlasses;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleGlass(idx)}
                      className={`h-12 rounded-xl flex items-center justify-center transition-all ${
                        isFilled
                          ? "bg-sage-200 border-2 border-sage-400 text-sage-800 scale-100"
                          : "bg-cream-50 border border-peach-200 text-plum/20 hover:border-peach-300"
                      }`}
                      title={`Glass ${idx + 1}: ${isFilled ? "Filled" : "Tap to fill"}`}
                    >
                      <Droplets
                        className={`w-5 h-5 ${isFilled ? "fill-sage-500 text-sage-600" : ""}`}
                      />
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-plum/55 text-center pt-1">
                {waterGlasses >= 8
                  ? "🌟 Wonderful hydration today, Mama!"
                  : `${8 - waterGlasses} more glasses to reach today's hydration target.`}
              </p>
            </div>

            {/* ───────── QUICK MEALS LINK CARD ───────── */}
            {todayMeal && (
              <div className="card-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-peach-50/50 border-peach-200">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-plum/60 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-plum" /> Today&apos;s Meal Sneak Peek
                  </span>
                  <p className="text-sm font-semibold text-plum">
                    Breakfast: {todayMeal.breakfast}
                  </p>
                  <p className="text-xs text-plum/70">
                    Lunch: {todayMeal.lunch}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("meals")}
                  className="btn-secondary py-2.5 px-4 text-xs shrink-0"
                >
                  Recipes &amp; Grocery List <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 2: 4-WEEK ROADMAP                                   */}
        {/* ======================================================= */}
        {activeTab === "roadmap" && (
          <div className="space-y-6 animate-fade-in">
            <div className="card-soft space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-peach-200">
                <div>
                  <h2 className="font-heading font-bold text-xl text-plum flex items-center gap-2">
                    <LayoutList className="w-5 h-5 text-plum" /> Your 4-Week Progression Plan
                  </h2>
                  <p className="text-xs text-plum/65 mt-0.5">
                    Browse upcoming days, jump into any routine, or refresh exercise variety anytime.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleShufflePlan}
                  disabled={shufflingPlan}
                  className="btn-secondary py-2 px-3.5 text-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${shufflingPlan ? "animate-spin" : ""}`} />
                  {shufflingPlan ? "Refreshing..." : "Refresh Exercise Variety"}
                </button>
              </div>

              {/* Week 1-4 Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((wk) => {
                  const active = selectedRoadmapWeek === wk;
                  return (
                    <button
                      key={wk}
                      type="button"
                      onClick={() => setSelectedRoadmapWeek(wk)}
                      className={`p-3 rounded-2xl border-2 text-left transition-all ${
                        active
                          ? "border-plum bg-peach-100/75 shadow-xs"
                          : "border-peach-100 bg-cream-50 hover:border-peach-300"
                      }`}
                    >
                      <span className="text-xs font-bold text-plum block">
                        Week {wk}
                      </span>
                      <span className="text-[10px] text-plum/65 line-clamp-1 mt-0.5">
                        {WEEK_THEMES[wk - 1].replace(`Week ${wk}: `, "")}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 7 Days List for Selected Week */}
              <div className="space-y-3">
                {roadmapWeekDays.map((wDay) => {
                  const isTodayNatural = wDay.day === naturalPlanDay;
                  return (
                    <div
                      key={wDay.day}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isTodayNatural
                          ? "bg-peach-50/90 border-plum/40 shadow-xs"
                          : "bg-cream-50 border-peach-100"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold text-plum bg-white px-2.5 py-0.5 rounded-lg border border-peach-200">
                            Day {wDay.day} • {wDay.dayOfWeek}
                          </span>
                          {isTodayNatural && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-plum text-white px-2 py-0.5 rounded-full">
                              Your Current Day
                            </span>
                          )}
                          <span className="text-xs font-bold text-plum">
                            {wDay.focusTitle || (wDay.isRestDay ? "Rest Day" : "20-Min Routine")}
                          </span>
                        </div>

                        <p className="text-xs text-plum/70">
                          {wDay.isRestDay
                            ? "Gentle rest, breathing, or stroller walk"
                            : wDay.exercises.map((e) => e.name).join(" • ")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewDayNumber(wDay.day);
                          setActiveTab("today");
                        }}
                        className="btn-secondary py-2 px-3.5 text-xs shrink-0 self-start sm:self-center"
                      >
                        {wDay.isRestDay ? "Open Rest Day" : "Load Into Player →"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* TAB 3: MEALS & GROCERY                                  */}
        {/* ======================================================= */}
        {activeTab === "meals" && (
          <MealsAndGroceryTab
            meals={plan.meals}
            currentDayIndex={activeDayNumber - 1}
            foodPreference={foodPreference}
            groceryChecked={userData?.progress?.groceryChecked || {}}
            onToggleGroceryItem={handleToggleGroceryItem}
          />
        )}

        {/* ======================================================= */}
        {/* TAB 4: PROGRESS & NON-SCALE WINS                        */}
        {/* ======================================================= */}
        {activeTab === "progress" && (
          <ProgressAndWinsTab
            today={today}
            workoutsCompleted={userData?.progress?.workoutsCompleted || {}}
            waterIntake={userData?.progress?.waterIntake || {}}
            weightLog={userData?.progress?.weightLog || {}}
            moodWins={userData?.progress?.moodWins || {}}
            onSaveMoodWin={handleSaveMoodWin}
            onSaveWeight={handleSaveWeight}
          />
        )}
      </div>
    </main>
  );
}
