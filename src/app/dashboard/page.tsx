"use client";
// =============================================================
// DASHBOARD — Members Area with Timer, Streak, Water, & Gentle Mode
// =============================================================
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Play,
  Pause,
  RotateCcw,
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
  Scale,
  Utensils,
  Sun,
  Moon,
  Heart,
  Timer,
  AlertCircle,
} from "lucide-react";

interface Exercise {
  name: string;
  duration: string;
}

interface WorkoutDay {
  day: number;
  dayOfWeek: string;
  warmup: Exercise[];
  exercises: Exercise[];
  cooldown: Exercise[];
  isRestDay: boolean;
}

interface MealDay {
  breakfast: string;
  lunch: string;
  dinner: string;
  snack: string;
}

interface Plan {
  workouts: WorkoutDay[];
  meals: MealDay[];
  isGentle: boolean;
  doctorReminder: boolean;
  motivationalMessages: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, userData, loading, refreshUserData, updateUserDocument, logoutUser } = useAuth();

  // Date and Time calculation
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
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

  // UI States
  const [waterGlasses, setWaterGlasses] = useState<number>(0);
  const [weightInput, setWeightInput] = useState<string>("");
  const [showWeightLog, setShowWeightLog] = useState<boolean>(false);
  const [showMeals, setShowMeals] = useState<boolean>(false);
  const [celebrate, setCelebrate] = useState<boolean>(false);

  // Gentle mode override state
  const [gentleModeOverride, setGentleModeOverride] = useState<boolean | null>(null);

  // 20-Minute Timer state (20 mins = 1200 seconds)
  const timerDuration = useMemo(() => {
    const mins = (userData?.quizAnswers as any)?.exerciseMinutes || 20;
    return mins * 60;
  }, [userData]);

  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Reset timer if duration setting changes
  useEffect(() => {
    setTimeLeft(timerDuration);
    setIsTimerRunning(false);
  }, [timerDuration]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Auto trigger celebration if workout finishes
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

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

  // Sync today's water glasses
  useEffect(() => {
    if (userData?.progress?.waterIntake?.[today] !== undefined) {
      setWaterGlasses(userData.progress.waterIntake[today]);
    }
  }, [userData, today]);

  // Auto-generate plan if user is paid or demo but plan hasn't been generated yet
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

  // Calculate plan day
  const getPlanDay = useCallback((): number => {
    if (!userData?.plan) return 1;
    const progress = userData.progress?.workoutsCompleted || {};
    const dates = Object.keys(progress).sort();
    if (dates.length === 0) return 1;

    const startDate = new Date(dates[0]);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return (Math.max(0, diffDays) % 28) + 1;
  }, [userData]);

  const planDay = getPlanDay();
  const plan = userData?.plan as Plan | undefined;
  const todayWorkout = plan?.workouts?.[(planDay - 1) % 28];
  const todayMeal = plan?.meals?.[(planDay - 1) % 28];
  const todayMessage =
    plan?.motivationalMessages?.[(planDay - 1) % 28] ||
    "You showed up today — that's already a win for you and your family! 🌸";

  const isWorkoutDone = !!userData?.progress?.workoutsCompleted?.[today];

  // Gentle mode logic (respects plan default or live toggle)
  const isGentleModeActive =
    gentleModeOverride !== null ? gentleModeOverride : !!plan?.isGentle;

  // Toggle workout done
  const handleToggleDone = async () => {
    if (!user) return;
    const newVal = !isWorkoutDone;
    if (newVal) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 5000);
    }
    await updateUserDocument({
      [`progress.workoutsCompleted.${today}`]: newVal,
    });
  };

  // Water tracker
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

  // Weight log
  const handleSaveWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !weightInput) return;
    await updateUserDocument({
      [`progress.weightLog.${today}`]: parseFloat(weightInput),
    });
    setWeightInput("");
  };

  // Logout
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
      const dateStr = d.toISOString().split("T")[0];
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
  if (loading || !plan) {
    return (
      <main className="min-h-screen bg-cream py-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
          <div className="h-10 bg-peach-200/50 rounded-2xl w-2/3" />
          <div className="h-6 bg-peach-200/40 rounded-xl w-1/3" />
          <div className="card-soft h-64 bg-peach-100/50 rounded-3xl" />
          <div className="card-soft h-40 bg-peach-100/50 rounded-3xl" />
        </div>
      </main>
    );
  }

  const displayName = userData?.displayName || user?.displayName || "Mama";

  return (
    <main className="min-h-screen bg-cream text-plum pb-16 selection:bg-blush-200">
      {/* ───────── HEADER ───────── */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-peach-200/70 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-peach-200 text-plum font-heading font-bold flex items-center justify-center">
              F
            </div>
            <span className="font-heading font-bold text-lg text-plum">Fit Mom 20</span>
          </div>

          <div className="flex items-center gap-3">
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
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* ───────── GREETING & ENCOURAGEMENT ───────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-plum">
              {greeting}, {displayName} 🌸
            </h1>
            <p className="text-sm text-plum/70 flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-plum/60" /> {todayFormatted} • Plan Day {planDay}
            </p>
          </div>

          {/* Gentle Mode Live Switch */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-2xl border border-peach-200 shadow-xs shrink-0 self-start sm:self-auto">
            <span className="text-xs font-semibold text-plum flex items-center gap-1.5">
              <Heart className={`w-3.5 h-3.5 ${isGentleModeActive ? "text-blush-400 fill-blush-400" : "text-plum/50"}`} />
              Gentle Mode
            </span>
            <button
              type="button"
              onClick={() => setGentleModeOverride(!isGentleModeActive)}
              className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none ${
                isGentleModeActive ? "bg-plum" : "bg-peach-200"
              }`}
              title="Toggle gentle mode for tired days or postpartum recovery"
            >
              <span
                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                  isGentleModeActive ? "left-5" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Daily Motivational Message */}
        <div className="bg-peach-100/70 border border-peach-200/80 rounded-2xl p-4 text-center">
          <p className="text-sm sm:text-base font-medium text-plum flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-plum/70 shrink-0" />
            {todayMessage}
          </p>
        </div>

        {/* Gentle Mode Alert */}
        {isGentleModeActive && (
          <div className="bg-sage-50 border border-sage-200 rounded-2xl p-3.5 text-xs text-plum/80 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0 mt-0.5" />
            <span>
              <strong>Gentle recovery mode active:</strong> Today&apos;s exercises avoid heavy spinal strain and deep knee flexion. Rest whenever needed and remember to consult your physician if managing pain or postpartum recovery.
            </span>
          </div>
        )}

        {/* Celebration Banner when done */}
        {celebrate && (
          <div className="bg-blush-100 border-2 border-blush-300 text-plum p-4 rounded-2xl text-center shadow-soft animate-fade-in">
            <span className="text-2xl block mb-1">🎉</span>
            <p className="font-heading font-bold text-lg">Amazing job taking time for yourself!</p>
            <p className="text-xs text-plum/80">Every 20 minutes is a gift to your strength and your family.</p>
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
                  {todayWorkout?.isRestDay ? "Rest & Recovery Day" : "Today's 20-Minute Routine"}
                </h2>
              </div>
              <p className="text-xs text-plum/65 mt-1">
                {todayWorkout?.isRestDay
                  ? "Gentle breathing, light walking, or simply resting without guilt."
                  : "Target: Low impact, living room safe, restorative strength."}
              </p>
            </div>

            {/* Mark as Done Button */}
            {!todayWorkout?.isRestDay && (
              <button
                type="button"
                onClick={handleToggleDone}
                className={`py-2.5 px-5 rounded-2xl font-semibold text-sm inline-flex items-center gap-2 transition-all shadow-xs ${
                  isWorkoutDone
                    ? "bg-sage-100 text-sage-700 border border-sage-300"
                    : "bg-plum text-white hover:bg-plum-500"
                }`}
              >
                <CheckCircle2 className={`w-4 h-4 ${isWorkoutDone ? "text-sage-600" : "text-white"}`} />
                {isWorkoutDone ? "Completed! ✓" : "Mark as Done"}
              </button>
            )}
          </div>

          {todayWorkout?.isRestDay ? (
            <div className="bg-cream-50 p-6 rounded-2xl border border-peach-200 text-center space-y-3">
              <Sun className="w-8 h-8 text-peach-400 mx-auto" />
              <h3 className="font-heading font-bold text-lg text-plum">
                Today is your scheduled rest day
              </h3>
              <p className="text-sm text-plum/75 max-w-md mx-auto">
                Muscle recovery is where true fitness builds. Hydrate, take a 10-minute stroll with the stroller if you feel like it, and give yourself full permission to relax.
              </p>
            </div>
          ) : (
            <>
              {/* 20-Minute Timer Box */}
              <div className="bg-cream-50 rounded-2xl p-5 border border-peach-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-peach-200 flex items-center justify-center text-plum shadow-xs">
                    <Timer className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-plum/60 block">
                      Routine Timer
                    </span>
                    <span className="text-3xl font-heading font-extrabold text-plum font-mono">
                      {formatTimer(timeLeft)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="btn-primary py-2.5 px-5 text-sm flex-1 sm:flex-initial"
                  >
                    {isTimerRunning ? (
                      <>
                        <Pause className="w-4 h-4" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Start Timer
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimeLeft(timerDuration);
                    }}
                    className="btn-secondary py-2.5 px-3.5 text-xs"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Exercises List */}
              <div className="space-y-4">
                {/* Warm up */}
                <div>
                  <h3 className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-peach-400" /> Part 1: Warm-Up
                  </h3>
                  <div className="space-y-2">
                    {todayWorkout?.warmup.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-cream-50 p-3.5 rounded-xl border border-peach-100 flex items-center justify-between text-sm"
                      >
                        <span className="font-medium text-plum">• {ex.name}</span>
                        <span className="text-xs text-plum/60 font-semibold">{ex.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main 3 exercises */}
                <div>
                  <h3 className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sage-400" /> Part 2: 3 Simple Movements
                  </h3>
                  <div className="space-y-2">
                    {todayWorkout?.exercises.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-cream-50 p-3.5 rounded-xl border border-peach-100 flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="font-semibold text-plum block">
                            {i + 1}. {ex.name}
                          </span>
                          <span className="text-xs text-plum/60">
                            {isGentleModeActive ? "Gentle tempo, stop before fatigue" : "Controlled form"}
                          </span>
                        </div>
                        <span className="text-xs text-plum font-bold bg-white px-2.5 py-1 rounded-lg border border-peach-200">
                          {ex.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cooldown */}
                <div>
                  <h3 className="text-xs uppercase font-bold text-plum/70 tracking-wider mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blush-400" /> Part 3: Calming Cool-Down
                  </h3>
                  <div className="space-y-2">
                    {todayWorkout?.cooldown.map((ex, i) => (
                      <div
                        key={i}
                        className="bg-cream-50 p-3.5 rounded-xl border border-peach-100 flex items-center justify-between text-sm"
                      >
                        <span className="font-medium text-plum">• {ex.name}</span>
                        <span className="text-xs text-plum/60 font-semibold">{ex.duration}</span>
                      </div>
                    ))}
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
                <CheckCircle2 className="w-4 h-4 text-sage-500" /> Weekly Streak
              </h2>
              <p className="text-xs text-plum/60">
                Completed {weekDoneCount} of 7 days this week
              </p>
            </div>
            <span className="text-xs font-semibold bg-peach-100 text-plum px-3 py-1 rounded-full border border-peach-200">
              Week Tracker
            </span>
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

          {/* 8 Tap-to-Fill Glasses */}
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
                  <Droplets className={`w-5 h-5 ${isFilled ? "fill-sage-500 text-sage-600" : ""}`} />
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-plum/50 text-center pt-1">
            {waterGlasses >= 8
              ? "🌟 Wonderful hydration today, Mama!"
              : `${8 - waterGlasses} more glasses to reach today's target.`}
          </p>
        </div>

        {/* ───────── OPTIONAL WEIGHT LOG (Hidden by default) ───────── */}
        <div className="card-soft">
          <button
            type="button"
            onClick={() => setShowWeightLog(!showWeightLog)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <h2 className="font-heading font-bold text-lg text-plum flex items-center gap-2">
                <Scale className="w-4 h-4 text-plum" /> Optional Weight Log
              </h2>
              <p className="text-xs text-plum/60 mt-0.5">
                Totally optional. Focus on how you feel.
              </p>
            </div>
            <span className="w-8 h-8 rounded-xl bg-peach-100 flex items-center justify-center text-plum">
              {showWeightLog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>

          {showWeightLog && (
            <div className="pt-4 mt-4 border-t border-peach-200 space-y-4 animate-fade-in">
              <form onSubmit={handleSaveWeight} className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="e.g. 62.5"
                  className="flex-1 bg-cream-50 border-2 border-peach-200 rounded-xl px-4 py-2.5 text-sm focus:border-plum focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!weightInput}
                  className="btn-primary py-2.5 px-5 text-sm disabled:opacity-40"
                >
                  Log kg
                </button>
              </form>

              {userData?.progress?.weightLog && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-plum/60 block mb-2">
                    Recent Entries
                  </span>
                  {Object.entries(userData.progress.weightLog)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 5)
                    .map(([date, weight]) => (
                      <div
                        key={date}
                        className="flex justify-between items-center text-xs bg-cream-50 p-2.5 rounded-lg border border-peach-100"
                      >
                        <span className="text-plum/70 font-medium">
                          {new Date(date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span className="font-bold text-plum">{String(weight)} kg</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ───────── TODAY'S MEAL IDEAS ───────── */}
        <div className="card-soft">
          <button
            type="button"
            onClick={() => setShowMeals(!showMeals)}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <h2 className="font-heading font-bold text-lg text-plum flex items-center gap-2">
                <Utensils className="w-4 h-4 text-plum" /> Today&apos;s Aligned Meal Ideas
              </h2>
              <p className="text-xs text-plum/60 mt-0.5">
                Simple nourishing recipes tailored to your food preference
              </p>
            </div>
            <span className="w-8 h-8 rounded-xl bg-peach-100 flex items-center justify-center text-plum">
              {showMeals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>

          {showMeals && todayMeal && (
            <div className="pt-4 mt-4 border-t border-peach-200 grid sm:grid-cols-2 gap-3 animate-fade-in">
              {[
                { label: "Breakfast", value: todayMeal.breakfast, icon: Sun },
                { label: "Lunch", value: todayMeal.lunch, icon: Sun },
                { label: "Dinner", value: todayMeal.dinner, icon: Moon },
                { label: "Snack", value: todayMeal.snack, icon: Heart },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-cream-50 p-3.5 rounded-xl border border-peach-100">
                    <span className="text-xs font-bold text-plum/60 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Icon className="w-3.5 h-3.5 text-plum/60" /> {m.label}
                    </span>
                    <p className="text-sm text-plum font-medium">{m.value}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
