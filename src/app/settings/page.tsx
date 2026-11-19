"use client";
// =============================================================
// SETTINGS PAGE — Edit quiz answers & adjust plan parameters
// =============================================================
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Save,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Home,
  Dumbbell,
  AlertCircle,
  Salad,
  Egg,
  Beef,
  Baby,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, userData, loading, updateUserDocument, logoutUser } = useAuth();

  const [exerciseMinutes, setExerciseMinutes] = useState<number>(20);
  const [exerciseLocation, setExerciseLocation] = useState<string>("home_no_equipment");
  const [hasBabyUnder1, setHasBabyUnder1] = useState<boolean>(false);
  const [healthIssues, setHealthIssues] = useState<string[]>(["none"]);
  const [foodPreference, setFoodPreference] = useState<string>("vegetarian");

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData?.quizAnswers) {
      const q = userData.quizAnswers as any;
      if (q.exerciseMinutes) setExerciseMinutes(Number(q.exerciseMinutes));
      if (q.exerciseLocation) setExerciseLocation(q.exerciseLocation);
      if (typeof q.hasBabyUnder1 === "boolean") setHasBabyUnder1(q.hasBabyUnder1);
      if (Array.isArray(q.healthIssues)) setHealthIssues(q.healthIssues);
      if (q.foodPreference) setFoodPreference(q.foodPreference);
    }
  }, [userData]);

  const toggleHealthIssue = (issue: string) => {
    if (issue === "none") {
      setHealthIssues(["none"]);
    } else {
      const withoutNone = healthIssues.filter((i) => i !== "none");
      if (withoutNone.includes(issue)) {
        const next = withoutNone.filter((i) => i !== issue);
        setHealthIssues(next.length > 0 ? next : ["none"]);
      } else {
        setHealthIssues([...withoutNone, issue]);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");

    const updatedAnswers = {
      ...(userData?.quizAnswers || {}),
      exerciseMinutes,
      exerciseLocation,
      hasBabyUnder1,
      healthIssues,
      foodPreference,
    };

    try {
      // Regenerate plan with updated quiz answers
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAnswers: updatedAnswers }),
      });
      const data = await res.json();

      await updateUserDocument({
        quizAnswers: updatedAnswers,
        ...(data.plan ? { plan: data.plan } : {}),
      });

      setSuccessMessage("Your fitness & meal plan has been updated! 🎉");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err) {
      console.error("Failed to update settings:", err);
      alert("Something went wrong while saving your changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-peach-200 border-t-plum rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-plum py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-plum/70 hover:text-plum transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 py-2 px-3.5 rounded-xl border border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Log out
          </button>
        </div>

        <div className="card-soft">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-plum mb-2">
            Plan & Account Settings
          </h1>
          <p className="text-sm text-plum/70 mb-6">
            Adjust your daily schedule, dietary choices, or recovery focus anytime.
          </p>

          {successMessage && (
            <div className="bg-sage-100 border border-sage-300 text-sage-800 p-4 rounded-2xl mb-6 flex items-center gap-3 animate-fade-in text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-sage-600 shrink-0" />
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Daily Exercise Minutes */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-plum" /> Daily Exercise Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[10, 20, 30].map((min) => (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setExerciseMinutes(min)}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                      exerciseMinutes === min
                        ? "border-plum bg-peach-100/70 text-plum"
                        : "border-peach-200 bg-cream-50 text-plum/70 hover:border-peach-300"
                    }`}
                  >
                    {min} Mins
                  </button>
                ))}
              </div>
            </div>

            {/* Exercise Location */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2 flex items-center gap-2">
                <Home className="w-4 h-4 text-plum" /> Exercise Setup
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setExerciseLocation("home_no_equipment")}
                  className={`p-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                    exerciseLocation === "home_no_equipment"
                      ? "border-plum bg-peach-100/70 text-plum"
                      : "border-peach-200 bg-cream-50 text-plum/70"
                  }`}
                >
                  <Home className="w-4 h-4 mb-1" />
                  Home (No equipment)
                </button>

                <button
                  type="button"
                  onClick={() => setExerciseLocation("home_light_equipment")}
                  className={`p-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                    exerciseLocation === "home_light_equipment"
                      ? "border-plum bg-peach-100/70 text-plum"
                      : "border-peach-200 bg-cream-50 text-plum/70"
                  }`}
                >
                  <Dumbbell className="w-4 h-4 mb-1" />
                  Home (Light equipment)
                </button>
              </div>
            </div>

            {/* Baby Under 1 */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2 flex items-center gap-2">
                <Baby className="w-4 h-4 text-plum" /> Baby Under 1 Year Old?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHasBabyUnder1(true)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                    hasBabyUnder1
                      ? "border-plum bg-peach-100/70 text-plum"
                      : "border-peach-200 bg-cream-50 text-plum/70"
                  }`}
                >
                  Yes (Gentle Postpartum)
                </button>
                <button
                  type="button"
                  onClick={() => setHasBabyUnder1(false)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                    !hasBabyUnder1
                      ? "border-plum bg-peach-100/70 text-plum"
                      : "border-peach-200 bg-cream-50 text-plum/70"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Pain or Health Issues */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-plum" /> Sensitive Areas / Recovery Focus
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {[
                  { id: "back_pain", label: "Lower Back Pain" },
                  { id: "knee_pain", label: "Knee Discomfort" },
                  { id: "other", label: "Other" },
                  { id: "none", label: "None" },
                ].map((item) => {
                  const isSelected = healthIssues.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleHealthIssue(item.id)}
                      className={`p-3 rounded-xl border-2 text-left flex items-center justify-between ${
                        isSelected
                          ? "border-plum bg-peach-100/70 text-plum"
                          : "border-peach-200 bg-cream-50 text-plum/60"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Food Preference */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2 flex items-center gap-2">
                <Salad className="w-4 h-4 text-plum" /> Food & Recipe Preference
              </label>
              <div className="grid sm:grid-cols-3 gap-2 text-xs font-semibold">
                {[
                  { id: "vegetarian", label: "Vegetarian", icon: Salad },
                  { id: "non_vegetarian", label: "Non-Veg", icon: Beef },
                  { id: "eggs_only", label: "Eggs Only", icon: Egg },
                ].map((diet) => {
                  const Icon = diet.icon;
                  const isSelected = foodPreference === diet.id;
                  return (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setFoodPreference(diet.id)}
                      className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 ${
                        isSelected
                          ? "border-plum bg-peach-100/70 text-plum"
                          : "border-peach-200 bg-cream-50 text-plum/60"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{diet.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-peach-200 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-1" />
                {saving ? "Saving Changes..." : "Save & Update Plan"}
              </button>
              <Link
                href="/dashboard"
                className="btn-secondary w-full sm:w-auto text-center"
              >
                Cancel
              </Link>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-peach-200 flex items-start gap-2 text-xs text-plum/60">
            <ShieldCheck className="w-4 h-4 text-plum shrink-0 mt-0.5" />
            <span>
              Updating your answers automatically recalculates your 4-week workout exercises and aligned meal recommendations.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
