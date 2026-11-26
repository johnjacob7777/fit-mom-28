"use client";
// =============================================================
// SETTINGS PAGE — Edit quiz answers & adjust plan parameters
// =============================================================
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import DailyReminderCard from "@/components/DailyReminderCard";
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
  Droplets,
  Calendar,
  CreditCard,
  PauseCircle,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user, userData, loading, isDemoMode, updateUserDocument, logoutUser } = useAuth();

  const [age, setAge] = useState<string>("30");
  const [currentWeight, setCurrentWeight] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<string>("");
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(20);
  const [exerciseLocation, setExerciseLocation] = useState<string>("home_no_equipment");
  const [hasBabyUnder1, setHasBabyUnder1] = useState<boolean>(false);
  const [deliveryType, setDeliveryType] = useState<"vaginal" | "c_section" | "not_applicable">("not_applicable");
  const [isBreastfeeding, setIsBreastfeeding] = useState<boolean>(false);
  const [restDay, setRestDay] = useState<string>("Sunday");
  const [healthIssues, setHealthIssues] = useState<string[]>(["none"]);
  const [foodPreference, setFoodPreference] = useState<string>("vegetarian");

  const [saving, setSaving] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userData?.quizAnswers) {
      const q = userData.quizAnswers as any;
      if (q.age) setAge(String(q.age));
      if (q.currentWeight) setCurrentWeight(String(q.currentWeight));
      if (q.goalWeight) setGoalWeight(String(q.goalWeight));
      if (q.exerciseMinutes) setExerciseMinutes(Number(q.exerciseMinutes));
      if (q.exerciseLocation) setExerciseLocation(q.exerciseLocation);
      if (typeof q.hasBabyUnder1 === "boolean") setHasBabyUnder1(q.hasBabyUnder1);
      if (q.deliveryType) setDeliveryType(q.deliveryType);
      if (typeof q.isBreastfeeding === "boolean") setIsBreastfeeding(q.isBreastfeeding);
      if (q.restDay) setRestDay(String(q.restDay));
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
      age,
      currentWeight,
      goalWeight,
      exerciseMinutes,
      exerciseLocation,
      hasBabyUnder1,
      deliveryType: hasBabyUnder1 ? deliveryType : "not_applicable",
      isBreastfeeding,
      restDay,
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
        "progress.waterGoal": isBreastfeeding ? 11 : 8,
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

  const handleCancelMembership = async () => {
    setCancelling(true);
    try {
      const res = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeSubscriptionId: userData?.stripeSubscriptionId,
          stripeSessionId: userData?.stripeSessionId,
        }),
      });
      if (!res.ok) {
        alert("Could not cancel your Stripe billing yet. Please try again or contact support.");
        return;
      }

      await updateUserDocument({
        isPaid: false,
        subscriptionStatus: "cancelled",
      });
      setConfirmCancel(false);
      router.push("/checkout");
    } catch (err) {
      console.error("Error updating subscription status:", err);
      alert("Something went wrong while cancelling. Please try again.");
    } finally {
      setCancelling(false);
    }
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
            {/* Age & Optional Weight */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-plum mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min="16"
                  max="70"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-cream-50 border-2 border-peach-200 rounded-xl px-3 py-2.5 text-sm font-bold text-plum focus:border-plum focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-plum mb-1.5">
                  Current (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-cream-50 border-2 border-peach-200 rounded-xl px-3 py-2.5 text-sm font-bold text-plum focus:border-plum focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-plum mb-1.5">
                  Goal (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-cream-50 border-2 border-peach-200 rounded-xl px-3 py-2.5 text-sm font-bold text-plum focus:border-plum focus:outline-none"
                />
              </div>
            </div>

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
                  onClick={() => {
                    setHasBabyUnder1(false);
                    setDeliveryType("not_applicable");
                  }}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${
                    !hasBabyUnder1
                      ? "border-plum bg-peach-100/70 text-plum"
                      : "border-peach-200 bg-cream-50 text-plum/70"
                  }`}
                >
                  No
                </button>
              </div>

              {hasBabyUnder1 && (
                <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs font-semibold">
                  {[
                    { id: "vaginal", label: "Vaginal Birth" },
                    { id: "c_section", label: "C-Section Scar" },
                    { id: "not_applicable", label: "Skip" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() =>
                        setDeliveryType(opt.id as "vaginal" | "c_section" | "not_applicable")
                      }
                      className={`py-2 px-2 rounded-xl border transition-all ${
                        deliveryType === opt.id
                          ? "bg-plum text-white border-plum"
                          : "bg-cream-50 text-plum/75 border-peach-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Breastfeeding / Hydration Goal */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sage-600" /> Breastfeeding / Extra Hydration Support
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsBreastfeeding(true)}
                  className={`py-3 px-4 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${
                    isBreastfeeding
                      ? "border-plum bg-sage-50 text-plum"
                      : "border-peach-200 bg-cream-50 text-plum/70"
                  }`}
                >
                  Yes (11-Glass Goal)
                </button>
                <button
                  type="button"
                  onClick={() => setIsBreastfeeding(false)}
                  className={`py-3 px-4 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${
                    !isBreastfeeding
                      ? "border-plum bg-peach-100/70 text-plum"
                      : "border-peach-200 bg-cream-50 text-plum/70"
                  }`}
                >
                  Standard (8-Glass Goal)
                </button>
              </div>
            </div>

            {/* Preferred Weekly Rest Day */}
            <div>
              <label className="block text-sm font-bold text-plum mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-plum" /> Preferred Weekly Rest Day
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-xs font-bold">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                  (d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setRestDay(d)}
                      className={`py-2.5 px-1 rounded-xl border-2 transition-all ${
                        restDay === d
                          ? "border-plum bg-peach-100/70 text-plum"
                          : "border-peach-200 bg-cream-50 text-plum/60 hover:border-peach-300"
                      }`}
                    >
                      {d.slice(0, 3)}
                    </button>
                  )
                )}
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
                  { id: "diastasis_recti", label: "Diastasis Recti (Core Gap)" },
                  { id: "pelvic_heaviness", label: "Pelvic Floor Heaviness" },
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

        {/* Daily Window & Calendar Reminder Card */}
        <DailyReminderCard
          preferredTime={userData?.progress?.preferredWorkoutTime || "07:30"}
          onSavePreferredTime={async (time) => {
            await updateUserDocument({ "progress.preferredWorkoutTime": time });
          }}
        />

        {/* Membership & 1-Click Cancellation Card */}
        <div className="card-soft space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-heading font-bold text-xl text-plum flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-plum" /> Membership &amp; Access
              </h2>
              <p className="text-xs text-plum/65 mt-0.5">
                {isDemoMode
                  ? "Currently exploring in Instant Demo Preview Mode."
                  : userData?.isPaid
                  ? "Fit Mom 20 All-Access Membership (₹499/month) • No lock-in."
                  : "Membership paused or inactive."}
              </p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                userData?.isPaid
                  ? "bg-sage-100 text-sage-700 border-sage-200"
                  : "bg-peach-100 text-plum border-peach-200"
              }`}
            >
              {isDemoMode ? "Demo Active" : userData?.isPaid ? "Active" : "Inactive"}
            </span>
          </div>

          {userData?.isPaid && !confirmCancel && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-peach-100">
              <p className="text-xs text-plum/70">
                Need a break? Pause or cancel anytime with one tap — your saved progress stays safe.
              </p>
              <button
                type="button"
                onClick={() => setConfirmCancel(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-plum/75 hover:text-red-700 bg-cream-50 hover:bg-red-50 px-3.5 py-2 rounded-xl border border-peach-200 transition-colors"
              >
                <PauseCircle className="w-4 h-4" /> Pause / Cancel Membership
              </button>
            </div>
          )}

          {confirmCancel && (
            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4 space-y-3 text-xs">
              <p className="font-bold text-plum">
                Confirm pausing or cancelling your membership?
              </p>
              <p className="text-plum/75">
                You will be paused immediately and returned to the access screen. Your quiz answers and completed progress history remain safely saved whenever you decide to return.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCancelMembership}
                  disabled={cancelling}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  {cancelling ? "Updating..." : "Yes, Pause / Cancel Access"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmCancel(false)}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Keep Active
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
