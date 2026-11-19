"use client";
// =============================================================
// DASHBOARD — the main member area
// =============================================================
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// Types for the plan
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

  // Water & weight
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [weightInput, setWeightInput] = useState("");
  const [showWeightLog, setShowWeightLog] = useState(false);
  const [showMeals, setShowMeals] = useState(false);

  const today = new Date().toISOString().split("T")[0]; // "2024-01-15"

  // Redirect if not authenticated or not paid
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

  // Load today's data
  useEffect(() => {
    if (userData?.progress) {
      setWaterGlasses(userData.progress.waterIntake?.[today] || 0);
    }
  }, [userData, today]);

  // Auto-generate plan if user is marked paid (or demo) but plan hasn't been generated yet
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

  // Figure out which day of the plan we're on (1–28, then loop)
  const getPlanDay = useCallback((): number => {
    if (!userData?.plan) return 1;
    // Count days since the user started (from their first workout or today)
    const progress = userData.progress?.workoutsCompleted || {};
    const dates = Object.keys(progress).sort();
    if (dates.length === 0) return 1;

    const startDate = new Date(dates[0]);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return (diffDays % 28) + 1;
  }, [userData]);

  const planDay = getPlanDay();
  const plan = userData?.plan as Plan | undefined;
  const todayWorkout = plan?.workouts?.[(planDay - 1) % 28];
  const todayMeal = plan?.meals?.[(planDay - 1) % 28];
  const todayMessage = plan?.motivationalMessages?.[(planDay - 1) % 28] || "You've got this! 💪";
  const isWorkoutDone = userData?.progress?.workoutsCompleted?.[today] || false;

  // ─── Helpers to save data ───

  const toggleWorkoutDone = async () => {
    if (!user) return;
    const newVal = !isWorkoutDone;
    await updateUserDocument({
      [`progress.workoutsCompleted.${today}`]: newVal,
    });
  };

  const addWater = async () => {
    if (!user) return;
    const newAmount = waterGlasses + 1;
    setWaterGlasses(newAmount);

    await updateUserDocument({
      [`progress.waterIntake.${today}`]: newAmount,
    });
  };

  const removeWater = async () => {
    if (!user) return;
    if (waterGlasses <= 0) return;
    const newAmount = waterGlasses - 1;
    setWaterGlasses(newAmount);

    await updateUserDocument({
      [`progress.waterIntake.${today}`]: newAmount,
    });
  };

  const saveWeight = async () => {
    if (!user || !weightInput) return;
    await updateUserDocument({
      [`progress.weightLog.${today}`]: parseFloat(weightInput),
    });
    setWeightInput("");
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  // ─── Weekly progress ───
  const getWeekProgress = () => {
    const progress = userData?.progress?.workoutsCompleted || {};
    const days = [];
    const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

    // Get the Monday of this week
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
        done: !!progress[dateStr],
        isToday: dateStr === today,
      });
    }
    return days;
  };

  if (loading || !plan) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <p className="text-warm-400 animate-pulse text-lg">Loading your plan...</p>
      </div>
    );
  }

  const weekProgress = getWeekProgress();
  const weekDone = weekProgress.filter((d) => d.done).length;

  return (
    <main className="min-h-screen bg-cream-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p className="text-peach-500 font-extrabold text-sm tracking-widest">
              FIT MOM 20
            </p>
            <p className="text-warm-500 text-sm">
              Day {planDay} • {todayWorkout?.dayOfWeek}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-warm-400 text-sm hover:text-warm-600 transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-6">
        {/* Doctor reminder */}
        {plan.doctorReminder && (
          <div className="bg-peach-100 border border-peach-200 rounded-2xl p-4 text-sm text-warm-600">
            🩺 <strong>Gentle mode is on.</strong> Your plan uses easier exercises.
            Please check with your doctor before starting.
          </div>
        )}

        {/* Motivational message */}
        <div className="bg-sage-50 rounded-2xl p-5 text-center">
          <p className="text-sage-600 font-semibold text-lg">{todayMessage}</p>
        </div>

        {/* ───── TODAY'S WORKOUT ───── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-warm-800">
              {todayWorkout?.isRestDay ? "🌸 Rest Day" : "🏋️‍♀️ Today's Workout"}
            </h2>
            {!todayWorkout?.isRestDay && (
              <button
                onClick={toggleWorkoutDone}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  isWorkoutDone
                    ? "bg-sage-100 text-sage-600"
                    : "bg-warm-50 text-warm-400 hover:bg-sage-50"
                }`}
              >
                {isWorkoutDone ? "✅ Done!" : "☐ Mark done"}
              </button>
            )}
          </div>

          {todayWorkout?.isRestDay ? (
            <p className="text-warm-500">
              Your body needs rest to get stronger. Enjoy your day off!
              Take a gentle walk if you feel like it.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Warm-up */}
              <div>
                <h3 className="text-sm font-bold text-peach-500 uppercase tracking-wide mb-2">
                  🔥 Warm-up
                </h3>
                {todayWorkout?.warmup.map((ex, i) => (
                  <p key={i} className="text-warm-600 ml-4">
                    • {ex.name} — <span className="text-warm-400">{ex.duration}</span>
                  </p>
                ))}
              </div>

              {/* Main exercises */}
              <div>
                <h3 className="text-sm font-bold text-sage-500 uppercase tracking-wide mb-2">
                  💪 Exercises
                </h3>
                {todayWorkout?.exercises.map((ex, i) => (
                  <p key={i} className="text-warm-600 ml-4">
                    • {ex.name} — <span className="text-warm-400">{ex.duration}</span>
                  </p>
                ))}
              </div>

              {/* Cool-down */}
              <div>
                <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wide mb-2">
                  🧘 Cool-down
                </h3>
                {todayWorkout?.cooldown.map((ex, i) => (
                  <p key={i} className="text-warm-600 ml-4">
                    • {ex.name} — <span className="text-warm-400">{ex.duration}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ───── WEEKLY PROGRESS ───── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-warm-800 mb-4">
            📊 This Week — {weekDone}/7 days
          </h2>
          <div className="flex justify-between">
            {weekProgress.map((day, i) => (
              <div key={i} className="text-center">
                <span className="text-xs text-warm-400 font-semibold">{day.label}</span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 text-lg font-bold transition-all ${
                    day.done
                      ? "bg-sage-400 text-white"
                      : day.isToday
                      ? "bg-peach-100 text-peach-500 ring-2 ring-peach-300"
                      : "bg-warm-50 text-warm-300"
                  }`}
                >
                  {day.done ? "✓" : day.isToday ? "•" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ───── WATER TRACKER ───── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-warm-800 mb-4">
            💧 Water Intake
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: 8 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-2xl transition-all ${
                    i < waterGlasses ? "opacity-100" : "opacity-20"
                  }`}
                >
                  💧
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={removeWater}
                className="w-10 h-10 rounded-full bg-warm-50 text-warm-400 font-bold text-xl hover:bg-warm-100 transition-colors"
              >
                −
              </button>
              <span className="text-warm-700 font-bold w-6 text-center">{waterGlasses}</span>
              <button
                onClick={addWater}
                className="w-10 h-10 rounded-full bg-sage-50 text-sage-500 font-bold text-xl hover:bg-sage-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <p className="text-warm-400 text-sm mt-2">
            Goal: 8 glasses a day • {waterGlasses >= 8 ? "🎉 You did it!" : `${8 - waterGlasses} more to go`}
          </p>
        </div>

        {/* ───── WEIGHT LOG (optional) ───── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => setShowWeightLog(!showWeightLog)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-lg font-bold text-warm-800">
              ⚖️ Weight Log
            </h2>
            <span className="text-warm-400">{showWeightLog ? "▲" : "▼"}</span>
          </button>

          {showWeightLog && (
            <div className="mt-4">
              <div className="flex gap-3">
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="e.g. 62.5"
                  className="flex-1 border-2 border-warm-100 rounded-xl px-4 py-3 focus:border-sage-300 focus:outline-none"
                />
                <button
                  onClick={saveWeight}
                  disabled={!weightInput}
                  className="bg-sage-400 hover:bg-sage-500 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-40"
                >
                  Save
                </button>
              </div>

              {/* Show recent log */}
              {userData?.progress?.weightLog && (
                <div className="mt-4 space-y-1">
                  {Object.entries(userData.progress.weightLog)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .slice(0, 7)
                    .map(([date, weight]) => (
                      <div
                        key={date}
                        className="flex justify-between text-sm text-warm-500"
                      >
                        <span>
                          {new Date(date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span className="font-semibold">{String(weight)} kg</span>
                      </div>
                    ))}
                </div>
              )}

              <p className="text-warm-400 text-xs mt-3">
                Tracking weight is optional. Focus on how you feel!
              </p>
            </div>
          )}
        </div>

        {/* ───── TODAY'S MEALS ───── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <button
            onClick={() => setShowMeals(!showMeals)}
            className="w-full flex items-center justify-between"
          >
            <h2 className="text-lg font-bold text-warm-800">
              🥗 Today&apos;s Meal Ideas
            </h2>
            <span className="text-warm-400">{showMeals ? "▲" : "▼"}</span>
          </button>

          {showMeals && todayMeal && (
            <div className="mt-4 space-y-3">
              {[
                { label: "🌅 Breakfast", value: todayMeal.breakfast },
                { label: "☀️ Lunch", value: todayMeal.lunch },
                { label: "🌙 Dinner", value: todayMeal.dinner },
                { label: "🍎 Snack", value: todayMeal.snack },
              ].map((meal) => (
                <div key={meal.label} className="bg-cream-100 rounded-xl p-3">
                  <p className="text-sm font-bold text-warm-500">{meal.label}</p>
                  <p className="text-warm-700">{meal.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
